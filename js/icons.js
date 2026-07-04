const heroiconMap = {
  "icon-grid": "heroicons:squares-2x2",
  "icon-users": "heroicons:users",
  "icon-car": "heroicons:truck",
  "icon-clipboard": "heroicons:clipboard-document-list",
  "icon-receipt": "heroicons:document-text",
  "icon-box": "heroicons:cube",
  "icon-team": "heroicons:user-group",
  "icon-chart": "heroicons:chart-bar",
  "icon-bell": "heroicons:bell",
  "icon-settings": "heroicons:adjustments-horizontal",
  "icon-headset": "heroicons:lifebuoy",
  "icon-chevron": "heroicons:chevron-down",
  "icon-menu": "heroicons:bars-3",
  "icon-search": "heroicons:magnifying-glass",
  "icon-plus": "heroicons:plus",
  "icon-filter": "heroicons:funnel",
  "icon-list": "heroicons:list-bullet",
  "icon-eye": "heroicons:eye",
  "icon-download": "heroicons:arrow-down-tray",
  "icon-upload": "heroicons:arrow-up-tray",
  "icon-paper-plane": "heroicons:paper-airplane",
  "icon-alert-triangle": "heroicons:exclamation-triangle",
  "icon-refresh": "heroicons:arrow-path",
  "icon-user-check": "heroicons:user-plus",
  "icon-crown": "heroicons:sparkles",
  "icon-mail": "heroicons:envelope",
  "icon-phone": "heroicons:phone",
  "icon-id-card": "heroicons:identification",
  "icon-pen": "heroicons:pencil-square",
  "icon-arrow-up": "heroicons:arrow-up",
  "icon-arrow-down": "heroicons:arrow-down",
  "icon-chevron-left": "heroicons:chevron-left",
  "icon-chevron-right": "heroicons:chevron-right",
  "icon-message": "heroicons:chat-bubble-left-right",
  "icon-shop": "heroicons:building-storefront",
  "icon-calendar": "heroicons:calendar-days",
  "icon-dollar": "heroicons:currency-dollar",
  "icon-wrench": "heroicons:wrench-screwdriver",
  "icon-check": "heroicons:check",
  "icon-gauge": "heroicons:presentation-chart-line",
  "icon-clock": "heroicons:clock",
  "icon-check-circle": "heroicons:check-circle",
  "icon-x-circle": "heroicons:x-circle",
  "icon-shield": "heroicons:shield-check",
  "icon-x": "heroicons:x-mark",
};

function replaceSpriteIcons() {
  document.querySelectorAll('svg use[href^="#icon-"]').forEach((useElement) => {
    const sourceSvg = useElement.closest("svg");
    const iconId = useElement.getAttribute("href").slice(1);
    const libraryIcon = heroiconMap[iconId];

    if (!sourceSvg || !libraryIcon) {
      return;
    }

    const iconElement = document.createElement("iconify-icon");
    iconElement.setAttribute("icon", libraryIcon);
    iconElement.setAttribute("aria-hidden", sourceSvg.getAttribute("aria-hidden") || "true");

    const className = sourceSvg.getAttribute("class");
    if (className) {
      iconElement.setAttribute("class", className);
    }

    sourceSvg.replaceWith(iconElement);
  });
}

replaceSpriteIcons();
