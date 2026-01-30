export function initHeroCarousel() {
  const wrapper = document.getElementById("hero-carousel");
  if (!wrapper) return;

  const carousel = wrapper.querySelector(".carousel") as HTMLElement;
  const indicatorsWrapper = wrapper.querySelector(
    "#indicators-wrapper"
  ) as HTMLElement;

  if (!carousel || !indicatorsWrapper) return;

  const indicators = Array.from(
    indicatorsWrapper.querySelectorAll("button")
  ) as HTMLButtonElement[];

  const slideCount = indicators.length;
  if (slideCount === 0) return;

  let currentIndex = 0;
  const intervalTime = 5000;
  let autoScrollTimer: number | undefined;

  function scrollToIndex(index: number) {
    currentIndex = index;
    const slideWidth = carousel.offsetWidth;
    carousel.scrollTo({ left: slideWidth * index, behavior: "smooth" });
    updateIndicators();
    resetAutoScroll();
  }

  function updateIndicators() {
    indicators.forEach((btn, i) => {
      btn.classList.toggle("active", i === currentIndex);
      if (i === currentIndex) {
        btn.style.animation = "none";
        void btn.offsetHeight;
        btn.style.animation = "";
      }
    });
  }

  function autoScroll() {
    if (currentIndex < slideCount - 1) {
      scrollToIndex(currentIndex + 1);
    } else {
      if (autoScrollTimer !== undefined) {
        clearInterval(autoScrollTimer);
      }
    }
  }

  function resetAutoScroll() {
    if (autoScrollTimer !== undefined) {
      clearInterval(autoScrollTimer);
    }
    autoScrollTimer = window.setInterval(autoScroll, intervalTime);
  }

  indicators.forEach((btn, i) => {
    btn.addEventListener("click", () => {
      if (autoScrollTimer !== undefined) {
        clearInterval(autoScrollTimer);
      }
      scrollToIndex(i);
      if (i < slideCount - 1) {
        resetAutoScroll();
      }
    });
  });

  const handleResize = () => {
    const slideWidth = carousel.offsetWidth;
    carousel.scrollTo({
      left: slideWidth * currentIndex,
      behavior: "instant" as ScrollBehavior,
    });
  };

  const cleanup = () => {
    if (autoScrollTimer !== undefined) {
      clearInterval(autoScrollTimer);
    }
    window.removeEventListener("resize", handleResize);
  };

  window.addEventListener("resize", handleResize);
  document.addEventListener("astro:before-preparation", cleanup, {
    once: true,
  });

  updateIndicators();
  resetAutoScroll();
}
