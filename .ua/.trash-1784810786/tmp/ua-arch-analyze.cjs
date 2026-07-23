#!/usr/bin/env node
// Structural analysis for architecture layer identification.
const fs = require('fs');

function main() {
  const [inPath, outPath] = process.argv.slice(2);
  if (!inPath || !outPath) { console.error('usage: node ua-arch-analyze.js <input.json> <output.json>'); process.exit(1); }
  const data = JSON.parse(fs.readFileSync(inPath, 'utf8'));
  const fileNodes = data.fileNodes || [];
  const importEdges = data.importEdges || [];
  const allEdges = data.allEdges || data.allFileLevelEdges || [];

  const nodeById = new Map(fileNodes.map(n => [n.id, n]));

  // --- A. Directory grouping ---
  // Compute common path prefix (directory-wise)
  const paths = fileNodes.map(n => n.filePath);
  function commonPrefixDirs(ps) {
    if (!ps.length) return [];
    let prefix = ps[0].split('/').slice(0, -1);
    for (const p of ps) {
      const segs = p.split('/').slice(0, -1);
      let i = 0;
      while (i < prefix.length && i < segs.length && prefix[i] === segs[i]) i++;
      prefix = prefix.slice(0, i);
      if (!prefix.length) break;
    }
    return prefix;
  }
  const prefix = commonPrefixDirs(paths); // likely [] since scripts/ + src/ both present
  const prefixLen = prefix.length;

  function groupOf(node) {
    const segs = node.filePath.split('/');
    const rel = segs.slice(prefixLen);
    if (rel.length <= 1) return '(root)';
    // Use up to two levels for src/* to get meaningful groups
    if (rel[0] === 'src' && rel.length > 2) return 'src/' + rel[1];
    return rel[0];
  }

  const directoryGroups = {};
  for (const n of fileNodes) {
    const g = groupOf(n);
    (directoryGroups[g] = directoryGroups[g] || []).push(n.id);
  }

  // Sub-grouping for large groups (components, utils, data) — informational
  const subGroups = {};
  for (const n of fileNodes) {
    const segs = n.filePath.split('/');
    if (segs.length > 3 && segs[0] === 'src') {
      const key = segs.slice(0, 3).join('/');
      (subGroups[key] = subGroups[key] || []).push(n.id);
    }
  }
  const subGroupCounts = Object.fromEntries(Object.entries(subGroups).map(([k, v]) => [k, v.length]));

  // --- B. Node type grouping ---
  const nodeTypeGroups = {};
  for (const n of fileNodes) (nodeTypeGroups[n.type] = nodeTypeGroups[n.type] || []).push(n.id);

  // --- C. Import adjacency: fan-in / fan-out ---
  const fanIn = {}, fanOut = {};
  const groupImports = {}; // groupA -> groupB -> count
  for (const e of importEdges) {
    fanOut[e.source] = (fanOut[e.source] || 0) + 1;
    fanIn[e.target] = (fanIn[e.target] || 0) + 1;
    const sn = nodeById.get(e.source), tn = nodeById.get(e.target);
    if (sn && tn) {
      const sg = groupOf(sn), tg = groupOf(tn);
      groupImports[sg] = groupImports[sg] || {};
      groupImports[sg][tg] = (groupImports[sg][tg] || 0) + 1;
    }
  }

  // --- D. Cross-category dependency analysis ---
  const crossCat = {};
  for (const e of allEdges) {
    const sn = nodeById.get(e.source), tn = nodeById.get(e.target);
    if (!sn || !tn) continue;
    if (sn.type === tn.type && sn.type === 'file' && e.type === 'imports') continue; // covered above
    const key = `${sn.type}|${tn.type}|${e.type}`;
    crossCat[key] = (crossCat[key] || 0) + 1;
  }
  const crossCategoryEdges = Object.entries(crossCat).map(([k, count]) => {
    const [fromType, toType, edgeType] = k.split('|');
    return { fromType, toType, edgeType, count };
  }).sort((a, b) => b.count - a.count);

  // --- E. Inter-group import frequency ---
  const interGroupImports = [];
  for (const [from, tos] of Object.entries(groupImports)) {
    for (const [to, count] of Object.entries(tos)) {
      if (from !== to) interGroupImports.push({ from, to, count });
    }
  }
  interGroupImports.sort((a, b) => b.count - a.count);

  // --- F. Intra-group density ---
  const intraGroupDensity = {};
  for (const g of Object.keys(directoryGroups)) {
    let internal = 0, total = 0;
    for (const e of importEdges) {
      const sn = nodeById.get(e.source), tn = nodeById.get(e.target);
      if (!sn || !tn) continue;
      const sg = groupOf(sn), tg = groupOf(tn);
      if (sg === g || tg === g) {
        total++;
        if (sg === g && tg === g) internal++;
      }
    }
    intraGroupDensity[g] = { internalEdges: internal, totalEdges: total, density: total ? +(internal / total).toFixed(3) : 0 };
  }

  // --- G. Directory pattern matching ---
  const DIR_PATTERNS = {
    api: ['routes', 'api', 'controllers', 'endpoints', 'handlers', 'serializers', 'controller', 'routers', 'blueprints'],
    service: ['services', 'core', 'lib', 'domain', 'logic', 'signals', 'internal', 'composables', 'mailers', 'jobs', 'channels'],
    data: ['models', 'db', 'data', 'persistence', 'repository', 'entities', 'migrations', 'entity', 'sql', 'database', 'schema'],
    ui: ['components', 'views', 'pages', 'ui', 'layouts', 'screens'],
    middleware: ['middleware', 'plugins', 'interceptors', 'guards'],
    utility: ['utils', 'helpers', 'common', 'shared', 'tools', 'pkg', 'templatetags'],
    config: ['config', 'constants', 'env', 'settings', 'management', 'commands'],
    test: ['__tests__', 'test', 'tests', 'spec', 'specs'],
    types: ['types', 'interfaces', 'schemas', 'contracts', 'dtos', 'dto', 'request', 'response'],
    hooks: ['hooks'],
    state: ['store', 'state', 'reducers', 'actions', 'slices', 'stores'],
    assets: ['assets', 'static', 'public'],
    entry: ['cmd', 'bin'],
    documentation: ['docs', 'documentation', 'wiki'],
    infrastructure: ['deploy', 'deployment', 'infra', 'infrastructure', 'k8s', 'kubernetes', 'helm', 'charts', 'terraform', 'tf', 'docker'],
    'ci-cd': ['.github', '.gitlab', '.circleci'],
  };
  const patternMatches = {};
  for (const g of Object.keys(directoryGroups)) {
    const base = g.split('/').pop().toLowerCase();
    let label = null;
    for (const [lbl, names] of Object.entries(DIR_PATTERNS)) {
      if (names.includes(base)) { label = lbl; break; }
    }
    patternMatches[g] = label || 'unknown';
  }

  // File-level pattern hints
  const filePatternHints = {};
  for (const n of fileNodes) {
    const p = n.filePath, b = p.split('/').pop();
    if (/\.(test|spec)\.[jt]sx?$/.test(b)) filePatternHints[n.id] = 'test';
    else if (/\.d\.ts$/.test(b)) filePatternHints[n.id] = 'types';
    else if (/\.md$|\.rst$/.test(b)) filePatternHints[n.id] = 'documentation';
    else if (/\.sql$/.test(b)) filePatternHints[n.id] = 'data';
    else if (/\.(graphql|gql|proto)$/.test(b)) filePatternHints[n.id] = 'types';
    else if (b === 'Dockerfile' || /^docker-compose\./.test(b)) filePatternHints[n.id] = 'infrastructure';
    else if (b === 'Makefile') filePatternHints[n.id] = 'infrastructure';
    else if (/^(package\.json|tsconfig.*\.json|vite\.config.*|vitest\.config.*|tailwind\.config.*|postcss\.config.*|eslint.*)$/.test(b)) filePatternHints[n.id] = 'config';
  }

  // --- H. Deployment topology ---
  const infraFiles = fileNodes.filter(n => ['infrastructure', 'ci-cd'].includes(filePatternHints[n.id])).map(n => n.filePath);
  const deploymentTopology = {
    hasDockerfile: paths.some(p => /(^|\/)Dockerfile/.test(p)),
    hasCompose: paths.some(p => /docker-compose/.test(p)),
    hasK8s: false, hasTerraform: false,
    hasCI: paths.some(p => p.includes('.github/workflows')),
    infraFiles,
  };

  // --- I. Data pipeline ---
  const dataPipeline = {
    schemaFiles: paths.filter(p => /\.(graphql|proto|prisma)$|schema\.(sql|json)$/.test(p)),
    migrationFiles: paths.filter(p => /migrations\//.test(p)),
    dataModelFiles: fileNodes.filter(n => /^src\/data\//.test(n.filePath)).map(n => n.filePath).slice(0, 20),
    apiHandlerFiles: fileNodes.filter(n => /^src\/services\//.test(n.filePath)).map(n => n.filePath),
  };

  // --- J. Documentation coverage ---
  const groupsList = Object.keys(directoryGroups);
  const groupsWithDocs = groupsList.filter(g =>
    directoryGroups[g].some(id => (nodeById.get(id).filePath || '').endsWith('.md')));
  const docCoverage = {
    groupsWithDocs: groupsWithDocs.length,
    totalGroups: groupsList.length,
    coverageRatio: groupsList.length ? +(groupsWithDocs.length / groupsList.length).toFixed(2) : 0,
    undocumentedGroups: groupsList.filter(g => !groupsWithDocs.includes(g)),
  };

  // --- K. Dependency direction ---
  const dependencyDirection = [];
  const seenPairs = new Set();
  for (const { from, to, count } of interGroupImports) {
    const key = [from, to].sort().join('|');
    if (seenPairs.has(key)) continue;
    seenPairs.add(key);
    const rev = (groupImports[to] && groupImports[to][from]) || 0;
    if (count >= rev) dependencyDirection.push({ dependent: from, dependsOn: to, forward: count, reverse: rev });
    else dependencyDirection.push({ dependent: to, dependsOn: from, forward: rev, reverse: count });
  }

  // --- Stats ---
  const filesPerGroup = Object.fromEntries(Object.entries(directoryGroups).map(([g, v]) => [g, v.length]));
  const nodeTypeCounts = Object.fromEntries(Object.entries(nodeTypeGroups).map(([t, v]) => [t, v.length]));

  const topFanIn = Object.fromEntries(Object.entries(fanIn).sort((a, b) => b[1] - a[1]).slice(0, 25));
  const topFanOut = Object.fromEntries(Object.entries(fanOut).sort((a, b) => b[1] - a[1]).slice(0, 25));

  // Test files per group (helps decide on a test layer)
  const testFilesByGroup = {};
  for (const [id, hint] of Object.entries(filePatternHints)) {
    if (hint === 'test') {
      const g = groupOf(nodeById.get(id));
      (testFilesByGroup[g] = testFilesByGroup[g] || []).push(id);
    }
  }
  const testFileCount = Object.values(testFilesByGroup).reduce((a, v) => a + v.length, 0);

  const out = {
    scriptCompleted: true,
    commonPrefix: prefix.join('/'),
    directoryGroups,
    subGroupCounts,
    nodeTypeGroups,
    crossCategoryEdges,
    interGroupImports,
    intraGroupDensity,
    patternMatches,
    filePatternHints,
    testFileCount,
    testFilesByGroup: Object.fromEntries(Object.entries(testFilesByGroup).map(([g, v]) => [g, v.length])),
    deploymentTopology,
    dataPipeline: { ...dataPipeline, dataModelFileCount: fileNodes.filter(n => /^src\/data\//.test(n.filePath)).length },
    docCoverage,
    dependencyDirection,
    fileStats: { totalFileNodes: fileNodes.length, filesPerGroup, nodeTypeCounts },
    fileFanIn: topFanIn,
    fileFanOut: topFanOut,
  };
  fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
  console.log('OK: analyzed', fileNodes.length, 'nodes,', importEdges.length, 'import edges,', allEdges.length, 'all edges');
}

try { main(); } catch (err) { console.error('FATAL:', err && err.stack || err); process.exit(1); }
