export function initMobileFilters() {
  const aside = document.getElementById("filters");
  const toggle = document.getElementById("filters-toggle");
  const panel = document.getElementById("filters-content");

  if (!aside || !toggle || !panel) return;

  if (toggle.dataset.initialized === "true") return;
  toggle.dataset.initialized = "true";

  const desktopQuery = window.matchMedia("(min-width: 48rem)");

  let isOpen = aside.classList.contains("filters--open");

  const toggleFilters = () => {
    isOpen = !isOpen;
    aside.classList.toggle("filters--open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));

    if (isOpen) {
      panel.removeAttribute("inert");
    } else {
      if (!desktopQuery.matches) {
        panel.setAttribute("inert", "");
      }
    }
  };

  const closeFilters = () => {
    if (isOpen) {
      toggleFilters();
      toggle.focus();
    }
  };

  toggle.addEventListener("click", toggleFilters);

  document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      closeFilters();
    }
  });

  const handleResize = (e: MediaQueryListEvent | MediaQueryList) => {
    if (e.matches) {
      panel.removeAttribute("inert");
    } else if (!isOpen) {
      panel.setAttribute("inert", "");
    }
  };

  desktopQuery.addEventListener("change", handleResize);
  handleResize(desktopQuery);

  toggle.setAttribute("aria-expanded", String(isOpen));
  if (!isOpen && !desktopQuery.matches) {
    panel.setAttribute("inert", "");
  }
}
