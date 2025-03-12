document.addEventListener("DOMContentLoaded", function () {
    const weekDays = document.getElementById("weekDays");
    const monthYearDisplay = document.getElementById("monthYear");
    const prevWeekBtn = document.getElementById("prevWeek");
    const nextWeekBtn = document.getElementById("nextWeek");
    const streakCountDisplay = document.querySelector(".streak span"); // Streak counter element
  
    let today = new Date();
    let currentDate = new Date(today);
    let selectedDate = null;
    let checkedDates = new Set(JSON.parse(localStorage.getItem("checkedDates")) || []); // Load saved checked dates
  
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
        dayDiv.classList.add("calendar-day");
  
        // Highlight today's date unless another date is selected
        if (date.toDateString() === today.toDateString() && !selectedDate) {
          dayDiv.classList.add("selected");
          selectedDate = date; // Mark today as selected initially
        }
  
        // Maintain selection when navigating weeks
        if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
          dayDiv.classList.add("selected");
        }
  
        // Check if this date was previously checked
        if (checkedDates.has(date.toDateString())) {
          dayDiv.textContent = "✔"; // Keep checkmark
        }
  
        // Double-click event to toggle checkmark
        dayDiv.addEventListener("dblclick", function () {
          if (!checkedDates.has(date.toDateString())) {
            checkedDates.add(date.toDateString());
            dayDiv.textContent = "✔"; // Change text to checkmark
          } else {
            checkedDates.delete(date.toDateString());
            dayDiv.textContent = date.getDate(); // Revert to date number
          }
  
          updateStreak(); // Update streak count
          saveData(); // Save changes
        });
  
        weekDays.appendChild(dayDiv);
      });
  
      updateStreak(); // Refresh streak count when rendering
    }
  
    function updateStreak() {
      let streakCount = checkedDates.size; // Count checked dates
      streakCountDisplay.textContent = streakCount; // Update streak display
      localStorage.setItem("streakCount", streakCount); // Save streak in localStorage
    }
  
    function saveData() {
      localStorage.setItem("checkedDates", JSON.stringify([...checkedDates])); // Save checked dates
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
  