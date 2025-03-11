document.addEventListener("DOMContentLoaded", function () {
  const weekDays = document.getElementById("weekDays");
  const monthYearDisplay = document.getElementById("monthYear");
  const prevWeekBtn = document.getElementById("prevWeek");
  const nextWeekBtn = document.getElementById("nextWeek");

  let today = new Date();
  let currentDate = new Date(today);

  function getStartOfWeek(date) {
    let dayOfWeek = date.getDay(); // Sunday = 0, Monday = 1, etc.
    let startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - dayOfWeek); // Move to Sunday
    return startOfWeek;
  }

  function renderWeek() {
    weekDays.innerHTML = ""; // Clear previous week
    let startOfWeek = getStartOfWeek(currentDate);
    let weekDates = [];

    for (let i = 0; i < 7; i++) {
      let dayDate = new Date(startOfWeek);
      dayDate.setDate(startOfWeek.getDate() + i);
      weekDates.push(dayDate);
    }

    // Update Month & Year
    monthYearDisplay.textContent = startOfWeek.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    // Create week row
    weekDates.forEach((date) => {
      let dayDiv = document.createElement("div");
      dayDiv.textContent = date.getDate();

      // Highlight today
      if (date.toDateString() === today.toDateString()) {
        dayDiv.classList.add("selected");
      }

      dayDiv.addEventListener("click", function () {
        document
          .querySelectorAll(".calendar-week div")
          .forEach((d) => d.classList.remove("selected"));
        dayDiv.classList.add("selected");
      });

      weekDays.appendChild(dayDiv);
    });
  }

  prevWeekBtn.addEventListener("click", function () {
    currentDate.setDate(currentDate.getDate() - 7);
    renderWeek();
  });

  nextWeekBtn.addEventListener("click", function () {
    currentDate.setDate(currentDate.getDate() + 7);
    renderWeek();
  });

  renderWeek(); // Initial render
});
