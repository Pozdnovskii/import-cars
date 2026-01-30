export function initCarousels() {
  function handleCarouselClick(e: Event) {
    const actionButton = (e.target as HTMLElement).closest(
      "[data-carousel-action]"
    );
    if (!actionButton) return;

    const wrapper = actionButton.closest("[data-carousel-wrapper]");
    if (!wrapper) return;

    const carousel = wrapper.querySelector("[data-carousel]") as HTMLElement;
    if (!carousel) return;

    const firstSlide = carousel.querySelector(":scope > *") as HTMLElement;
    if (!firstSlide) return;

    const slideWidth = firstSlide.offsetWidth;

    const scrollAmount =
      (actionButton as HTMLElement).dataset.carouselAction === "prev"
        ? -slideWidth
        : slideWidth;

    carousel.scrollBy({ left: scrollAmount, behavior: "smooth" });

    updateScrollbar(wrapper);
  }

  function updateScrollbar(wrapper: Element) {
    const carousel = wrapper.querySelector("[data-carousel]") as HTMLElement;
    const scrollbar = wrapper.querySelector("[data-scrollbar]") as HTMLElement;
    if (!scrollbar || !carousel) return;

    const scrollWidth = carousel.scrollWidth;
    const clientWidth = carousel.clientWidth;
    const scrollLeft = carousel.scrollLeft;

    if (scrollWidth <= clientWidth) {
      scrollbar.style.setProperty("--thumb-width", "100%");
      scrollbar.style.setProperty("--thumb-position", "0%");
      return;
    }

    const thumbWidthPercentage = (clientWidth / scrollWidth) * 100;
    const maxThumbLeft = Math.max(0, 100 - thumbWidthPercentage);

    const scrollable = scrollWidth - clientWidth;
    const scrollRatio = scrollable > 0 ? scrollLeft / scrollable : 0;

    let thumbLeft = scrollRatio * maxThumbLeft;
    thumbLeft = Math.max(0, Math.min(thumbLeft, maxThumbLeft));

    scrollbar.style.setProperty(
      "--thumb-width",
      `${thumbWidthPercentage.toFixed(2)}%`
    );
    scrollbar.style.setProperty("--thumb-position", `${thumbLeft.toFixed(2)}%`);
  }

  function handleResize() {
    document.querySelectorAll("[data-carousel-wrapper]").forEach((wrapper) => {
      updateScrollbar(wrapper);
    });
  }

  document.querySelectorAll("[data-carousel]").forEach((carousel) => {
    carousel.addEventListener("scroll", () => {
      const wrapper = carousel.closest("[data-carousel-wrapper]");
      if (wrapper) updateScrollbar(wrapper);
    });
  });

  document.querySelectorAll("[data-carousel-wrapper]").forEach((wrapper) => {
    updateScrollbar(wrapper);
  });

  document.removeEventListener("click", handleCarouselClick);
  document.addEventListener("click", handleCarouselClick);

  window.removeEventListener("resize", handleResize);
  window.addEventListener("resize", handleResize);

  const cleanup = () => {
    document.removeEventListener("click", handleCarouselClick);
    window.removeEventListener("resize", handleResize);
  };

  document.addEventListener("astro:before-preparation", cleanup, {
    once: true,
  });
}
