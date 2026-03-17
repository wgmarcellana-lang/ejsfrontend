const form = document.getElementById("basic-form");

const dropdown = {
  root: document.getElementById("multi-dropdown"),
  toggle: document.getElementById("dropdown-toggle"),
  label: document.getElementById("dropdown-label"),
  panel: document.getElementById("dropdown-panel"),
  options: document.getElementById("dropdown-options"),
  empty: document.getElementById("dropdown-empty"),
  tags: document.getElementById("selected-tags"),
  search: document.getElementById("select-search")
};

const dropdownItems = [
  { value: "option-1", label: "Option 1" },
  { value: "option-2", label: "Option 2" },
  { value: "option-3", label: "Option 3" },
  { value: "option-4", label: "Option 4" },
  { value: "option-5", label: "Option 5" }
];

const selectedDropdownValues = new Set();
const dropdownItemClass =
  "flex cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50";
const dropdownCheckboxClass =
  "h-4 w-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500";

// calendar mode
const calendar = {
  modes: document.querySelectorAll('input[name="calendar-mode"]'),
  startLabel: document.getElementById("start-date-label"),
  endWrap: document.getElementById("end-date-wrap")
};

// dropdown
function getSelectedDropdownItems() {
  return dropdownItems.filter((item) => selectedDropdownValues.has(item.value));
}

function setDropdownOpen(isOpen) {
  dropdown.panel.classList.toggle("hidden", !isOpen);
  dropdown.toggle.setAttribute("aria-expanded", String(isOpen));

  if (isOpen) {
    dropdown.search.focus();
  }
}

function syncDropdownDisplay() {
  const selected = getSelectedDropdownItems();
  dropdown.label.textContent = selected.length
    ? selected.map((item) => item.label).join(", ")
    : "Select options";

  dropdown.tags.innerHTML = "";
  selected.forEach((item) => {
    const tag = document.createElement("span");
    tag.className = "dropdown-tag";
    tag.textContent = item.label;
    dropdown.tags.appendChild(tag);
  });
}

function toggleOption(value, checked) {
  if (checked) {
    selectedDropdownValues.add(value);
  } else {
    selectedDropdownValues.delete(value);
  }

  syncDropdownDisplay();
}

function renderOptions(filterText = "") {
  const query = filterText.trim().toLowerCase();
  const filteredItems = dropdownItems.filter((item) => item.label.toLowerCase().includes(query));

  dropdown.options.innerHTML = "";
  dropdown.empty.classList.toggle("hidden", filteredItems.length > 0);

  filteredItems.forEach((option) => {
    const item = document.createElement("label");
    item.className = dropdownItemClass;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = option.value;
    checkbox.checked = selectedDropdownValues.has(option.value);
    checkbox.className = dropdownCheckboxClass;
    checkbox.addEventListener("change", () => toggleOption(option.value, checkbox.checked));

    const text = document.createElement("span");
    text.textContent = option.label;

    item.append(checkbox, text);
    dropdown.options.appendChild(item);
  });
}

function updateCalendarMode() {
  const isRange = document.querySelector('input[name="calendar-mode"]:checked').value === "range";
  calendar.startLabel.textContent = isRange ? "Start Date" : "Date";
  calendar.endWrap.classList.toggle("hidden", !isRange);
}

dropdown.toggle.addEventListener("click", () => {
  const isOpen = dropdown.panel.classList.contains("hidden");
  setDropdownOpen(isOpen);
});

dropdown.search.addEventListener("input", (event) => {
  renderOptions(event.target.value);
});

calendar.modes.forEach((input) => {
  input.addEventListener("change", updateCalendarMode);
});

document.addEventListener("click", (event) => {
  if (!dropdown.root.contains(event.target)) {
    setDropdownOpen(false);
  }
});

form.addEventListener("reset", () => {
  selectedDropdownValues.clear();
  dropdown.search.value = "";
  renderOptions();
  syncDropdownDisplay();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
});

renderOptions();
syncDropdownDisplay();
updateCalendarMode();
