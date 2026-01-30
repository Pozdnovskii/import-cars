export function initFilters(mode: "static" | "search" = "static") {
  const checkboxes = Array.from(
    document.querySelectorAll('input[name="platform"]')
  ) as HTMLInputElement[];

  const inputPriceFrom = document.querySelector(
    '[data-input="price-from"]'
  ) as HTMLInputElement;
  const inputPriceTo = document.querySelector(
    '[data-input="price-to"]'
  ) as HTMLInputElement;
  const priceSliderRoot = document.querySelector(
    '[data-slider="price"]'
  ) as HTMLElement;

  const selectMake = document.querySelector(
    '[data-select="make"]'
  ) as HTMLSelectElement;

  const selectModel = document.querySelector(
    '[data-select="model"]'
  ) as HTMLSelectElement;

  const selectYearFrom = document.querySelector(
    '[data-select="year-from"]'
  ) as HTMLSelectElement;
  const selectYearTo = document.querySelector(
    '[data-select="year-to"]'
  ) as HTMLSelectElement;

  const inputOdometerFrom = document.querySelector(
    '[data-input="odometer-from"]'
  ) as HTMLInputElement;
  const inputOdometerTo = document.querySelector(
    '[data-input="odometer-to"]'
  ) as HTMLInputElement;
  const odometerSliderRoot = document.querySelector(
    '[data-slider="odometer"]'
  ) as HTMLElement;

  const buyNowCheckbox = document.querySelector(
    'input[name="buyNow"]'
  ) as HTMLInputElement;

  const clearButton = document.querySelector(
    "[data-clear-filters]"
  ) as HTMLButtonElement;

  const applyButton = document.getElementById(
    "apply-filters"
  ) as HTMLButtonElement;

  const MAX_PRICE = priceSliderRoot
    ? parseInt(priceSliderRoot.getAttribute("data-max") || "500000")
    : 500000;
  const MAX_ODOMETER = odometerSliderRoot
    ? parseInt(odometerSliderRoot.getAttribute("data-max") || "500000")
    : 500000;

  const isMobile = () => !window.matchMedia("(min-width: 48rem)").matches;

  function syncCheckboxAttribute(checkbox: HTMLInputElement) {
    if (checkbox.checked) {
      checkbox.setAttribute("checked", "");
    } else {
      checkbox.removeAttribute("checked");
    }
  }

  function buildSearchUrl() {
    const params = new URLSearchParams();

    const selectedPlatforms = checkboxes
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    // if (selectedPlatforms.length > 0 && selectedPlatforms.length < 2) {
    //   params.set("platform", selectedPlatforms.join(","));
    // }

    if (selectedPlatforms.length === 1) {
      params.set("platform", selectedPlatforms[0]);
    }

    const priceFrom = inputPriceFrom ? parseInt(inputPriceFrom.value) || 0 : 0;
    const priceTo = inputPriceTo
      ? parseInt(inputPriceTo.value) || MAX_PRICE
      : MAX_PRICE;

    if (priceFrom > 0) {
      params.set("priceFrom", String(priceFrom));
    }

    if (priceTo < MAX_PRICE) {
      params.set("priceTo", String(priceTo));
    }

    if (selectMake && selectMake.value) {
      params.set("make", selectMake.value);
    }

    if (selectModel && selectModel.value) {
      params.set("model", selectModel.value);
    }

    if (selectYearFrom && selectYearTo) {
      const yearFrom = selectYearFrom.value;
      const yearTo = selectYearTo.value;

      if (yearFrom) {
        params.set("yearFrom", yearFrom);
      }

      if (yearTo) {
        params.set("yearTo", yearTo);
      }
    }

    const odometerFrom = inputOdometerFrom
      ? parseInt(inputOdometerFrom.value) || 0
      : 0;
    const odometerTo = inputOdometerTo
      ? parseInt(inputOdometerTo.value) || MAX_ODOMETER
      : MAX_ODOMETER;

    if (odometerFrom > 0) {
      params.set("odometerFrom", String(odometerFrom));
    }

    if (odometerTo < MAX_ODOMETER) {
      params.set("odometerTo", String(odometerTo));
    }

    if (buyNowCheckbox?.checked) {
      params.set("buyNow", "true");
    }

    const queryString = params.toString();
    return queryString
      ? `/auction-cars/search?${queryString}`
      : "/auction-cars/search";
  }

  function applyFilters() {
    window.location.href = buildSearchUrl();
  }

  function resetFiltersToDefault() {
    checkboxes.forEach((cb) => {
      cb.checked = true;
    });

    if (selectMake) {
      selectMake.value = "";
      selectMake.setAttribute("data-is-default", "true");
    }

    if (selectModel) {
      selectModel.value = "";
      selectModel.disabled = true;
      selectModel.setAttribute("data-is-default", "true");
    }

    if (selectYearFrom) {
      selectYearFrom.value = "";
      selectYearFrom.setAttribute("data-is-default", "true");
    }

    if (selectYearTo) {
      selectYearTo.value = "";
      selectYearTo.setAttribute("data-is-default", "true");
    }

    if (inputPriceFrom) {
      inputPriceFrom.value = "0";
      inputPriceFrom.setAttribute("data-is-default", "true");
    }

    if (inputPriceTo) {
      inputPriceTo.value = String(MAX_PRICE);
      inputPriceTo.setAttribute("data-is-default", "true");
    }

    if (inputOdometerFrom) {
      inputOdometerFrom.value = "0";
      inputOdometerFrom.setAttribute("data-is-default", "true");
    }

    if (inputOdometerTo) {
      inputOdometerTo.value = String(MAX_ODOMETER);
      inputOdometerTo.setAttribute("data-is-default", "true");
    }

    if (priceSliderRoot) {
      priceSliderRoot.style.setProperty("--range-left", "0%");
      priceSliderRoot.style.setProperty("--range-right", "0%");
    }

    if (odometerSliderRoot) {
      odometerSliderRoot.style.setProperty("--range-left", "0%");
      odometerSliderRoot.style.setProperty("--range-right", "0%");
    }

    if (buyNowCheckbox) {
      buyNowCheckbox.checked = false;
    }
  }

  if (mode === "static") {
    resetFiltersToDefault();
  }

  if (applyButton) {
    applyButton.addEventListener("click", applyFilters);
  }

  if (checkboxes.length) {
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        syncCheckboxAttribute(checkbox);

        const checkedCount = checkboxes.filter((cb) => cb.checked).length;

        if (checkedCount === 0) {
          checkbox.checked = true;
          return;
        }

        if (!isMobile()) {
          applyFilters();
        }
      });
    });
  }

  if (clearButton) {
    clearButton.addEventListener("click", () => {
      window.location.href = "/auction-cars";
    });
  }

  if (selectMake) {
    selectMake.addEventListener("change", () => {
      if (selectModel) {
        selectModel.value = "";
      }

      if (!isMobile()) {
        setTimeout(() => applyFilters(), 200);
      }
    });
  }

  if (selectModel) {
    selectModel.addEventListener("change", () => {
      if (!isMobile()) {
        setTimeout(() => applyFilters(), 200);
      }
    });
  }

  if (selectYearFrom) {
    selectYearFrom.addEventListener("change", () => {
      if (!isMobile()) {
        setTimeout(() => applyFilters(), 200);
      }
    });
  }

  if (selectYearTo) {
    selectYearTo.addEventListener("change", () => {
      if (!isMobile()) {
        setTimeout(() => applyFilters(), 200);
      }
    });
  }

  if (buyNowCheckbox) {
    buyNowCheckbox.addEventListener("change", () => {
      syncCheckboxAttribute(buyNowCheckbox);

      if (!isMobile()) {
        setTimeout(() => applyFilters(), 200);
      }
    });
  }

  function setupInputHandlers(
    input: HTMLInputElement | null,
    initialValue: number
  ) {
    if (!input) return;

    const handleRedirect = () => {
      const newValue = parseInt(input.value) || 0;
      if (newValue !== initialValue && !isMobile()) {
        setTimeout(() => applyFilters(), 200);
      }
    };

    input.addEventListener("blur", handleRedirect);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        handleRedirect();
      }
    });
  }

  if (inputPriceFrom) {
    const initialPriceFrom = parseInt(inputPriceFrom.value) || 0;
    setupInputHandlers(inputPriceFrom, initialPriceFrom);
  }

  if (inputPriceTo) {
    const initialPriceTo = parseInt(inputPriceTo.value) || MAX_PRICE;
    setupInputHandlers(inputPriceTo, initialPriceTo);
  }

  if (inputOdometerFrom) {
    const initialOdometerFrom = parseInt(inputOdometerFrom.value) || 0;
    setupInputHandlers(inputOdometerFrom, initialOdometerFrom);
  }

  if (inputOdometerTo) {
    const initialOdometerTo = parseInt(inputOdometerTo.value) || MAX_ODOMETER;
    setupInputHandlers(inputOdometerTo, initialOdometerTo);
  }

  function setupSliderHandler(
    inputFrom: HTMLInputElement | null,
    inputTo: HTMLInputElement | null,
    initialFrom: number,
    initialTo: number
  ) {
    if (!inputFrom || !inputTo) return;

    let wasChanged = false;

    document.addEventListener("mousemove", () => {
      const currentFrom = parseInt(inputFrom.value) || 0;
      const currentTo = parseInt(inputTo.value) || initialTo;

      if (currentFrom !== initialFrom || currentTo !== initialTo) {
        wasChanged = true;
      }
    });

    document.addEventListener("mouseup", () => {
      if (wasChanged && !isMobile()) {
        setTimeout(() => applyFilters(), 100);
        wasChanged = false;
      }
    });
  }

  if (priceSliderRoot) {
    const initialPriceFrom = inputPriceFrom
      ? parseInt(inputPriceFrom.value) || 0
      : 0;
    const initialPriceTo = inputPriceTo
      ? parseInt(inputPriceTo.value) || MAX_PRICE
      : MAX_PRICE;
    setupSliderHandler(
      inputPriceFrom,
      inputPriceTo,
      initialPriceFrom,
      initialPriceTo
    );
  }

  if (odometerSliderRoot) {
    const initialOdometerFrom = inputOdometerFrom
      ? parseInt(inputOdometerFrom.value) || 0
      : 0;
    const initialOdometerTo = inputOdometerTo
      ? parseInt(inputOdometerTo.value) || MAX_ODOMETER
      : MAX_ODOMETER;
    setupSliderHandler(
      inputOdometerFrom,
      inputOdometerTo,
      initialOdometerFrom,
      initialOdometerTo
    );
  }
}
