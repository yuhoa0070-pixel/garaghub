(() => {
  const TABLER_ICON_MAP = Object.freeze({
    "icon-alert-triangle": "alert-triangle",
    "icon-arrow-down": "arrow-down",
    "icon-arrow-up": "arrow-up",
    "icon-bell": "bell",
    "icon-box": "package",
    "icon-calendar": "calendar",
    "icon-car": "car",
    "icon-chart": "chart-bar",
    "icon-check": "check",
    "icon-check-circle": "circle-check",
    "icon-chevron": "chevron-down",
    "icon-chevron-left": "chevron-left",
    "icon-chevron-right": "chevron-right",
    "icon-clipboard": "clipboard-list",
    "icon-clock": "clock",
    "icon-crown": "crown",
    "icon-dollar": "currency-dollar",
    "icon-download": "download",
    "icon-eye": "eye",
    "icon-filter": "filter",
    "icon-gauge": "gauge",
    "icon-grid": "layout-dashboard",
    "icon-headset": "headset",
    "icon-id-card": "id",
    "icon-list": "list",
    "icon-mail": "mail",
    "icon-menu": "menu-2",
    "icon-message": "message",
    "icon-paper-plane": "send",
    "icon-pen": "pencil",
    "icon-phone": "phone",
    "icon-plus": "plus",
    "icon-receipt": "receipt",
    "icon-refresh": "refresh",
    "icon-search": "search",
    "icon-settings": "settings",
    "icon-shield": "shield-check",
    "icon-shop": "building-store",
    "icon-team": "users-group",
    "icon-telegram": "brand-telegram",
    "icon-upload": "upload",
    "icon-user-check": "user-check",
    "icon-users": "users",
    "icon-wrench": "tools",
    "icon-x": "x",
    "icon-x-circle": "circle-x",
  });

  function getIconId(useElement) {
    const href = useElement.getAttribute("href") || useElement.getAttribute("xlink:href") || "";
    return href.startsWith("#") ? href.slice(1) : href;
  }

  function createTablerIcon(sourceSvg, tablerIconName) {
    const iconElement = document.createElement("i");
    const sourceClass = sourceSvg.getAttribute("class");
    const ariaHidden = sourceSvg.getAttribute("aria-hidden") || "true";

    iconElement.setAttribute("aria-hidden", ariaHidden);
    iconElement.setAttribute("class", ["ti", `ti-${tablerIconName}`, sourceClass].filter(Boolean).join(" "));

    return iconElement;
  }

  function replaceSpriteIcons(root = document) {
    root.querySelectorAll('svg use[href^="#icon-"], svg use[xlink\\:href^="#icon-"]').forEach((useElement) => {
      const sourceSvg = useElement.closest("svg");
      const iconName = TABLER_ICON_MAP[getIconId(useElement)];

      if (!sourceSvg || !iconName) {
        return;
      }

      sourceSvg.replaceWith(createTablerIcon(sourceSvg, iconName));
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => replaceSpriteIcons(), { once: true });
  } else {
    replaceSpriteIcons();
  }
})();
