export function initRangeSlider(type: string) {
  const root = document.querySelector(`[data-slider="${type}"]`) as HTMLElement;
  if (!root) return;

  const thumbFrom = root.querySelector(
    `[data-thumb="${type}-from"]`
  ) as HTMLElement;
  const thumbTo = root.querySelector(
    `[data-thumb="${type}-to"]`
  ) as HTMLElement;
  const inputFrom = document.querySelector(
    `[data-input="${type}-from"]`
  ) as HTMLInputElement;
  const inputTo = document.querySelector(
    `[data-input="${type}-to"]`
  ) as HTMLInputElement;

  if (!thumbFrom || !thumbTo || !inputFrom || !inputTo) return;

  const MAX = parseInt(root.getAttribute("data-max") || "500000");
  const MIN_GAP = 1000;

  let isDragging = false;
  let activeThumb: "from" | "to" | null = null;

  function getPositionFromEvent(e: MouseEvent | TouchEvent): number {
    const rect = root.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    let position = ((clientX - rect.left) / rect.width) * 100;
    position = Math.max(0, Math.min(100, position));
    return Math.round(((position / 100) * MAX) / 1000) * 1000;
  }

  function updateUI() {
    const from = parseInt(inputFrom.value);
    const to = parseInt(inputTo.value);

    const leftPercent = (from / MAX) * 100;
    const rightPercent = 100 - (to / MAX) * 100;

    root.style.setProperty("--range-left", `${leftPercent}%`);
    root.style.setProperty("--range-right", `${rightPercent}%`);

    thumbFrom.setAttribute("aria-valuenow", String(from));
    thumbTo.setAttribute("aria-valuenow", String(to));
  }

  function handleMove(e: MouseEvent | TouchEvent) {
    if (!isDragging || !activeThumb) return;
    e.preventDefault();

    let value = getPositionFromEvent(e);
    const from = parseInt(inputFrom.value);
    const to = parseInt(inputTo.value);

    if (activeThumb === "from") {
      value = Math.max(0, Math.min(value, to - MIN_GAP));
      inputFrom.value = String(value);
    } else {
      value = Math.max(from + MIN_GAP, Math.min(value, MAX));
      inputTo.value = String(value);
    }

    updateUI();
  }

  function handleEnd() {
    isDragging = false;
    activeThumb = null;
    document.body.style.cursor = "";
  }

  thumbFrom.addEventListener("mousedown", (e) => {
    e.preventDefault();
    isDragging = true;
    activeThumb = "from";
    document.body.style.cursor = "grabbing";
    thumbFrom.style.zIndex = "4";
    thumbTo.style.zIndex = "3";
  });

  thumbTo.addEventListener("mousedown", (e) => {
    e.preventDefault();
    isDragging = true;
    activeThumb = "to";
    document.body.style.cursor = "grabbing";
    thumbTo.style.zIndex = "4";
    thumbFrom.style.zIndex = "3";
  });

  root.addEventListener("mousedown", (e) => {
    if (e.target === thumbFrom || e.target === thumbTo) return;

    const value = getPositionFromEvent(e);
    const from = parseInt(inputFrom.value);
    const to = parseInt(inputTo.value);
    const mid = (from + to) / 2;

    if (value < mid) {
      inputFrom.value = String(Math.min(value, to - MIN_GAP));
      activeThumb = "from";
    } else {
      inputTo.value = String(Math.max(value, from + MIN_GAP));
      activeThumb = "to";
    }

    isDragging = true;
    updateUI();
  });

  document.addEventListener("mousemove", handleMove);
  document.addEventListener("mouseup", handleEnd);
  document.addEventListener("touchmove", handleMove, { passive: false });
  document.addEventListener("touchend", handleEnd);

  inputFrom.addEventListener("change", () => {
    let value = parseInt(inputFrom.value) || 0;
    const to = parseInt(inputTo.value);
    value = Math.max(0, Math.min(value, to - MIN_GAP));
    inputFrom.value = String(value);
    updateUI();
  });

  inputTo.addEventListener("change", () => {
    const from = parseInt(inputFrom.value);
    let value = parseInt(inputTo.value) || MAX;
    value = Math.max(from + MIN_GAP, Math.min(value, MAX));
    inputTo.value = String(value);
    updateUI();
  });

  inputFrom.addEventListener("focus", () => {
    if (inputFrom.value === "0") {
      inputFrom.value = "";
    }
  });

  inputFrom.addEventListener("blur", () => {
    if (inputFrom.value === "") {
      inputFrom.value = "0";
    }
  });

  inputTo.addEventListener("focus", () => {
    if (inputTo.value === String(MAX)) {
      inputTo.value = "";
    }
  });

  inputTo.addEventListener("blur", () => {
    if (inputTo.value === "") {
      inputTo.value = String(MAX);
    }
  });

  [thumbFrom, thumbTo].forEach((thumb) => {
    thumb.addEventListener("keydown", (e) => {
      const isFrom = thumb === thumbFrom;
      const input = isFrom ? inputFrom : inputTo;
      let value = parseInt(input.value);

      switch (e.key) {
        case "ArrowLeft":
        case "ArrowDown":
          e.preventDefault();
          value = Math.max(0, value - 1000);
          break;
        case "ArrowRight":
        case "ArrowUp":
          e.preventDefault();
          value = Math.min(MAX, value + 1000);
          break;
        default:
          return;
      }

      input.value = String(value);
      updateUI();
    });
  });

  updateUI();
}
