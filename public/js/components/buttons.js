window.initButtons = function initButtons() {
  const form = document.getElementById("basic-form");

  if (!form) {
    return;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
  });
};
