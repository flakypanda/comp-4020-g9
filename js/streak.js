document.addEventListener("DOMContentLoaded", function () {
    const streakCountDisplay = document.querySelector(".streak span"); // Select streak counter
  
    function loadStreak() {
      let streakCount = localStorage.getItem("streakCount") || 0; // Load streak count
      streakCountDisplay.textContent = streakCount; // Display streak
    }
  
    loadStreak(); // Load streak when journal page loads
  });
  