/**
 * MXD Import Module
 *
 * Converts Mids Reborn legacy .mxd files into our Build format.
 * Exports a single function that takes raw file text and returns a Build.
 */

export { parseMxdText } from './parser';
export { importMxdBuild } from './importer';
export type { MxdParsedBuild, MxdParsedPower, MxdParsedEnhancement } from './parser';
export { SET_ABBREVIATIONS, GENERIC_ABBREVIATIONS, CLASS_TO_ARCHETYPE } from './abbreviations';
