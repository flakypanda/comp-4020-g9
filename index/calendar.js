document.addEventListener("DOMContentLoaded", function () {
  const weekDays = document.getElementById("weekDays");
  const monthYearDisplay = document.getElementById("monthYear");
  const prevWeekBtn = document.getElementById("prevWeek");
  const nextWeekBtn = document.getElementById("nextWeek");
  const streakCountDisplay = document.querySelector(".streak span"); 

  let today = new Date();
  let currentDate = new Date(today);
  let selectedDate = localStorage.getItem("selectedDate") || today.toISOString().split("T")[0];
  let checkedDates = new Set(JSON.parse(localStorage.getItem("checkedDates")) || []);

  function getStartOfWeek(date) {
      let dayOfWeek = date.getDay();
      let startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - dayOfWeek);
      return startOfWeek;
  }

  function renderWeek() {
      weekDays.innerHTML = "";
      let startOfWeek = getStartOfWeek(currentDate);
      let weekDates = [];

      for (let i = 0; i < 7; i++) {
          let dayDate = new Date(startOfWeek);
          dayDate.setDate(startOfWeek.getDate() + i);
          weekDates.push(dayDate);
      }

      monthYearDisplay.textContent = startOfWeek.toLocaleDateString("en-US", { month: "long", year: "numeric" });

      weekDates.forEach((date) => {
          let dayDiv = document.createElement("div");
          dayDiv.textContent = date.getDate();
          dayDiv.classList.add("calendar-day");

          let dateStr = date.toISOString().split("T")[0];

          if (dateStr === selectedDate) {
              dayDiv.classList.add("selected");
          }

          if (checkedDates.has(dateStr)) {
              dayDiv.textContent = "✔";
          }
          
          dayDiv.addEventListener("click", function () {
              selectedDate = dateStr;
              localStorage.setItem("selectedDate", selectedDate);

              document.querySelectorAll(".calendar-day").forEach(d => d.classList.remove("selected"));
              dayDiv.classList.add("selected");

              // Notify the to-do list script to load tasks
              window.dispatchEvent(new Event("dateChanged"));
          });

          weekDays.appendChild(dayDiv);
      });

      updateStreak();
  }

  function updateStreak() {
      streakCountDisplay.textContent = checkedDates.size;
      localStorage.setItem("streakCount", checkedDates.size);
  }

  function updateCalendar() {
      checkedDates = new Set(JSON.parse(localStorage.getItem("checkedDates")) || []);
      renderWeek();
  }

  prevWeekBtn.addEventListener("click", function () {
      currentDate.setDate(currentDate.getDate() - 7);
      renderWeek();
  });

  nextWeekBtn.addEventListener("click", function () {
      currentDate.setDate(currentDate.getDate() + 7);
      renderWeek();
  });

  window.addEventListener("tasksUpdated", updateCalendar);

  renderWeek();
});
