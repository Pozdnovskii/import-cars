export function initHeader() {
  const header = document.getElementById("header");
  const burger = document.getElementById("header-btn");
  const nav = document.getElementById("header-nav");

  if (!header || !burger || !nav) {
    return;
  }

  if (burger.dataset.initialized === "true") {
    return;
  }
  burger.dataset.initialized = "true";

  let isOpen = false;
  const desktopQuery = window.matchMedia("(min-width: 64rem)");

  const toggleMenu = () => {
    isOpen = !isOpen;
    header.classList.toggle("header--open", isOpen);
    burger.setAttribute("aria-expanded", String(isOpen));

    if (isOpen) {
      nav.removeAttribute("inert");

      setTimeout(() => {
        const firstLink = nav.querySelector("a");
        firstLink?.focus();
      }, 150);
    } else {
      if (!desktopQuery.matches) {
        nav.setAttribute("inert", "");
      }
    }
  };

  const closeMenu = () => {
    if (isOpen) {
      toggleMenu();
      burger.focus();
    }
  };

  burger.addEventListener("click", toggleMenu);

  document.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      closeMenu();
    }
  });

  document.addEventListener("click", (e: MouseEvent) => {
    const target = e.target as Node;
    if (isOpen && !header.contains(target)) {
      toggleMenu();
    }
  });

  const allHeaderLinks = header.querySelectorAll("a");
  allHeaderLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  const handleResize = (e: MediaQueryListEvent | MediaQueryList) => {
    if (e.matches) {
      nav.removeAttribute("inert");
    } else if (!isOpen) {
      nav.setAttribute("inert", "");
    }
  };

  desktopQuery.addEventListener("change", handleResize);
  handleResize(desktopQuery);
}
