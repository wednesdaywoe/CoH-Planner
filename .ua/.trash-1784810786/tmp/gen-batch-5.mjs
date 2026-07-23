import fs from 'fs';

const extract = JSON.parse(fs.readFileSync('/home/jiiwii/Github/CoH-Sidekick/.ua/tmp/ua-file-extract-results-5.json', 'utf8'));
const input = JSON.parse(fs.readFileSync('/home/jiiwii/Github/CoH-Sidekick/.ua/tmp/ua-file-analyzer-input-5.json', 'utf8'));
const importData = input.batchImportData;

// ---- File-level metadata (summary, tags, complexity) ----
const fileMeta = {
  'src/components/enhancements/EnhancementIcon.tsx': {
    summary: 'Renders enhancement icons for every enhancement family (IO sets, generic IOs, origin, Hamidon/special), resolving layered base + overlay image paths from enhancement type and origin data.',
    tags: ['component', 'enhancement', 'icon-rendering', 'utility'],
    complexity: 'complex',
  },
  'src/components/enhancements/EnhancementPicker.tsx': {
    summary: 'The main enhancement-slotting UI: a large picker panel with sidebar categories for IO sets, procs, generic IOs, special and origin enhancements, including set-piece tooltips, stacked-count badges, and set bonus previews.',
    tags: ['component', 'enhancement', 'picker', 'entry-point', 'complex-ui'],
    complexity: 'complex',
  },
  'src/components/enhancements/SetBonusDisplay.tsx': {
    summary: 'Displays IO set bonuses for a slotted set, with per-bonus rows showing activation state and a summary view aggregating active bonuses across the build.',
    tags: ['component', 'enhancement', 'set-bonus', 'display'],
    complexity: 'moderate',
  },
  'src/components/enhancements/SetBonusList.tsx': {
    summary: 'Lists the set bonuses granted at each piece count for an IO set inside the picker, marking which bonuses are active given current slotting and Rule-of-5 caps.',
    tags: ['component', 'enhancement', 'set-bonus', 'display'],
    complexity: 'moderate',
  },
  'src/components/export-image/BuildImageCard.tsx': {
    summary: 'Off-screen "poster" component rendered for the Export-as-Image feature: lays out powers, slots, incarnates, character totals, and set bonuses into a fixed-width card that gets rasterized to an image.',
    tags: ['component', 'export', 'image-generation', 'build-summary'],
    complexity: 'complex',
  },
  'src/components/export-image/exportOptions.ts': {
    summary: 'Defines the configurable options for build-image export (stat section selections, presets) with helpers to apply a preset and create default options.',
    tags: ['config', 'export', 'options', 'utility'],
    complexity: 'moderate',
  },
  'src/components/incarnate/IncarnateSlotGrid.tsx': {
    summary: 'Compact grid of incarnate slots for the dashboard, rendering a mini tile per slot with selection state, tier coloring, and effect tooltips.',
    tags: ['component', 'incarnate', 'grid', 'display'],
    complexity: 'moderate',
  },
  'src/components/incarnate/index.ts': {
    summary: 'Barrel file re-exporting the incarnate UI components (slot button, slot grid, modals, power tree, Destiny time slider).',
    tags: ['barrel', 'entry-point', 'incarnate'],
    complexity: 'simple',
  },
  'src/components/info/PopOutInfoPanel.tsx': {
    summary: 'Floating-window wrapper that hosts the InfoPanel in a detachable pop-out window driven by UI store state.',
    tags: ['component', 'info-panel', 'floating-window'],
    complexity: 'simple',
  },
  'src/components/info/SetBonusPopup.tsx': {
    summary: 'Popup showing the aggregated set bonuses of the current build grouped by stat, with Rule-of-5 tracking and per-source breakdowns.',
    tags: ['component', 'set-bonus', 'popup', 'display'],
    complexity: 'complex',
  },
  'src/components/info/index.ts': {
    summary: 'Barrel file re-exporting the info components InfoPanel and PowerInfoTooltip.',
    tags: ['barrel', 'entry-point', 'info-panel'],
    complexity: 'simple',
  },
  'src/components/layout/ExemplarModeBanner.tsx': {
    summary: 'Banner shown when exemplar mode is active, reading the exemplar level from the UI store and offering a way to exit the mode.',
    tags: ['component', 'layout', 'banner', 'exemplar'],
    complexity: 'simple',
  },
  'src/components/layout/MainLayout.tsx': {
    summary: 'Top-level application layout composing the header, stats dashboard, info panels, banners, modals, enhancement picker, and mobile navigation, and wiring global hotkeys and status checks.',
    tags: ['component', 'layout', 'entry-point', 'composition'],
    complexity: 'moderate',
  },
  'src/components/layout/MobileBottomNav.tsx': {
    summary: 'Mobile bottom navigation bar with sheet-based menu and settings panels, inline SVG icons, and access to dashboard, incarnates, and app settings on small screens.',
    tags: ['component', 'layout', 'mobile', 'navigation'],
    complexity: 'complex',
  },
  'src/components/layout/MobileBuildBar.tsx': {
    summary: 'Slim mobile top bar exposing the character/build summary and quick actions, delegating to the shared Header component.',
    tags: ['component', 'layout', 'mobile', 'toolbar'],
    complexity: 'simple',
  },
  'src/components/layout/PinnedPowersBar.tsx': {
    summary: 'Bar rendering powers the user pinned for quick reference, each with its icon and perma-status ring, collected from all power categories in the build.',
    tags: ['component', 'layout', 'pinned-powers', 'display'],
    complexity: 'moderate',
  },
  'src/components/layout/StatsDashboard.tsx': {
    summary: 'The character stats dashboard: renders defense/resistance/misc stat groups with breakdown tooltips, cap indicators, collapsed row mode, incarnate grid, pinned powers, and action buttons. Central read-out of the whole calculation pipeline.',
    tags: ['component', 'layout', 'dashboard', 'stats', 'entry-point'],
    complexity: 'complex',
  },
  'src/components/layout/StatusBanner.tsx': {
    summary: 'Banner surfacing backend/service status fetched via the status-check hook (e.g. degraded share service notices).',
    tags: ['component', 'layout', 'banner', 'status'],
    complexity: 'simple',
  },
  'src/components/layout/UpdateBanner.tsx': {
    summary: 'Banner prompting the user to reload when a new app version is available, driven by update state in the store.',
    tags: ['component', 'layout', 'banner', 'update-notification'],
    complexity: 'simple',
  },
  'src/components/modals/AboutModal.tsx': {
    summary: 'About dialog with app credits, version information, and acknowledgements.',
    tags: ['component', 'modal', 'about', 'static-content'],
    complexity: 'simple',
  },
  'src/components/modals/AccoladesModal.tsx': {
    summary: 'Modal for toggling accolade powers on the build, listing each accolade with its passive bonuses from the accolade registry.',
    tags: ['component', 'modal', 'accolades', 'build-settings'],
    complexity: 'moderate',
  },
  'src/components/modals/AnnouncementModal.tsx': {
    summary: 'Modal presenting release announcements and the roadmap panel, reading announcement content from the data layer and tracking seen state in the store.',
    tags: ['component', 'modal', 'announcements', 'roadmap'],
    complexity: 'moderate',
  },
  'src/components/modals/BuildImageModal.tsx': {
    summary: 'Modal orchestrating the Export-as-Image flow: renders the off-screen BuildImageCard with selected options and drives rasterization/download via the export-image utility.',
    tags: ['component', 'modal', 'export', 'image-generation'],
    complexity: 'complex',
  },
  'src/components/modals/ConfirmModal.tsx': {
    summary: 'Generic confirmation dialog with configurable message and confirm/cancel actions.',
    tags: ['component', 'modal', 'confirmation', 'utility'],
    complexity: 'simple',
  },
  'src/components/modals/ControlsModal.tsx': {
    summary: 'Modal documenting keyboard shortcuts and mouse controls, organized into sections of control items.',
    tags: ['component', 'modal', 'help', 'keyboard-shortcuts'],
    complexity: 'moderate',
  },
  'src/components/modals/DetailedTotalsModal.tsx': {
    summary: 'Modal showing detailed character totals with per-stat breakdown panels and cap meters; can also load and compare a second build parsed from JSON or a shared-build link.',
    tags: ['component', 'modal', 'stats', 'build-compare'],
    complexity: 'complex',
  },
  'src/components/modals/DonateModal.tsx': {
    summary: 'Modal with donation links and supporter information.',
    tags: ['component', 'modal', 'donate', 'static-content'],
    complexity: 'simple',
  },
  'src/components/modals/EnhancementToolsModal.tsx': {
    summary: 'Modal exposing bulk enhancement tools (global IO level, attunement, clearing) that operate across the whole build via the stores.',
    tags: ['component', 'modal', 'enhancement', 'bulk-tools'],
    complexity: 'moderate',
  },
  'src/components/modals/ForumExportModal.tsx': {
    summary: 'Modal generating a forum-formatted (BBCode/text) export of the current build, with share-link creation via the shared-builds service and copy-to-clipboard.',
    tags: ['component', 'modal', 'export', 'forum'],
    complexity: 'moderate',
  },
};

// ---- Function-level metadata: which functions to emit, summary, tags ----
// key: `${path}::${name}` -> {summary, tags, complexity?}
const fnMeta = {
  'src/components/enhancements/EnhancementIcon.tsx::getOverlayPath': { summary: 'Resolves the overlay image path (set frame, rarity ring, attuned marker) for an enhancement based on its type and tier.', tags: ['utility', 'icon-path', 'enhancement'] },
  'src/components/enhancements/EnhancementIcon.tsx::getIOSetFolder': { summary: 'Maps an IO set category to the asset folder its icons live in.', tags: ['utility', 'icon-path', 'io-set'] },
  'src/components/enhancements/EnhancementIcon.tsx::getBaseIconPath': { summary: 'Computes the base icon image path for any enhancement variant (set piece, generic IO, origin, special).', tags: ['utility', 'icon-path', 'enhancement'] },
  'src/components/enhancements/EnhancementIcon.tsx::EnhancementIcon': { summary: 'Main icon component that layers base and overlay images to render any enhancement type at a given size.', tags: ['component', 'icon-rendering', 'enhancement'] },
  'src/components/enhancements/EnhancementIcon.tsx::IOSetIcon': { summary: 'Convenience icon component for an IO set piece.', tags: ['component', 'icon-rendering', 'io-set'] },
  'src/components/enhancements/EnhancementIcon.tsx::GenericIOIcon': { summary: 'Convenience icon component for a generic (common) IO enhancement.', tags: ['component', 'icon-rendering', 'generic-io'] },
  'src/components/enhancements/EnhancementIcon.tsx::OriginEnhancementIcon': { summary: 'Icon component for origin enhancements (TO/DO/SO), combining origin art with the stat glyph.', tags: ['component', 'icon-rendering', 'origin-enhancement'] },
  'src/components/enhancements/EnhancementIcon.tsx::SpecialEnhancementIcon': { summary: 'Icon component for special enhancements (Hamidon, Titan, Hydra, D-Sync, Prestige).', tags: ['component', 'icon-rendering', 'special-enhancement'] },

  'src/components/enhancements/EnhancementPicker.tsx::EnhancementPicker': { summary: 'Root picker component managing category selection, search, level/attunement controls, and slotting actions for the active power slot; over 1000 lines of orchestration.', tags: ['component', 'picker', 'enhancement', 'stateful'], complexity: 'complex' },
  'src/components/enhancements/EnhancementPicker.tsx::SidebarButton': { summary: 'Sidebar category button for the desktop picker layout.', tags: ['component', 'navigation', 'picker'] },
  'src/components/enhancements/EnhancementPicker.tsx::MobileCategoryButton': { summary: 'Category button variant for the mobile picker layout.', tags: ['component', 'navigation', 'mobile'] },
  'src/components/enhancements/EnhancementPicker.tsx::IOSetsContent': { summary: 'Renders the list of IO sets available for the current power category.', tags: ['component', 'io-set', 'list'] },
  'src/components/enhancements/EnhancementPicker.tsx::ProcsContent': { summary: 'Renders the proc-focused view listing sets by their proc pieces with effect labels and colors.', tags: ['component', 'proc', 'list'] },
  'src/components/enhancements/EnhancementPicker.tsx::IOSetRow': { summary: 'Expandable row for one IO set: pieces, slotting buttons, set bonuses, and stacked-count indicators.', tags: ['component', 'io-set', 'row', 'stateful'], complexity: 'complex' },
  'src/components/enhancements/EnhancementPicker.tsx::StackedCountBadge': { summary: 'Badge showing how many copies of a set/piece are already slotted across the build.', tags: ['component', 'badge', 'display'] },
  'src/components/enhancements/EnhancementPicker.tsx::GenericIOContent': { summary: 'Renders the generic (common) IO slotting options for the current power.', tags: ['component', 'generic-io', 'list'] },
  'src/components/enhancements/EnhancementPicker.tsx::SpecialContent': { summary: 'Renders special enhancement options (Hamidon, Titan, Hydra, D-Sync, Prestige) for the current power.', tags: ['component', 'special-enhancement', 'list'] },
  'src/components/enhancements/EnhancementPicker.tsx::OriginContent': { summary: 'Renders origin enhancement (TO/DO/SO) slotting options with tier selection.', tags: ['component', 'origin-enhancement', 'list'] },
  'src/components/enhancements/EnhancementPicker.tsx::SetPieceTooltip': { summary: 'Rich tooltip for a set piece showing enhancement values at level, proc details, and set bonus contributions.', tags: ['component', 'tooltip', 'io-set'], complexity: 'complex' },

  'src/components/enhancements/SetBonusDisplay.tsx::SetBonusDisplay': { summary: 'Displays the bonus list for one slotted IO set with active/inactive states.', tags: ['component', 'set-bonus', 'display'] },
  'src/components/enhancements/SetBonusDisplay.tsx::SetBonusItem': { summary: 'Renders a single set bonus entry with formatted value.', tags: ['component', 'set-bonus', 'display'] },
  'src/components/enhancements/SetBonusDisplay.tsx::BonusRow': { summary: 'Row rendering one bonus with piece-count requirement, active state, and Rule-of-5 cap indication.', tags: ['component', 'set-bonus', 'row'] },
  'src/components/enhancements/SetBonusDisplay.tsx::SetBonusSummary': { summary: 'Aggregated summary of all active set bonuses across the build, grouped for compact display.', tags: ['component', 'set-bonus', 'summary'] },

  'src/components/enhancements/SetBonusList.tsx::SetBonusList': { summary: 'Lists a set’s bonuses per piece count, computing active state from the build’s slotting and Rule-of-5 tracking.', tags: ['component', 'set-bonus', 'list'] },

  'src/components/export-image/BuildImageCard.tsx::SlotDots': { summary: 'Renders slot-count dots for a power tile in the export card.', tags: ['component', 'export', 'display'] },
  'src/components/export-image/BuildImageCard.tsx::SlotIcons': { summary: 'Renders the slotted enhancement icons for a power in the export card.', tags: ['component', 'export', 'icon-rendering'] },
  'src/components/export-image/BuildImageCard.tsx::PowerTile': { summary: 'Tile showing one power with its level, icon, and slotted enhancements in the export layout.', tags: ['component', 'export', 'power-display'] },
  'src/components/export-image/BuildImageCard.tsx::IncarnateTile': { summary: 'Tile showing a selected incarnate power in the export layout.', tags: ['component', 'export', 'incarnate'] },
  'src/components/export-image/BuildImageCard.tsx::MiniCapBar': { summary: 'Miniature bar visualizing a stat value against its cap.', tags: ['component', 'export', 'stats'] },
  'src/components/export-image/BuildImageCard.tsx::StatSectionCard': { summary: 'Card rendering one stat section (defense, resistance, etc.) of the character totals.', tags: ['component', 'export', 'stats'] },
  'src/components/export-image/BuildImageCard.tsx::SetBonusesBlock': { summary: 'Block listing active set bonuses on the exported build image.', tags: ['component', 'export', 'set-bonus'] },
  'src/components/export-image/BuildImageCard.tsx::Header': { summary: 'Header of the export card with character name, archetype, and powerset info.', tags: ['component', 'export', 'header'] },
  'src/components/export-image/BuildImageCard.tsx::BuildImageCard': { summary: 'ForwardRef root component assembling header, power tiles, incarnates, stat sections, and set bonuses into the fixed-width export poster.', tags: ['component', 'export', 'image-generation'], lineRange: [264, 341], complexity: 'complex' },

  'src/components/export-image/exportOptions.ts::applyPreset': { summary: 'Applies a named preset to the export options object.', tags: ['utility', 'export', 'options'] },
  'src/components/export-image/exportOptions.ts::createDefaultOptions': { summary: 'Creates the default export options with the standard stat-section selection.', tags: ['factory', 'export', 'options'] },

  'src/components/incarnate/IncarnateSlotGrid.tsx::IncarnateSlotGrid': { summary: 'Grid component laying out mini tiles for each incarnate slot.', tags: ['component', 'incarnate', 'grid'] },
  'src/components/incarnate/IncarnateSlotGrid.tsx::IncarnateSlotMini': { summary: 'Mini tile for one incarnate slot with selection display, tier color, toggle state, and effects tooltip.', tags: ['component', 'incarnate', 'tile'], complexity: 'moderate' },

  'src/components/info/PopOutInfoPanel.tsx::PopOutInfoPanel': { summary: 'Wraps InfoPanel in a FloatingWindow when the pop-out info panel mode is enabled.', tags: ['component', 'info-panel', 'floating-window'] },
  'src/components/info/SetBonusPopup.tsx::SetBonusPopup': { summary: 'Modal popup aggregating all set bonuses by stat group with Rule-of-5 status and per-set sources.', tags: ['component', 'set-bonus', 'popup'], complexity: 'complex' },

  'src/components/layout/ExemplarModeBanner.tsx::ExemplarModeBanner': { summary: 'Renders the exemplar-mode banner with current exemplar level and exit control.', tags: ['component', 'banner', 'exemplar'] },
  'src/components/layout/MainLayout.tsx::MainLayout': { summary: 'Composes the entire app shell: header, dashboard, info panels, banners, picker, modals, mobile nav, plus hotkey and status hooks.', tags: ['component', 'layout', 'composition'], complexity: 'moderate' },

  'src/components/layout/MobileBottomNav.tsx::MobileBottomNav': { summary: 'Bottom navigation bar controlling which mobile sheet (menu, settings, dashboard) is open.', tags: ['component', 'mobile', 'navigation'], complexity: 'moderate' },
  'src/components/layout/MobileBottomNav.tsx::NavButton': { summary: 'Single nav button with icon and active state.', tags: ['component', 'mobile', 'navigation'] },
  'src/components/layout/MobileBottomNav.tsx::MobileSheet': { summary: 'Bottom-sheet container with backdrop and slide-up animation.', tags: ['component', 'mobile', 'sheet'] },
  'src/components/layout/MobileBottomNav.tsx::MobileMenuContent': { summary: 'Menu sheet content with links to modals, export tools, community links, and auth actions.', tags: ['component', 'mobile', 'menu'], complexity: 'moderate' },
  'src/components/layout/MobileBottomNav.tsx::Section': { summary: 'Titled section wrapper used inside mobile sheets.', tags: ['component', 'mobile', 'layout'] },
  'src/components/layout/MobileBottomNav.tsx::MobileSettingsContent': { summary: 'Settings sheet content exposing display, theme, and gameplay toggles on mobile.', tags: ['component', 'mobile', 'settings'], complexity: 'moderate' },
  'src/components/layout/MobileBottomNav.tsx::ToggleRow': { summary: 'Labeled toggle row used in the mobile settings sheet.', tags: ['component', 'mobile', 'settings'] },

  'src/components/layout/MobileBuildBar.tsx::MobileBuildBar': { summary: 'Renders the compact mobile build bar hosting the shared Header in mobile mode.', tags: ['component', 'mobile', 'toolbar'] },

  'src/components/layout/PinnedPowersBar.tsx::collectBuildPowers': { summary: 'Collects all selected powers across primary/secondary/pool/epic categories of the build.', tags: ['utility', 'build', 'aggregation'] },
  'src/components/layout/PinnedPowersBar.tsx::PinnedPowersBar': { summary: 'Bar listing the user’s pinned powers with icons.', tags: ['component', 'pinned-powers', 'display'] },
  'src/components/layout/PinnedPowersBar.tsx::PinnedPowerItem': { summary: 'Single pinned power with icon and perma-ring indicator.', tags: ['component', 'pinned-powers', 'display'] },

  'src/components/layout/StatsDashboard.tsx::CollapsedDashboardRow': { summary: 'Compact single-row rendering of key stats when the dashboard is collapsed.', tags: ['component', 'dashboard', 'stats'] },
  'src/components/layout/StatsDashboard.tsx::StatsDashboard': { summary: 'Main dashboard component: reads calculated character stats and renders grouped stat items, incarnate grid, pinned powers, exemplar controls, and enemy-level adjuster.', tags: ['component', 'dashboard', 'stats'], complexity: 'complex' },
  'src/components/layout/StatsDashboard.tsx::DashboardActionButtons': { summary: 'Row of dashboard action buttons (detailed totals, set bonuses, config, collapse, etc.).', tags: ['component', 'dashboard', 'actions'] },
  'src/components/layout/StatsDashboard.tsx::StatItem': { summary: 'One stat display cell with value formatting, cap coloring, over-cap warnings, and breakdown tooltip.', tags: ['component', 'dashboard', 'stats'], complexity: 'moderate' },

  'src/components/layout/StatusBanner.tsx::StatusBanner': { summary: 'Renders the service-status banner based on the status-check hook result.', tags: ['component', 'banner', 'status'] },
  'src/components/layout/UpdateBanner.tsx::UpdateBanner': { summary: 'Renders the update-available banner with a reload action.', tags: ['component', 'banner', 'update-notification'] },

  'src/components/modals/AboutModal.tsx::AboutModal': { summary: 'Renders the About dialog content: credits, version, and acknowledgements.', tags: ['component', 'modal', 'about'] },
  'src/components/modals/AccoladesModal.tsx::AccoladesModal': { summary: 'Modal listing accolades with toggles that update the build’s accolade selection.', tags: ['component', 'modal', 'accolades'] },
  'src/components/modals/AnnouncementModal.tsx::AnnouncementModal': { summary: 'Modal rendering announcement entries and the roadmap panel with seen-state tracking.', tags: ['component', 'modal', 'announcements'] },
  'src/components/modals/BuildImageModal.tsx::Check': { summary: 'Checkbox row used for export option toggles.', tags: ['component', 'modal', 'form'] },
  'src/components/modals/BuildImageModal.tsx::BuildImageModal': { summary: 'Drives the image export: option selection, off-screen BuildImageCard rendering, rasterization, and PNG download/copy.', tags: ['component', 'modal', 'export'], complexity: 'complex' },
  'src/components/modals/ConfirmModal.tsx::ConfirmModal': { summary: 'Generic confirm/cancel dialog built on the shared Modal.', tags: ['component', 'modal', 'confirmation'] },
  'src/components/modals/ControlsModal.tsx::ControlSection': { summary: 'Section grouping of related control/shortcut entries.', tags: ['component', 'modal', 'help'] },
  'src/components/modals/ControlsModal.tsx::ControlsModal': { summary: 'Modal listing keyboard shortcuts and mouse controls by section.', tags: ['component', 'modal', 'help'] },

  'src/components/modals/DetailedTotalsModal.tsx::parseBuildFromJSON': { summary: 'Parses a pasted build-export JSON string into a comparable build object with validation.', tags: ['utility', 'parsing', 'build-import'] },
  'src/components/modals/DetailedTotalsModal.tsx::parseSharedBuild': { summary: 'Fetches and decodes a shared-build link into a comparable build via the sharedBuilds service.', tags: ['utility', 'parsing', 'shared-build'] },
  'src/components/modals/DetailedTotalsModal.tsx::buildToLoadedBuild': { summary: 'Normalizes a parsed build into the loaded-build shape used for comparison totals.', tags: ['utility', 'normalization', 'build-compare'] },
  'src/components/modals/DetailedTotalsModal.tsx::isNonZero': { summary: 'Predicate deciding whether a stat value (scalar or by-type) is non-zero and worth showing.', tags: ['utility', 'predicate', 'stats'] },
  'src/components/modals/DetailedTotalsModal.tsx::BreakdownPanel': { summary: 'Panel listing per-source contributions for a selected stat breakdown.', tags: ['component', 'stats', 'breakdown'] },
  'src/components/modals/DetailedTotalsModal.tsx::CapMeter': { summary: 'Meter visualizing a stat against its archetype cap.', tags: ['component', 'stats', 'display'] },
  'src/components/modals/DetailedTotalsModal.tsx::StatGrid': { summary: 'Grid of stat values for one section, optionally diffed against a comparison build.', tags: ['component', 'stats', 'grid'] },
  'src/components/modals/DetailedTotalsModal.tsx::DetailedTotalsModal': { summary: 'Modal shell wiring stat definitions, calculated totals, breakdowns, and the compare-build loader together.', tags: ['component', 'modal', 'stats'], complexity: 'complex' },

  'src/components/modals/DonateModal.tsx::DonateModal': { summary: 'Renders donation links and supporter thanks inside the shared Modal.', tags: ['component', 'modal', 'donate'] },
  'src/components/modals/EnhancementToolsModal.tsx::EnhancementToolsModal': { summary: 'Modal with bulk tools: set global IO level, toggle attunement, and clear enhancements across the build.', tags: ['component', 'modal', 'bulk-tools'], complexity: 'moderate' },
  'src/components/modals/EnhancementToolsModal.tsx::Section': { summary: 'Titled section wrapper for grouping tools in the modal.', tags: ['component', 'modal', 'layout'] },
  'src/components/modals/ForumExportModal.tsx::ForumExportModal': { summary: 'Modal generating forum-formatted build text, optional share-link creation, and clipboard copy.', tags: ['component', 'modal', 'export'], complexity: 'moderate' },
};

// exported function names per file (from script exports)
const exportsByFile = {};
for (const r of extract.results) {
  exportsByFile[r.path] = new Set((r.exports || []).map(e => e.name));
}

const nodes = [];
const edges = [];
const nodeIds = new Set();

function addNode(n) {
  if (nodeIds.has(n.id)) throw new Error('dup node ' + n.id);
  nodeIds.add(n.id);
  nodes.push(n);
}

for (const r of extract.results) {
  const meta = fileMeta[r.path];
  if (!meta) throw new Error('missing file meta for ' + r.path);
  const name = r.path.split('/').pop();
  addNode({
    id: 'file:' + r.path,
    type: 'file',
    name,
    filePath: r.path,
    summary: meta.summary,
    tags: meta.tags,
    complexity: meta.complexity,
    ...(meta.languageNotes ? { languageNotes: meta.languageNotes } : {}),
  });

  // function nodes
  const fns = (r.functions || []).slice();
  for (const fn of fns) {
    const key = r.path + '::' + fn.name;
    const fm = fnMeta[key];
    if (!fm) continue; // filtered out (trivial)
    const lines = fn.endLine - fn.startLine + 1;
    const fnId = 'function:' + r.path + ':' + fn.name;
    addNode({
      id: fnId,
      type: 'function',
      name: fn.name,
      filePath: r.path,
      lineRange: fm.lineRange || [fn.startLine, fn.endLine],
      summary: fm.summary,
      tags: fm.tags,
      complexity: fm.complexity || (lines > 200 ? 'complex' : lines >= 50 ? 'moderate' : 'simple'),
    });
    edges.push({ source: 'file:' + r.path, target: fnId, type: 'contains', direction: 'forward', weight: 1.0 });
    if (exportsByFile[r.path].has(fn.name)) {
      edges.push({ source: 'file:' + r.path, target: fnId, type: 'exports', direction: 'forward', weight: 0.8 });
    }
  }
  // BuildImageCard special case: not in script functions
  if (r.path === 'src/components/export-image/BuildImageCard.tsx') {
    const key = r.path + '::BuildImageCard';
    const fm = fnMeta[key];
    const fnId = 'function:' + r.path + ':BuildImageCard';
    addNode({
      id: fnId, type: 'function', name: 'BuildImageCard', filePath: r.path,
      lineRange: fm.lineRange, summary: fm.summary, tags: fm.tags, complexity: fm.complexity,
    });
    edges.push({ source: 'file:' + r.path, target: fnId, type: 'contains', direction: 'forward', weight: 1.0 });
    edges.push({ source: 'file:' + r.path, target: fnId, type: 'exports', direction: 'forward', weight: 0.8 });
  }
}

// imports edges — 1:1 from batchImportData
let importCount = 0;
for (const [file, targets] of Object.entries(importData)) {
  for (const t of targets) {
    edges.push({ source: 'file:' + file, target: 'file:' + t, type: 'imports', direction: 'forward', weight: 0.7 });
    importCount++;
  }
}

const expectedImports = Object.values(importData).reduce((a, v) => a + v.length, 0);
if (importCount !== expectedImports) throw new Error(`import count mismatch: ${importCount} vs ${expectedImports}`);

console.log('nodes:', nodes.length, 'edges:', edges.length, 'imports:', importCount);

// ---- split ----
const NODE_LIMIT = 60, EDGE_LIMIT = 120;
const outDir = '/home/jiiwii/Github/CoH-Sidekick/.ua/intermediate';
if (nodes.length <= NODE_LIMIT && edges.length <= EDGE_LIMIT) {
  fs.writeFileSync(outDir + '/batch-5.json', JSON.stringify({ nodes, edges }, null, 1));
  console.log('wrote single file');
} else {
  const parts = Math.ceil(Math.max(nodes.length / NODE_LIMIT, edges.length / EDGE_LIMIT));
  const files = input.batchFiles.map(f => f.path).sort();
  const chunkSize = Math.ceil(files.length / parts);
  for (let k = 0; k < parts; k++) {
    const chunk = new Set(files.slice(k * chunkSize, (k + 1) * chunkSize));
    const pNodes = nodes.filter(n => chunk.has(n.filePath));
    const pNodeIds = new Set(pNodes.map(n => n.id));
    const pEdges = edges.filter(e => {
      const srcFile = e.source.replace(/^(file|function|class):/, '').split(':')[0];
      return chunk.has(srcFile);
    });
    fs.writeFileSync(`${outDir}/batch-5-part-${k + 1}.json`, JSON.stringify({ nodes: pNodes, edges: pEdges }, null, 1));
    console.log(`part ${k + 1}: ${pNodes.length} nodes, ${pEdges.length} edges`);
  }
}
