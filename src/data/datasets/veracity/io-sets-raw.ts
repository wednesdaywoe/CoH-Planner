/**
 * Veracity IO Set data — FIRST-PASS APPROXIMATION (re-exports HC).
 *
 * Veracity's boostsets.bin parses 257 IO sets, but the dedicated extractor
 * (scripts/extract-rebirth-io-sets-v2.py) is hardcoded for HC/Rebirth paths and
 * needs a Veracity mode before it can emit a real io-sets-raw here. Until then
 * we re-export Homecoming's curated set registry so enhancement slotting, set
 * bonuses, and the planner are fully functional. IO sets are largely shared
 * across servers, so this is a reasonable v1 — replace with the real Veracity
 * extraction when the extractor is ported.
 */

export { IO_SETS_RAW } from '../homecoming/io-sets-raw';
