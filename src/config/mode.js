/**
 * LOCAL_ONLY toggles the app's data strategy.
 *
 * true  -> all features read/write only local storage (AsyncStorage + MMKV),
 *          and any legacy remote-sync paths stay disabled.
 * false -> reserved for future backend reintroduction.
 */
export const LOCAL_ONLY = true;
