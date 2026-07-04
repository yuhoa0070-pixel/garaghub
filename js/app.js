const searchInput = document.querySelector("#dashboardSearch");
const searchableCards = [...document.querySelectorAll("[data-search]")];
const quickAddButton = document.querySelector("#quickAddButton");
const quickAddLabel = document.querySelector("#quickAddLabel");
const quickAddModal = document.querySelector("#quickAddModal");
const closeModalButton = document.querySelector("#closeModalButton");
const toast = document.querySelector("#toast");
const quickActions = [...document.querySelectorAll(".quick-actions button")];
const navItems = [...document.querySelectorAll(".nav-item")];
const views = [...document.querySelectorAll("[data-view-panel]")];
const viewChrome = {
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
    search: "Search customers, vehicles, repair orders...",
    action: "Add Staff",
  },
};

let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function openQuickAdd() {
  quickAddModal.classList.add("open");
  quickAddModal.setAttribute("aria-hidden", "false");
  closeModalButton.focus();
}

function closeQuickAdd() {
  quickAddModal.classList.remove("open");
  quickAddModal.setAttribute("aria-hidden", "true");
  quickAddButton.focus();
}

function updateViewChrome(viewName) {
  const chrome = viewChrome[viewName] || viewChrome.dashboard;
  searchInput.placeholder = chrome.search;
  if (quickAddLabel) {
    quickAddLabel.textContent = chrome.action;
  }
}

const activeNav = navItems.find((item) => item.classList.contains("active") && item.dataset.view);
updateViewChrome(activeNav ? activeNav.dataset.view : "dashboard");

searchInput.addEventListener("input", (event) => {
  const query = event.target.value.trim().toLowerCase();
  const activeView = document.querySelector("[data-view-panel].active");
  const activeCards = activeView
    ? [...activeView.querySelectorAll("[data-search]")]
    : searchableCards;

  searchableCards.forEach((card) => card.classList.remove("is-hidden"));

  activeCards.forEach((card) => {
    const text = `${card.dataset.search} ${card.textContent}`.toLowerCase();
    card.classList.toggle("is-hidden", query.length > 0 && !text.includes(query));
  });

  if (query.length > 1) {
    const visibleCount = activeCards.filter((card) => !card.classList.contains("is-hidden")).length;
    showToast(`${visibleCount} sections match "${query}".`);
  }
});

quickAddButton.addEventListener("click", openQuickAdd);
closeModalButton.addEventListener("click", closeQuickAdd);

quickAddModal.addEventListener("click", (event) => {
  if (event.target === quickAddModal) {
    closeQuickAdd();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && quickAddModal.classList.contains("open")) {
    closeQuickAdd();
  }
});

quickActions.forEach((button) => {
  button.addEventListener("click", () => {
    closeQuickAdd();
    showToast(`${button.textContent.trim()} started.`);
  });
});

navItems.forEach((item) => {
  item.addEventListener("click", (event) => {
    event.preventDefault();
    const viewName = item.dataset.view;
    const targetView = views.find((view) => view.dataset.viewPanel === viewName);

    if (!viewName || !targetView) {
      showToast(`${item.textContent.trim()} is coming soon.`);
      return;
    }

    navItems.forEach((navItem) => {
      navItem.classList.remove("active");
      navItem.removeAttribute("aria-current");
    });
    item.classList.add("active");
    item.setAttribute("aria-current", "page");

    views.forEach((view) => view.classList.toggle("active", view === targetView));
    updateViewChrome(viewName);
    searchInput.value = "";
    searchableCards.forEach((card) => card.classList.remove("is-hidden"));

    showToast(`${item.textContent.trim()} selected.`);
  });
});
