const intervals = new Map<HTMLElement, ReturnType<typeof setInterval>>();

function getTimeRemaining(saleDate: number) {
  const total = saleDate * 1000 - Date.now();

  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));

  return { total, days, hours, minutes, seconds };
}

function getPluralForm(value: number, single: string, plural: string): string {
  return value === 1 ? single : plural;
}

function updateCountdown(endDate: number, container: HTMLElement) {
  const existingInterval = intervals.get(container);
  if (existingInterval) {
    clearInterval(existingInterval);
  }

  const useLabels = container.hasAttribute("data-countdown-labels");

  const parts = {
    days: container.querySelector(
      '[data-countdown="days"]'
    ) as HTMLElement | null,
    hours: container.querySelector(
      '[data-countdown="hours"]'
    ) as HTMLElement | null,
    minutes: container.querySelector(
      '[data-countdown="minutes"]'
    ) as HTMLElement | null,
    seconds: container.querySelector(
      '[data-countdown="seconds"]'
    ) as HTMLElement | null,
    daysLabel: useLabels
      ? (container.querySelector(
          '[data-countdown-label="days"]'
        ) as HTMLElement | null)
      : null,
    hoursLabel: useLabels
      ? (container.querySelector(
          '[data-countdown-label="hours"]'
        ) as HTMLElement | null)
      : null,
    minutesLabel: useLabels
      ? (container.querySelector(
          '[data-countdown-label="minutes"]'
        ) as HTMLElement | null)
      : null,
  };

  const update = () => {
    const time = getTimeRemaining(endDate);

    if (time.total <= 0) {
      container.textContent = "Аукционът приключи";
      container.setAttribute("data-expired", "true");

      const interval = intervals.get(container);
      if (interval) {
        clearInterval(interval);
        intervals.delete(container);
      }
      return;
    }

    if (parts.days) parts.days.textContent = String(time.days).padStart(2, "0");
    if (parts.hours)
      parts.hours.textContent = String(time.hours).padStart(2, "0");
    if (parts.minutes)
      parts.minutes.textContent = String(time.minutes).padStart(2, "0");
    if (parts.seconds)
      parts.seconds.textContent = String(time.seconds).padStart(2, "0");

    if (useLabels) {
      if (parts.daysLabel) {
        parts.daysLabel.textContent = getPluralForm(time.days, "ден", "дни");
      }
      if (parts.hoursLabel) {
        parts.hoursLabel.textContent = getPluralForm(time.hours, "час", "часа");
      }
      if (parts.minutesLabel) {
        parts.minutesLabel.textContent = getPluralForm(
          time.minutes,
          "минута",
          "минути"
        );
      }
    }
  };

  update();

  const interval = setInterval(update, 1000);
  intervals.set(container, interval);
}

export function cleanupCountdowns() {
  intervals.forEach((interval) => clearInterval(interval));
  intervals.clear();
}

export function initCountdowns() {
  const countdowns = document.querySelectorAll("[data-countdown-end]");

  countdowns.forEach((container) => {
    const endDateStr = container.getAttribute("data-countdown-end");
    if (endDateStr) {
      const endDate = Number(endDateStr);
      updateCountdown(endDate, container as HTMLElement);
    }
  });
}
