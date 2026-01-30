export function initTooltips() {
  const triggers = document.querySelectorAll("[data-tooltip-trigger]");

  triggers.forEach((trigger) => {
    const tooltipId = trigger.getAttribute("data-tooltip-trigger");
    if (!tooltipId) return;

    trigger.setAttribute("aria-expanded", "false");

    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const isExpanded = trigger.getAttribute("aria-expanded") === "true";

      document
        .querySelectorAll<HTMLElement>("[data-tooltip-trigger]")
        .forEach((tr) => {
          if (tr !== trigger) {
            tr.setAttribute("aria-expanded", "false");
          }
        });

      if (isExpanded) {
        trigger.setAttribute("aria-expanded", "false");
      } else {
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  // ✅ Проверяем что клик НЕ на trigger или его детях
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    // Если клик на trigger или внутри него - игнорируем
    if (target.closest("[data-tooltip-trigger]")) {
      return;
    }

    // Закрываем все тултипы
    document
      .querySelectorAll<HTMLElement>("[data-tooltip-trigger]")
      .forEach((trigger) => {
        trigger.setAttribute("aria-expanded", "false");
      });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document
        .querySelectorAll<HTMLElement>("[data-tooltip-trigger]")
        .forEach((trigger) => {
          trigger.setAttribute("aria-expanded", "false");
        });
    }
  });
}
