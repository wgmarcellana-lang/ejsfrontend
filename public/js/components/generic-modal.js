window.initGenericModal = function initGenericModal() {
  const modal = document.getElementById("generic-modal");

  if (!modal) {
    return;
  }

  const titleElement = modal.querySelector(".generic-modal__title");
  const bodyElement = modal.querySelector("[data-modal-body]");
  const footerElement = modal.querySelector("[data-modal-footer]");

  const closeModal = () => {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
  };

  const openModal = () => {
    modal.classList.remove("hidden");
    modal.setAttribute("aria-hidden", "false");
  };

  const escapeHtml = (value) =>
    String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  if (!titleElement || !bodyElement || !footerElement) {
    return;
  }

  if (modal.dataset.modalInitialized === "true") {
    return;
  }

  modal.dataset.modalInitialized = "true";

  const renderButtons = (buttons = []) => {
    const resolvedButtons = buttons.length
      ? buttons
      : [
          {
            text: "Close",
            className: "action-button action-button-secondary",
            action: "close",
          },
        ];

    footerElement.innerHTML = resolvedButtons
      .map((button) => {
        const className = button.className || "action-button action-button-secondary";
        const action = button.action || "";
        return `
          <button type="button" class="${className}" data-modal-action="${escapeHtml(action)}">
            ${escapeHtml(button.text || "Close")}
          </button>
        `;
      })
      .join("");
  };

  const setBodyContent = (config) => {
    if (typeof config.bodyHtml === "string" && config.bodyHtml.trim()) {
      bodyElement.innerHTML = config.bodyHtml;
      return;
    }

    bodyElement.innerHTML = `<p class="generic-modal__message">${escapeHtml(config.message || "")}</p>`;
  };

  const showModal = (config = {}) => {
    if (titleElement) {
      titleElement.textContent = config.title || "Modal Title";
    }

    setBodyContent(config);
    renderButtons(config.buttons);
    openModal();
  };

  modal.addEventListener("click", (event) => {
    const closeTarget = event.target.closest("[data-modal-close]");
    const actionTarget = event.target.closest("[data-modal-action]");

    if (closeTarget) {
      closeModal();
      return;
    }

    if (!actionTarget) {
      return;
    }

    if (actionTarget.dataset.modalAction === "close") {
      closeModal();
    }
  });

  document.querySelectorAll("[data-modal-demo]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const demoType = trigger.dataset.modalDemo;

      if (demoType === "message") {
        showModal({
          title: "Test Message Modal",
          message: "Test",
        });
        return;
      }

      if (demoType === "confirmation") {
        showModal({
          title: "Test Confirmation Modal",
          message: "Are you sure?",
          buttons: [
            {
              text: "Cancel",
              className: "action-button action-button-secondary",
              action: "close",
            },
            {
              text: "OK",
              className: "action-button action-button-primary",
              action: "confirm",
            },
          ],
        });
        return;
      }

      showModal({
        title: "Test Custom Modal",
        bodyHtml: `
          <form class="generic-modal__form">
            <div>
              <label for="demo-username" class="field-label">Username</label>
              <input id="demo-username" type="text" class="field-input field-input-soft" placeholder="Enter username" />
            </div>
            <div>
              <label for="demo-password" class="field-label">Password</label>
              <input id="demo-password" type="password" class="field-input field-input-soft" placeholder="Enter password" />
            </div>
          </form>
        `,
        buttons: [
          {
            text: "Cancel",
            className: "action-button action-button-secondary",
            action: "close",
          },
          {
            text: "Save",
            className: "action-button action-button-primary",
            action: "save",
          },
        ],
      });
    });
  });

  window.genericModal = {
    open: showModal,
    close: closeModal,
  };
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.initGenericModal?.();
  });
} else {
  window.initGenericModal?.();
}
