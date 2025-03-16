document.addEventListener("DOMContentLoaded", function () {
  const urlParams = new URLSearchParams(window.location.search);
  let selectedPlant = urlParams.get("plant") || "Mother of Thousands"; // Default

  const titleElement = document.getElementById("journalPlantTitle");
  const dropdown = document.getElementById("plantDropdown");
  const entriesContainer = document.getElementById("entriesContainer");

  // Load dropdown options
  Object.keys(journalDatabase).forEach((plant) => {
    const option = document.createElement("option");
    option.value = plant;
    option.textContent = plant;
    if (plant === selectedPlant) {
      option.selected = true;
    }
    dropdown.appendChild(option);
  });

  // Load journal entries
  function loadEntries(plant) {
    entriesContainer.innerHTML = "";
    titleElement.textContent = plant;
    journalDatabase[plant]?.forEach((entry) => {
      const entryDiv = document.createElement("div");
      entryDiv.classList.add("entry-card");
      entryDiv.textContent = `${entry.date} - ${entry.title}`;
      entryDiv.addEventListener("click", function () {
        alert(`Viewing entry: ${entry.title}`);
      });
      entriesContainer.appendChild(entryDiv);
    });
  }

  // Change plant on dropdown selection
  dropdown.addEventListener("change", function () {
    selectedPlant = this.value;
    loadEntries(selectedPlant);
  });

  // Initial load
  loadEntries(selectedPlant);
});
