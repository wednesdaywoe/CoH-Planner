#!/usr/bin/env node
// Graph topology analysis for tour design
const fs = require('fs');

try {
  const [inputPath, outputPath] = process.argv.slice(2);
  if (!inputPath || !outputPath) throw new Error('Usage: node ua-tour-analyze.cjs <input.json> <output.json>');
  const { nodes, edges, layers } = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

  const nodeById = new Map(nodes.map(n => [n.id, n]));
  const fanIn = new Map(), fanOut = new Map();
  for (const n of nodes) { fanIn.set(n.id, 0); fanOut.set(n.id, 0); }
  const fwd = new Map(); // adjacency for imports/calls
  for (const e of edges) {
    if (!nodeById.has(e.source) || !nodeById.has(e.target)) continue;
    fanOut.set(e.source, fanOut.get(e.source) + 1);
    fanIn.set(e.target, fanIn.get(e.target) + 1);
    if (e.type === 'imports' || e.type === 'calls') {
      if (!fwd.has(e.source)) fwd.set(e.source, []);
      fwd.get(e.source).push(e.target);
    }
  }

  const byDesc = m => [...m.entries()].sort((a, b) => b[1] - a[1]);
  const fanInRanking = byDesc(fanIn).slice(0, 20).map(([id, v]) => ({ id, fanIn: v, name: nodeById.get(id).name }));
  const fanOutRanking = byDesc(fanOut).slice(0, 20).map(([id, v]) => ({ id, fanOut: v, name: nodeById.get(id).name }));

  // Entry point scoring
  const entryNames = new Set(['index.ts','index.js','main.ts','main.js','app.ts','app.js','server.ts','server.js','mod.rs','main.go','main.py','main.rs','manage.py','app.py','wsgi.py','asgi.py','run.py','__main__.py','Application.java','Main.java','Program.cs','config.ru','index.php','App.swift','Application.kt','main.cpp','main.c','main.tsx','App.tsx','index.tsx','app.tsx']);
  const fanOutVals = [...fanOut.values()].sort((a, b) => b - a);
  const fanInVals = [...fanIn.values()].sort((a, b) => a - b);
  const fanOutTop10 = fanOutVals[Math.floor(fanOutVals.length * 0.1)] ?? Infinity;
  const fanInBot25 = fanInVals[Math.floor(fanInVals.length * 0.25)] ?? 0;

  const candidates = [];
  for (const n of nodes) {
    let score = 0;
    const fp = n.filePath || '';
    const depth = fp.split('/').length - 1;
    if (n.type === 'document') {
      if (n.name === 'README.md' && depth === 0) score += 5;
      else if (n.name.endsWith('.md') && depth === 0) score += 2;
    } else if (n.type === 'file') {
      if (entryNames.has(n.name)) score += 3;
      if (depth <= 1) score += 1;
      if (fanOut.get(n.id) >= fanOutTop10 && fanOut.get(n.id) > 0) score += 1;
      if (fanIn.get(n.id) <= fanInBot25) score += 1;
    }
    if (score > 0) candidates.push({ id: n.id, score, name: n.name, type: n.type, summary: (n.summary || '').slice(0, 200) });
  }
  candidates.sort((a, b) => b.score - a.score);
  const entryPointCandidates = candidates.slice(0, 8);

  // BFS from top code entry point
  const topCode = candidates.find(c => nodeById.get(c.id).type === 'file');
  const bfsTraversal = { startNode: null, order: [], depthMap: {}, byDepth: {} };
  if (topCode) {
    bfsTraversal.startNode = topCode.id;
    const seen = new Set([topCode.id]);
    let frontier = [topCode.id], depth = 0;
    while (frontier.length) {
      bfsTraversal.byDepth[depth] = frontier.slice();
      for (const id of frontier) { bfsTraversal.order.push(id); bfsTraversal.depthMap[id] = depth; }
      const next = [];
      for (const id of frontier) for (const t of fwd.get(id) || []) if (!seen.has(t)) { seen.add(t); next.push(t); }
      frontier = next; depth++;
    }
  }

  // Non-code inventory
  const cat = t => ({ document: 'documentation', service: 'infrastructure', pipeline: 'infrastructure', resource: 'infrastructure', table: 'data', schema: 'data', endpoint: 'data', config: 'config' })[t];
  const nonCodeFiles = { documentation: [], infrastructure: [], data: [], config: [] };
  for (const n of nodes) {
    const c = cat(n.type);
    if (c) nonCodeFiles[c].push({ id: n.id, name: n.name, type: n.type, summary: (n.summary || '').slice(0, 250) });
  }

  // Clusters: bidirectional pairs, expand by 2+ connections
  const edgeSet = new Set(edges.filter(e => e.type === 'imports' || e.type === 'calls').map(e => e.source + '|' + e.target));
  const clusters = [];
  const inCluster = new Set();
  for (const key of edgeSet) {
    const [a, b] = key.split('|');
    if (a < b && edgeSet.has(b + '|' + a) && !inCluster.has(a) && !inCluster.has(b)) {
      const cluster = new Set([a, b]);
      for (const n of nodes) {
        if (cluster.has(n.id) || cluster.size >= 5) continue;
        let conn = 0;
        for (const m of cluster) if (edgeSet.has(n.id + '|' + m) || edgeSet.has(m + '|' + n.id)) conn++;
        if (conn >= 2) cluster.add(n.id);
      }
      let ec = 0;
      for (const x of cluster) for (const y of cluster) if (x !== y && edgeSet.has(x + '|' + y)) ec++;
      clusters.push({ nodes: [...cluster], edgeCount: ec });
      for (const x of cluster) inCluster.add(x);
    }
  }
  clusters.sort((a, b) => b.edgeCount - a.edgeCount);

  const nodeSummaryIndex = {};
  for (const n of nodes) nodeSummaryIndex[n.id] = { name: n.name, type: n.type, filePath: n.filePath, fanIn: fanIn.get(n.id), summary: (n.summary || '').slice(0, 300) };

  const out = {
    scriptCompleted: true,
    entryPointCandidates,
    fanInRanking,
    fanOutRanking,
    bfsTraversal,
    nonCodeFiles,
    clusters: clusters.slice(0, 10),
    layers: { count: layers.length, list: layers },
    nodeSummaryIndex,
    totalNodes: nodes.length,
    totalEdges: edges.length,
  };
  fs.writeFileSync(outputPath, JSON.stringify(out, null, 2));
  console.log('OK: wrote', outputPath);
} catch (err) {
  console.error('FATAL:', err.message);
  process.exit(1);
}
