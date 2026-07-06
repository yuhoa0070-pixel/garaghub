(() => {
  const SELECTORS = Object.freeze({
    appShell: ".app-shell",
    closeModalButton: "#closeModalButton",
    navItem: ".nav-item",
    quickActions: ".quick-actions",
    quickAddButton: "#quickAddButton",
    quickAddLabel: "#quickAddLabel",
    quickAddModal: "#quickAddModal",
    searchInput: "#dashboardSearch",
    searchable: "[data-search]",
    toast: "#toast",
    view: "[data-view-panel]",
    visibleView: "[data-view-panel].active",
    menuButton: ".menu-button",
  });

  const STORAGE_KEYS = Object.freeze({
    sidebarCollapsed: "garagehubSidebarCollapsed",
  });

  const VIEW_CHROME = Object.freeze({
    dashboard: {
      search: "Search customers, vehicles, repair orders...",
      action: "Quick Add",
    },
    customers: {
      search: "Search customers, vehicles, orders...",
      action: "Quick Add",
    },
    vehicles: {
      search: "Search customers, vehicles, orders...",
      action: "Quick Add",
    },
    "repair-orders": {
      search: "Search customers, vehicles, repair orders...",
      action: "Quick Add",
    },
    invoices: {
      search: "Search invoices, customers, vehicles...",
      action: "Create Invoice",
    },
    inventory: {
      search: "Search parts, categories, brands or SKU...",
      action: "Add Stock",
    },
    staff: {
      search: "Search staff by name, role, phone or Telegram...",
      action: "Add Staff",
    },
  });

  const state = {
    toastTimer: undefined,
  };

  const query = (selector, scope = document) => scope.querySelector(selector);
  const queryAll = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  const getElements = () => ({
    appShell: query(SELECTORS.appShell),
    closeModalButton: query(SELECTORS.closeModalButton),
    menuButton: query(SELECTORS.menuButton),
    quickActions: query(SELECTORS.quickActions),
    quickAddButton: query(SELECTORS.quickAddButton),
    quickAddLabel: query(SELECTORS.quickAddLabel),
    quickAddModal: query(SELECTORS.quickAddModal),
    searchInput: query(SELECTORS.searchInput),
    toast: query(SELECTORS.toast),
  });

  const getNavItems = () => queryAll(SELECTORS.navItem);
  const getSearchableCards = () => queryAll(SELECTORS.searchable);
  const getViews = () => queryAll(SELECTORS.view);

  function showToast(message, elements) {
    if (!elements.toast) {
      return;
    }

    elements.toast.textContent = message;
    elements.toast.classList.add("show");
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 2200);
  }

  function updateViewChrome(viewName, elements) {
    const chrome = VIEW_CHROME[viewName] || VIEW_CHROME.dashboard;

    if (elements.searchInput) {
      elements.searchInput.placeholder = chrome.search;
    }

    if (elements.quickAddLabel) {
      elements.quickAddLabel.textContent = chrome.action;
    }
  }

  function clearSearchState(elements) {
    if (elements.searchInput) {
      elements.searchInput.value = "";
    }

    getSearchableCards().forEach((card) => card.classList.remove("is-hidden"));
  }

  function openQuickAdd(elements) {
    if (!elements.quickAddModal) {
      return;
    }

    elements.quickAddModal.classList.add("open");
    elements.quickAddModal.setAttribute("aria-hidden", "false");
    elements.closeModalButton?.focus();
  }

  function closeQuickAdd(elements) {
    if (!elements.quickAddModal) {
      return;
    }

    elements.quickAddModal.classList.remove("open");
    elements.quickAddModal.setAttribute("aria-hidden", "true");
    elements.quickAddButton?.focus();
  }

  function getSavedSidebarState() {
    try {
      return localStorage.getItem(STORAGE_KEYS.sidebarCollapsed) === "true";
    } catch {
      return false;
    }
  }

  function setSidebarCollapsed(isCollapsed, elements, persist = true) {
    if (!elements.appShell || !elements.menuButton) {
      return;
    }

    elements.appShell.classList.toggle("sidebar-collapsed", isCollapsed);
    elements.menuButton.setAttribute("aria-expanded", String(!isCollapsed));
    elements.menuButton.setAttribute("aria-label", isCollapsed ? "Expand menu" : "Collapse menu");

    if (!persist) {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEYS.sidebarCollapsed, String(isCollapsed));
    } catch {
      // The toggle still works if browser storage is unavailable.
    }
  }

  function getInitialViewName() {
    const hashView = window.location.hash.replace("#", "");
    const hasHashView = getViews().some((view) => view.dataset.viewPanel === hashView);

    if (hasHashView) {
      return hashView;
    }

    const activeNav = getNavItems().find((item) => item.classList.contains("active") && item.dataset.view);
    return activeNav?.dataset.view || "dashboard";
  }

  function activateView(viewName, elements) {
    const targetView = getViews().find((view) => view.dataset.viewPanel === viewName);
    const targetNav = getNavItems().find((item) => item.dataset.view === viewName);

    if (!targetView || !targetNav) {
      return false;
    }

    getNavItems().forEach((navItem) => {
      navItem.classList.toggle("active", navItem === targetNav);

      if (navItem === targetNav) {
        navItem.setAttribute("aria-current", "page");
      } else {
        navItem.removeAttribute("aria-current");
      }
    });

    getViews().forEach((view) => view.classList.toggle("active", view === targetView));
    updateViewChrome(viewName, elements);
    clearSearchState(elements);
    return true;
  }

  function bindSidebar(elements) {
    getNavItems().forEach((item) => {
      if (!item.title) {
        item.title = item.textContent.trim();
      }
    });

    if (!elements.appShell || !elements.menuButton) {
      return;
    }

    setSidebarCollapsed(getSavedSidebarState(), elements, false);

    elements.menuButton.addEventListener("click", () => {
      const shouldCollapse = !elements.appShell.classList.contains("sidebar-collapsed");
      setSidebarCollapsed(shouldCollapse, elements);
      showToast(shouldCollapse ? "Navigation collapsed." : "Navigation expanded.", elements);
    });
  }

  function bindSearch(elements) {
    if (!elements.searchInput) {
      return;
    }

    elements.searchInput.addEventListener("input", (event) => {
      const queryText = event.target.value.trim().toLowerCase();
      const activeView = query(SELECTORS.visibleView);
      const allCards = getSearchableCards();
      const activeCards = activeView ? queryAll(SELECTORS.searchable, activeView) : allCards;

      allCards.forEach((card) => card.classList.remove("is-hidden"));

      activeCards.forEach((card) => {
        const searchText = `${card.dataset.search || ""} ${card.textContent}`.toLowerCase();
        const shouldHide = queryText.length > 0 && !searchText.includes(queryText);
        card.classList.toggle("is-hidden", shouldHide);
      });

      if (queryText.length > 1) {
        const visibleCount = activeCards.filter((card) => !card.classList.contains("is-hidden")).length;
        showToast(`${visibleCount} sections match "${queryText}".`, elements);
      }
    });
  }

  function bindQuickAdd(elements) {
    elements.quickAddButton?.addEventListener("click", () => openQuickAdd(elements));
    elements.closeModalButton?.addEventListener("click", () => closeQuickAdd(elements));

    elements.quickAddModal?.addEventListener("click", (event) => {
      if (event.target === elements.quickAddModal) {
        closeQuickAdd(elements);
      }
    });

    elements.quickActions?.addEventListener("click", (event) => {
      const action = event.target.closest("button");

      if (!action || !elements.quickActions.contains(action)) {
        return;
      }

      closeQuickAdd(elements);
      showToast(`${action.textContent.trim()} started.`, elements);
    });
  }

  function bindNavigation(elements) {
    const navList = query(".nav-list");

    if (!navList) {
      return;
    }

    navList.addEventListener("click", (event) => {
      const item = event.target.closest(SELECTORS.navItem);

      if (!item || !navList.contains(item)) {
        return;
      }

      event.preventDefault();
      const viewName = item.dataset.view;

      if (!viewName || !activateView(viewName, elements)) {
        showToast(`${item.textContent.trim()} is coming soon.`, elements);
        return;
      }

      showToast(`${item.textContent.trim()} selected.`, elements);
    });
  }

  function bindKeyboardShortcuts(elements) {
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && elements.quickAddModal?.classList.contains("open")) {
        closeQuickAdd(elements);
      }
    });
  }

  function init() {
    const elements = getElements();

    bindSidebar(elements);
    bindSearch(elements);
    bindQuickAdd(elements);
    bindNavigation(elements);
    bindKeyboardShortcuts(elements);
    activateView(getInitialViewName(), elements);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
