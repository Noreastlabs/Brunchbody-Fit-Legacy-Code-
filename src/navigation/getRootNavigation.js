export const getRootNavigation = navigation => {
  let currentNavigation = navigation;
  let parentNavigation = currentNavigation?.getParent?.();

  while (parentNavigation) {
    currentNavigation = parentNavigation;
    parentNavigation = currentNavigation.getParent?.();
  }

  return currentNavigation;
};
