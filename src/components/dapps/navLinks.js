/**
 * Single source of truth for dapp navigation.
 * Consumed by the desktop rail, the mobile drawer and the mobile tab bar so
 * the three can never drift apart.
 */
export const NAV_LINKS = [
  {
    href: "/agreement",
    label: "Agreements",
    shortLabel: "Agree",
    icon: "/agree.svg",
    activeIcon: "/agreemSelected.svg",
  },
  {
    href: "/crimerecorder/record",
    label: "Record",
    shortLabel: "Record",
    icon: "/video.svg",
    activeIcon: "/videoSelected.svg",
  },
  {
    href: "/crimerecorder",
    label: "Evidence",
    shortLabel: "Evidence",
    icon: "/image.svg",
    activeIcon: "/imageSelected.svg",
    /** /crimerecorder itself only — the sub-routes belong to other tabs. */
    exact: true,
  },
  {
    href: "/settings",
    label: "Settings",
    shortLabel: "Settings",
    icon: "/setting.svg",
    activeIcon: "/setting.svg",
  },
];

export const isLinkActive = (pathname, link) => {
  if (!pathname) return false;
  if (link.exact) return pathname === link.href;
  return pathname === link.href || pathname.startsWith(`${link.href}/`);
};
