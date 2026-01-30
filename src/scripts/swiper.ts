import Swiper from "swiper";
import { Navigation, Thumbs, A11y, Keyboard } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper/types";

let carGalleryInstance: { main: SwiperType; thumbs: SwiperType } | null = null;

export function initCarGallery() {
  const gallery = document.getElementById("photo-gallery");
  if (!gallery) return;

  destroyCarGallery();

  const thumbsEl = gallery.querySelector(
    '[data-gallery="thumbs"]'
  ) as HTMLElement;
  const mainEl = gallery.querySelector('[data-gallery="main"]') as HTMLElement;
  const prevBtn = gallery.querySelector(
    '[data-carousel-action="prev"]'
  ) as HTMLElement;
  const nextBtn = gallery.querySelector(
    '[data-carousel-action="next"]'
  ) as HTMLElement;

  if (!thumbsEl || !mainEl) return;

  const thumbsSwiper = new Swiper(thumbsEl, {
    loop: true,
    spaceBetween: 10,
    slidesPerView: 3.25,
    breakpoints: {
      640: {
        slidesPerView: 4.25,
      },
    },
    watchSlidesProgress: true,
    freeMode: true,
  });

  const mainSwiper = new Swiper(mainEl, {
    modules: [Navigation, Thumbs, A11y, Keyboard],
    slidesPerView: 1,
    loop: true,

    navigation: {
      nextEl: nextBtn,
      prevEl: prevBtn,
    },

    thumbs: {
      swiper: thumbsSwiper,
    },

    a11y: {
      enabled: true,
      prevSlideMessage: "Предишно изображение",
      nextSlideMessage: "Следващо изображение",
      firstSlideMessage: "Това е първото изображение",
      lastSlideMessage: "Това е последното изображение",
    },

    keyboard: {
      enabled: true,
      onlyInViewport: true,
    },

    on: {
      init: function (swiper) {
        setTimeout(() => {
          swiper.update();
        }, 100);
      },
    },
  });

  carGalleryInstance = { main: mainSwiper, thumbs: thumbsSwiper };
}

export function destroyCarGallery() {
  if (carGalleryInstance) {
    carGalleryInstance.main?.destroy(true, true);
    carGalleryInstance.thumbs?.destroy(true, true);
    carGalleryInstance = null;
  }
}
