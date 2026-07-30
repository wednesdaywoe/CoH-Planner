/**
 * Types for `_display-text.cjs`, so the guard test in `src/data/` can import the
 * SAME predicate the converters apply rather than restating the rule in a second
 * regex that could drift away from the first one.
 */
export declare const MESSAGE_STORE_KEY: RegExp;
export declare function isUnresolvedMessageKey(value: unknown): boolean;
export declare function displayText(value: unknown): string | undefined;
