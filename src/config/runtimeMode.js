/**
 * Single source of truth for runtime data mode.
 *
 * true  -> local-only storage paths (AsyncStorage + MMKV) are enabled.
 * false -> reserved for future backend reintroduction.
 */
export const LOCAL_ONLY_MODE_ENABLED = true;

// Backwards-compatible alias for older imports.
export const LOCAL_ONLY = LOCAL_ONLY_MODE_ENABLED;
