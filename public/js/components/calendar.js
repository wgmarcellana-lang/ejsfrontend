window.initCalendar = function initCalendar() {
  const calendar = {
    modes: document.querySelectorAll('input[name="calendar-mode"]'),
    startLabel: document.getElementById("start-date-label"),
    endWrap: document.getElementById("end-date-wrap")
  };

  if (!calendar.modes.length || !calendar.startLabel || !calendar.endWrap) {
    return;
  }

  function updateCalendarMode() {
    const selectedMode = document.querySelector('input[name="calendar-mode"]:checked');
    const isRange = selectedMode && selectedMode.value === "range";

    calendar.startLabel.textContent = isRange ? "Start Date" : "Date";
    calendar.endWrap.classList.toggle("hidden", !isRange);
  }

  calendar.modes.forEach((input) => {
    input.addEventListener("change", updateCalendarMode);
  });

  updateCalendarMode();
};
