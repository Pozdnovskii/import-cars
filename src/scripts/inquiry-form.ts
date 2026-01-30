import { actions } from "astro:actions";
export function initInquiryForm(formId: string) {
  const form = document.getElementById(formId) as HTMLFormElement;
  if (!form) return;

  const dialog = form.closest("dialog") as HTMLDialogElement | null;

  const closeBtn = dialog?.querySelector(
    "#close-modal-icon"
  ) as HTMLButtonElement;

  const submitBtn = form?.querySelector(
    'button[type="submit"]'
  ) as HTMLButtonElement;
  const message = document.getElementById("form-message") as HTMLElement;
  const nameInput = form.querySelector(
    'input[name="name"]'
  ) as HTMLInputElement;
  const emailInput = form.querySelector(
    'input[name="email"]'
  ) as HTMLInputElement;
  const phoneInput = form.querySelector(
    'input[name="phone"]'
  ) as HTMLInputElement;
  const messageTextarea = form.querySelector(
    'textarea[name="message"]'
  ) as HTMLTextAreaElement;

  function showError(
    input: HTMLInputElement | HTMLTextAreaElement,
    errorMsg: string
  ) {
    const inputName = input.getAttribute("name");
    const errorEl = document.getElementById(
      `${inputName}-error-message`
    ) as HTMLElement;

    errorEl.textContent = errorMsg;
    input.setAttribute("aria-invalid", "true");
    input.setAttribute("aria-describedby", `${inputName}-error-message`);
  }

  function clearError(input: HTMLInputElement | HTMLTextAreaElement) {
    const inputName = input.getAttribute("name");
    const errorEl = document.getElementById(
      `${inputName}-error-message`
    ) as HTMLElement;

    if (errorEl) {
      errorEl.textContent = "";
    }

    input.setAttribute("aria-invalid", "false");
    input.removeAttribute("aria-describedby");
  }

  function validateName(): boolean {
    const value = nameInput.value.trim();

    if (value.length === 0) {
      showError(nameInput, "Полето е задължително");
      return false;
    }

    if (value.length < 2) {
      showError(nameInput, "Името трябва да е минимум 2 символа");
      return false;
    }

    if (value.length > 100) {
      showError(nameInput, "Името е твърде дълго");
      return false;
    }

    clearError(nameInput);
    return true;
  }

  function validateEmail(): boolean {
    const value = emailInput.value.trim();
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
    if (value.length === 0) {
      showError(emailInput, "Полето е задължително");
      return false;
    }

    if (!emailRegex.test(value)) {
      showError(emailInput, "Невалиден email адрес");
      return false;
    }

    if (value.length > 255) {
      showError(emailInput, "Email е твърде дълъг");
      return false;
    }

    clearError(emailInput);
    return true;
  }

  function validatePhone(): boolean {
    const value = phoneInput.value.trim();
    const phoneRegex = /^[0-9+\s\-()]+$/;

    if (value.length === 0) {
      clearError(phoneInput);
      return true;
    }

    if (!phoneRegex.test(value)) {
      showError(phoneInput, "Невалиден формат на телефон");
      return false;
    }

    if (value.length < 7) {
      showError(phoneInput, "Телефонът трябва да е минимум 7 символа");
      return false;
    }

    if (value.length > 18) {
      showError(phoneInput, "Телефонът е твърде дълъг");
      return false;
    }

    clearError(phoneInput);
    return true;
  }

  function validateMessage(): boolean {
    const value = messageTextarea.value.trim();

    if (value.length > 1000) {
      showError(
        messageTextarea,
        "Съобщението е твърде дълго (максимум 1000 символа)"
      );
      return false;
    }

    clearError(messageTextarea);
    return true;
  }

  function debounce(func: Function, wait: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  nameInput?.addEventListener("blur", () => {
    if (nameInput.value.trim().length > 0) {
      validateName();
    }
  });

  nameInput?.addEventListener(
    "input",
    debounce(() => {
      if (nameInput.getAttribute("aria-invalid") === "true") {
        validateName();
      }
    }, 300)
  );

  emailInput?.addEventListener("blur", () => {
    if (emailInput.value.trim().length > 0) {
      validateEmail();
    }
  });

  emailInput?.addEventListener(
    "input",
    debounce(() => {
      if (emailInput.getAttribute("aria-invalid") === "true") {
        validateEmail();
      }
    }, 300)
  );

  phoneInput?.addEventListener("blur", () => {
    if (phoneInput.value.trim().length > 0) {
      validatePhone();
    }
  });

  phoneInput?.addEventListener(
    "input",
    debounce(() => {
      if (phoneInput.getAttribute("aria-invalid") === "true") {
        validatePhone();
      }
    }, 300)
  );

  messageTextarea?.addEventListener("blur", () => {
    if (messageTextarea.value.trim().length > 0) {
      validateMessage();
    }
  });

  messageTextarea?.addEventListener(
    "input",
    debounce(() => {
      if (messageTextarea.getAttribute("aria-invalid") === "true") {
        validateMessage();
      }
    }, 300)
  );

  function closeDialog() {
    if (!dialog) return;

    dialog.close();
    form.reset();
    form.querySelectorAll('[id$="error-message"]').forEach((el) => {
      el.textContent = "";
    });
    form.querySelectorAll('[aria-invalid="true"]').forEach((el) => {
      el.setAttribute("aria-invalid", "false");
      el.removeAttribute("aria-describedby");
    });

    message?.classList.add("hidden");
    message?.classList.remove("success", "error");
  }

  if (dialog) {
    function closeOnBackdropClick({ currentTarget, target }: MouseEvent) {
      if (target === currentTarget) {
        closeDialog();
      }
    }

    dialog.addEventListener("click", closeOnBackdropClick);

    closeBtn?.addEventListener("click", (e) => {
      e.stopPropagation();
      closeDialog();
    });
  }

  form?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isMessageValid = validateMessage();

    if (!isNameValid || !isEmailValid || !isPhoneValid || !isMessageValid) {
      return;
    }

    const formData = new FormData(form);

    submitBtn.disabled = true;
    submitBtn.textContent = "Изпращане...";
    message.classList.add("hidden");

    try {
      const { data, error } = await actions.submitForm(formData);

      if (error) {
        if (
          error.code === "BAD_REQUEST" &&
          error.message.includes("Failed to validate")
        ) {
          const validationErrors = JSON.parse(
            error.message.split("Failed to validate: ")[1]
          );

          validationErrors.forEach((err: any) => {
            const fieldName = err.path[0];
            const fieldInput = form.querySelector(`[name="${fieldName}"]`) as
              | HTMLInputElement
              | HTMLTextAreaElement;

            if (fieldInput) {
              showError(fieldInput, err.message);
            }
          });

          return;
        }

        throw new Error(error.message);
      }

      message.textContent = data.message;
      message.classList.remove("hidden", "error");
      message.classList.add("success");

      if (dialog) {
        setTimeout(() => closeDialog(), 66660);
      } else {
        form.reset();
      }
    } catch (err) {
      message.textContent =
        err instanceof Error
          ? err.message
          : "Възникна грешка. Моля опитайте отново.";

      message.classList.remove("hidden", "success");
      message.classList.add("error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Изпрати";
    }
  });
}
