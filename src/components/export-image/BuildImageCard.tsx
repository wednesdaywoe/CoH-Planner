/**
 * BuildImageCard — the off-screen "poster" that the Export-as-Image feature
 * rasterizes to PNG. Pure and prop-driven: it takes a build, the pre-computed
 * detailed-totals sections, active set bonuses, and the user's display options,
 * and lays them out at a fixed pixel width for deterministic output.
 *
 * Rendered off-screen by BuildImageModal (never in the normal planner flow) and
 * captured with html-to-image. It reuses SlottedEnhancementIcon and the shared
 * detailed-totals model so the image stays faithful to the app.
 */

import { forwardRef } from 'react';
import { DEFAULT_BUILD_NAME } from '@/types/build';
import type { Build } from '@/types/build';
import type { SelectedPower, Enhancement } from '@/types';
import { getPowerIconPath } from '@/data';
import { resolvePath } from '@/utils/paths';
import { getBuildPowers, getInherentPowers, getSelectedIncarnates, isPowerSlotted } from '@/utils/build-powers';
import type { SelectedIncarnatePower } from '@/types/incarnate';
import { isNonZeroStat, type StatSection } from '@/utils/detailed-totals';
import { capDescription, type StatCap } from '@/data/core/stat-caps';
import { SlottedEnhancementIcon } from '@/components/powers/SlottedEnhancementIcon';
import type { ExportImageOptions } from './exportOptions';
import type { SetBonus } from '@/types/enhancement';

/** Fixed render width in CSS px. Output resolution = this × the scale option. */
export const CARD_WIDTH = 1600;
/** Short builds are padded up to this minimum height so the image reads as a 16:9 landscape. */
export const CARD_MIN_HEIGHT = Math.round((CARD_WIDTH * 9) / 16);

/** Small uppercase zone label used above each region (Powers / Totals / Set Bonuses). */
function ZoneLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`text-[11px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5 ${className}`}>
      {children}
    </div>
  );
}

export interface ActiveSetBonus {
  setId: string;
  setName: string;
  piecesSlotted: number;
  bonuses: SetBonus[];
}

interface BuildImageCardProps {
  build: Build;
  /** Full computed detailed-totals sections (all 8); the card filters by options.statSections. */
  allStats: StatSection[];
  setBonuses: ActiveSetBonus[];
  options: ExportImageOptions;
  /** App theme + mode so the card re-skins to match (attributes cascade from index.css). */
  colorTheme: string;
  colorMode: 'light' | 'dark';
}

// ============================================
// POWER TILE
// ============================================

function SlotDots({ slots }: { slots: (Enhancement | null)[] }) {
  return (
    <div className="flex flex-wrap gap-[3px]">
      {slots.map((slot, i) => (
        <span
          key={i}
          className={`inline-block w-[9px] h-[9px] rounded-full border ${
            slot ? 'bg-emerald-500 border-emerald-300' : 'bg-slate-700 border-slate-600'
          }`}
        />
      ))}
    </div>
  );
}

function SlotIcons({ slots }: { slots: (Enhancement | null)[] }) {
  return (
    <div className="flex flex-wrap gap-[3px]">
      {slots.map((slot, i) =>
        slot ? (
          <span key={i} className="inline-flex" style={{ width: 20, height: 20 }}>
            <SlottedEnhancementIcon enhancement={slot} size={20} />
          </span>
        ) : (
          <span
            key={i}
            className="inline-block rounded-sm border border-dashed border-slate-600 bg-slate-800/60"
            style={{ width: 20, height: 20 }}
          />
        ),
      )}
    </div>
  );
}

function PowerTile({ power, showEnhancements }: { power: SelectedPower; showEnhancements: boolean }) {
  return (
    <div className="flex items-start gap-2 rounded-md bg-slate-800/60 border border-slate-700/70 px-2 py-1.5">
      <div className="relative shrink-0">
        <img
          src={getPowerIconPath(power.icon)}
          alt=""
          className="w-9 h-9 rounded"
          onError={(e) => {
            (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png');
          }}
        />
        <span className="absolute -top-1 -left-1 px-1 rounded bg-slate-900/90 border border-slate-600 text-[9px] leading-tight text-slate-300 tabular-nums">
          {power.level}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[12px] font-medium text-slate-100 leading-tight truncate">{power.name}</div>
        {power.slots.length > 0 && (
          <div className="mt-1">
            {showEnhancements ? <SlotIcons slots={power.slots} /> : <SlotDots slots={power.slots} />}
          </div>
        )}
      </div>
    </div>
  );
}

function IncarnateTile({ inc }: { inc: SelectedIncarnatePower }) {
  const slotLabel = inc.slotId.charAt(0).toUpperCase() + inc.slotId.slice(1);
  return (
    <div className="flex items-center gap-2 rounded-md bg-slate-800/60 border border-slate-700/70 px-2 py-1.5">
      <img
        src={getPowerIconPath(inc.icon)}
        alt=""
        className="w-9 h-9 rounded shrink-0"
        onError={(e) => {
          (e.target as HTMLImageElement).src = resolvePath('/img/Unknown.png');
        }}
      />
      <div className="min-w-0 flex-1">
        <div className="text-[12px] font-medium text-purple-200 leading-tight truncate">{inc.displayName}</div>
        <div className="text-[10px] text-slate-400 leading-tight truncate">{slotLabel}</div>
      </div>
    </div>
  );
}

// ============================================
// TOTALS
// ============================================

/** The poster's compact ceiling bar. Same reading as the sheet's CapMeter: the second segment
 *  is what sits past the ceiling, which for a softcap is defense the build really has. */
function MiniCapBar({ value, cap }: { value: number; cap: StatCap }) {
  const maxDisplay = cap.value * 1.3;
  const cappedPct = (Math.min(value, cap.value) / maxDisplay) * 100;
  const overflowPct = (Math.max(0, value - cap.value) / maxDisplay) * 100;
  return (
    <div className="h-[4px] mt-[2px] bg-slate-700/80 rounded-full overflow-hidden relative" title={capDescription(cap)}>
      <div className="absolute inset-y-0 left-0 rounded-full bg-emerald-500/80" style={{ width: `${cappedPct}%` }} />
      {overflowPct > 0 && (
        <div className="absolute inset-y-0 rounded-full bg-amber-500/70" style={{ left: `${cappedPct}%`, width: `${overflowPct}%` }} />
      )}
      <div className="absolute inset-y-0 w-px bg-slate-300/50" style={{ left: `${(cap.value / maxDisplay) * 100}%` }} />
    </div>
  );
}

function StatSectionCard({ section }: { section: StatSection }) {
  return (
    <div className="rounded-lg bg-slate-800/70 border border-slate-700 p-2.5 mb-2" style={{ breakInside: 'avoid' }}>
      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
        {section.name}
      </div>
      <div className="space-y-[3px]">
        {section.stats.map((stat) => {
          const has = isNonZeroStat(stat.value);
          const showBar = stat.cap != null && typeof stat.value === 'number' && (stat.value as number) > 0;
          return (
            <div key={stat.id}>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[11px] text-slate-400 truncate">{stat.label}</span>
                <span className={`text-[12px] font-medium tabular-nums shrink-0 ${has ? stat.color : 'text-slate-600'}`}>
                  {stat.format(stat.value)}
                </span>
              </div>
              {showBar && <MiniCapBar value={stat.value as number} cap={stat.cap as StatCap} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Totals sections in a balanced multi-column masonry (keeps the block wide + short). */
function TotalsSections({ sections }: { sections: StatSection[] }) {
  return (
    <div style={{ columnCount: Math.min(4, sections.length), columnGap: '0.5rem' }}>
      {sections.map((section) => (
        <StatSectionCard key={section.name} section={section} />
      ))}
    </div>
  );
}

// ============================================
// SET BONUSES
// ============================================

function SetBonusesBlock({ setBonuses }: { setBonuses: ActiveSetBonus[] }) {
  if (setBonuses.length === 0) return null;
  return (
    <div className="mt-3">
      <ZoneLabel>Active Set Bonuses</ZoneLabel>
      <div style={{ columnCount: Math.min(5, setBonuses.length), columnGap: '1rem' }}>
        {setBonuses.map((sb) => {
          const descs = sb.bonuses.flatMap((b) => b.effects.filter((e) => !e.pvp).map((e) => e.desc));
          return (
            <div key={sb.setId} className="mb-2 rounded-md bg-slate-800/60 border border-slate-700/70 px-2 py-1.5" style={{ breakInside: 'avoid' }}>
              <div className="text-[11px] font-medium text-emerald-300">
                {sb.setName} <span className="text-slate-500">×{sb.piecesSlotted}</span>
              </div>
              <div className="text-[10px] text-slate-400 leading-snug">
                {descs.join(' · ')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================
// HEADER
// ============================================

function Header({ build, options }: { build: Build; options: ExportImageOptions }) {
  const at = build.archetype?.name || 'Unknown AT';
  const pri = build.primary?.name;
  const sec = build.secondary?.name;
  const combo = [pri, sec].filter(Boolean).join(' / ');

  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-700 pb-3 mb-3">
      <div className="min-w-0">
        <div className="text-[22px] font-bold text-slate-50 leading-tight truncate">
          {build.name || DEFAULT_BUILD_NAME}
        </div>
        <div className="text-[13px] text-cyan-300 mt-0.5">
          {at}
          {combo && <span className="text-slate-400"> — {combo}</span>}
        </div>
        {options.authorName.trim() && (
          <div className="text-[12px] text-slate-400 mt-0.5">by {options.authorName.trim()}</div>
        )}
      </div>
      <div className="text-right text-[12px] text-slate-400 shrink-0 space-y-0.5">
        {options.showLevel && <div>Level {build.level}</div>}
        {options.showOrigin && build.settings?.origin && <div>{build.settings.origin}</div>}
      </div>
    </div>
  );
}

// ============================================
// CARD
// ============================================

export const BuildImageCard = forwardRef<HTMLDivElement, BuildImageCardProps>(function BuildImageCard(
  { build, allStats, setBonuses, options, colorTheme, colorMode },
  ref,
) {
  const slottedFilter = (list: SelectedPower[]) => (options.onlySlotted ? list.filter(isPowerSlotted) : list);
  const powers = slottedFilter(getBuildPowers(build));
  const inherents = options.showInherents ? slottedFilter(getInherentPowers(build)) : [];
  const incarnates = options.showIncarnates ? getSelectedIncarnates(build) : [];
  const sections = allStats.filter((s) => options.statSections.includes(s.name));
  const hasTotals = sections.length > 0;

  // Zones stack full-width and each flows into several columns, so the poster
  // stays wide-and-short (roughly landscape) rather than a tall two-column
  // strip. More power columns when there are many tiles keeps height down.
  const powerCols = powers.length + inherents.length > 24 ? 5 : 4;
  // Inline template-columns — a `grid-cols-${n}` class string wouldn't be seen
  // by Tailwind's JIT scanner (see the same caveat in StatsDashboard).
  const powerGridStyle = { display: 'grid', gap: '0.375rem', gridTemplateColumns: `repeat(${powerCols}, minmax(0, 1fr))` };

  return (
    <div
      ref={ref}
      data-theme={colorTheme || undefined}
      data-mode={colorMode === 'light' ? 'light' : undefined}
      className={`${options.transparent ? '' : 'bg-gray-950'} text-gray-100 p-6 flex flex-col`}
      style={{ width: CARD_WIDTH, minHeight: CARD_MIN_HEIGHT, fontFamily: 'system-ui, sans-serif' }}
    >
      <Header build={build} options={options} />

      {/* Powers */}
      <ZoneLabel>Powers by Level</ZoneLabel>
      <div style={powerGridStyle}>
        {powers.map((p) => (
          <PowerTile key={`${p.powerSet}:${p.internalName}`} power={p} showEnhancements={options.showEnhancements} />
        ))}
      </div>

      {inherents.length > 0 && (
        <>
          <ZoneLabel className="mt-3">Inherent Powers</ZoneLabel>
          <div style={powerGridStyle}>
            {inherents.map((p) => (
              <PowerTile key={`inh:${p.internalName}`} power={p} showEnhancements={options.showEnhancements} />
            ))}
          </div>
        </>
      )}

      {incarnates.length > 0 && (
        <>
          <ZoneLabel className="mt-3">Incarnates</ZoneLabel>
          <div style={powerGridStyle}>
            {incarnates.map((inc) => (
              <IncarnateTile key={inc.slotId} inc={inc} />
            ))}
          </div>
        </>
      )}

      {/* Totals */}
      {hasTotals && (
        <div className="mt-3">
          <ZoneLabel>Character Totals</ZoneLabel>
          <TotalsSections sections={sections} />
        </div>
      )}

      {options.showSetBonuses && <SetBonusesBlock setBonuses={setBonuses} />}

      {options.showCredit && (
        <div className="mt-auto pt-3 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
          <span>Made with coh-sidekick.com</span>
          <span>{new Date().toISOString().slice(0, 10)}</span>
        </div>
      )}
    </div>
  );
});
