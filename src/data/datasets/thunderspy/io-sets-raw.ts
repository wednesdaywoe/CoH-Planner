/**
 * Thunderspy IO Set data — FIRST-PASS APPROXIMATION (re-exports HC).
 *
 * Thunderspy's boostsets.bin parses 212 IO sets, but the dedicated extractor
 * (scripts/extract-rebirth-io-sets-v2.py) is hardcoded for HC/Rebirth paths and
 * needs a Thunderspy mode before it can emit a real io-sets-raw here. Until
 * then we re-export Homecoming's curated set registry so enhancement slotting,
 * set bonuses, and the build planner are fully functional. IO sets are largely
 * shared across servers, so this is a reasonable v1 — replace with the real
 * Thunderspy extraction when the extractor is ported.
 */

export { IO_SETS_RAW } from '../homecoming/io-sets-raw';
