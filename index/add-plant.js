import plantDatabase from "./plant-db.js";

document.addEventListener("DOMContentLoaded", function () {
  const addPlantBtn = document.getElementById("addPlantBtn");
  const plantFormOverlay = document.getElementById("plantFormOverlay");
  const plantFormContainer = document.getElementById("plantFormContainer");
  const plantForm = document.getElementById("plantForm");
  const cancelBtn = document.getElementById("cancelBtn");
  const greenhouseGrid = document.getElementById("greenhouseGrid");
  const plantImageInput = document.getElementById("plantImage");
  const imagePreview = document.getElementById("imagePreview");

  const plantInfoModal = document.getElementById("plantInfoModal");
  const modalPlantImage = document.getElementById("modalPlantImage");
  const modalPlantPetName = document.getElementById("modalPlantPetName");
  const modalPlantBotName = document.getElementById("modalPlantBotName");
  const modalPlantName = document.getElementById("modalPlantName");
  const modalPlantCare = document.getElementById("modalPlantCare");
  const closePlantInfo = document.querySelector(".close-modal");

  // Load plants from localStorage when the page loads
  loadPlants();

  // Show form when "Add" button is clicked
  addPlantBtn.addEventListener("click", function () {
    plantFormOverlay.style.display = "block";
    plantFormContainer.style.display = "block";
    delete plantForm.dataset.editingPlantId; // Ensure form is in add mode
  });

  // Hide form when "Cancel" is clicked
  cancelBtn.addEventListener("click", function () {
    closeForm();
  });

  // Also close form when clicking on the overlay
  plantFormOverlay.addEventListener("click", function () {
    closeForm();
  });

  // Handle image preview
  plantImageInput.addEventListener("change", function () {
    const file = plantImageInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imagePreview.src = e.target.result;
        imagePreview.style.display = "block";
      };
      reader.readAsDataURL(file);
    } else {
      imagePreview.style.display = "none";
    }
  });

  // Handle form submission (Add or Edit)
  plantForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (plantForm.dataset.editingPlantId) {
      updatePlant();
    } else {
      addNewPlant();
    }
  });

  // Function to format date to "Month Day, Year"
  function formatDate(dateString) {
    let actDate = new Date(dateString);//create new Date object .. buggy and creates a day before
    let tmr = actDate.getDate()+ 1;//add to the new date
    actDate = new Date(actDate.setDate(tmr));
    return actDate;
  }

  // Function to close form and reset fields
  function closeForm() {
    plantFormOverlay.style.display = "none";
    plantFormContainer.style.display = "none";
    resetForm();
  }

  // Function to reset form fields
  function resetForm() {
    plantForm.reset();
    delete plantForm.dataset.editingPlantId; // Remove editing state
    imagePreview.style.display = "none";
  }

  // Function to save plant to localStorage
  function savePlant(plant) {
    let plants = JSON.parse(localStorage.getItem("plants")) || [];
    plants.push(plant);
    localStorage.setItem("plants", JSON.stringify(plants));
  }

  // Function to load plants from localStorage
  function loadPlants() {
    let plants = JSON.parse(localStorage.getItem("plants")) || [];
    plants.forEach(addPlantToGrid);
  }

  // Function to add a new plant
  function addNewPlant() {
    let petName = document.getElementById("plantPetName").value.trim();
    petName ||= "_";
    const plantName = document.getElementById("plantName").value.trim();
    const plantDate = document.getElementById("plantDate").value;
    
    const formattedDate = formatDate(plantDate);
    const plantImageSrc = imagePreview.src;

    if (!plantName || !plantDate) {
      alert("Please fill in all fields!");
      return;
    }

    const newPlant = {
      id: Date.now(),
      petName,
      plantName,
      dateAddedRaw: plantDate,
      dateAdded: formattedDate,
      imageSrc: plantImageSrc,
    };

    savePlant(newPlant);
    addPlantToGrid(newPlant);
    closeForm();
  }

  // Function to update an existing plant
  function updatePlant() {
    let plants = JSON.parse(localStorage.getItem("plants")) || [];
    let plantId = Number(plantForm.dataset.editingPlantId);
    let plantToEdit = plants.find((plant) => plant.id === plantId);

    if (!plantToEdit) return;

    // Update plant details
    plantToEdit.petName = document.getElementById("plantPetName").value.trim();
    plantToEdit.plantName = document.getElementById("plantName").value.trim();
    plantToEdit.dateAddedRaw = document.getElementById("plantDate").value;
    plantToEdit.dateAdded = formatDate(plantToEdit.dateAddedRaw);
    plantToEdit.imageSrc = imagePreview.src;

    // Save to local storage
    localStorage.setItem("plants", JSON.stringify(plants));

    // Update UI
    const plantCard = document.querySelector(`[data-id="${plantId}"]`);
    if (plantCard) {
      plantCard.querySelector(".plant-pet-name").textContent =
        plantToEdit.petName;
      plantCard.querySelector(".plant-name").textContent =
        plantToEdit.plantName;
      plantCard.querySelector(".date").textContent = plantToEdit.dateAdded.toISOString().split("T")[0];
      plantCard.querySelector(".plant-image").src = plantToEdit.imageSrc;
    }

    closeForm();
  }

  // Function to add plant to UI
  function addPlantToGrid(plant) {
    const plantCard = document.createElement("div");
    plantCard.classList.add("plant");
    plantCard.setAttribute("data-id", plant.id);

    plantCard.innerHTML = `
          <img src="${plant.imageSrc}" alt="plant" class="plant-image" onerror="this.onerror=null; this.src='images/plants/default-plant.jpg';" />
          <span class="plant-pet-name">${plant.petName}</span>
          <span class="plant-name">${plant.plantName}</span>
          <div class="date-container">
              <span class="date-title">Date Added:</span>
              <span class="date">${plant.dateAddedRaw}</span>
          </div>
          <div class="menu-container">
              <img src="images/menu.png" alt="menu" class="menu-icon" />
              <div class="menu-dropdown">
                  <button class="edit-btn">Edit</button>
                  <button class="delete-btn">Delete</button>
              </div>
          </div>
      `;

    plantCard.addEventListener("click", function (event) {
      if (!event.target.closest(".menu-container")) {
        openPlantInfo(plant.id);
      }
    });

    // Edit button
    plantCard.querySelector(".edit-btn").addEventListener("click", function () {
      editPlant(plant.id);
    });

    // Delete button
    plantCard
      .querySelector(".delete-btn")
      .addEventListener("click", function () {
        deletePlant(plant.id, plantCard);
      });

    greenhouseGrid.insertBefore(plantCard, addPlantBtn);
  }

  // Function to edit a plant
  function editPlant(plantId) {
    let plants = JSON.parse(localStorage.getItem("plants")) || [];
    let plantToEdit = plants.find((plant) => plant.id === plantId);

    if (!plantToEdit) return;

    // Populate form with plant details
    document.getElementById("plantPetName").value = plantToEdit.petName;
    document.getElementById("plantName").value = plantToEdit.plantName;
    document.getElementById("plantDate").value = plantToEdit.dateAddedRaw;
    imagePreview.src = plantToEdit.imageSrc;
    imagePreview.style.display = "block";

    // Store plant ID in form dataset
    plantForm.dataset.editingPlantId = plantId;

    // Show form
    plantFormOverlay.style.display = "block";
    plantFormContainer.style.display = "block";
  }

  // Function to delete a plant
  function deletePlant(plantId, plantElement) {
    let plants = JSON.parse(localStorage.getItem("plants")) || [];
    plants = plants.filter((plant) => plant.id !== plantId);
    localStorage.setItem("plants", JSON.stringify(plants));

    // Remove from UI
    plantElement.remove();
  }

  function openPlantInfo(plant) {
    const plantName = plant.querySelector(".plant-name").textContent.trim();
    const plantDetails = plantDatabase[plantName] || {
      botanicalName: "Unknown",
      pot: "Unknown",
      soil: "Unknown",
      waterNeeds: "Unknown",
      sunlight: "Unknown",
      temperature: "Unknown",
      humidity: "Unknown",
      growthRate: "Unknown",
      careDifficulty: "Unknown",
      toxicity: "Unknown",
    };

    modalPlantImage.src = plant.querySelector(".plant-image").src;
    modalPlantPetName.textContent =
      plant.querySelector(".plant-pet-name").textContent;
    modalPlantName.textContent = plantName;
    modalPlantBotName.textContent = plantDetails.botanicalName;
    modalPlantCare.textContent = plantDetails.careDifficulty;
    modalPot.textContent = plantDetails.pot;
    modalSoilNeeds.textContent = plantDetails.soil;
    modalWaterNeeds.textContent = plantDetails.waterNeeds;
    modalSunlight.textContent = plantDetails.sunlight;
    modalTemp.textContent = plantDetails.temperature;
    modalHumid.textContent = plantDetails.humidity;
    modalGrowthRate.textContent = plantDetails.growthRate;
    modalToxicity.textContent = plantDetails.toxicity;

    const commonProblemsList = document.getElementById("modalCommonProbs");
    commonProblemsList.innerHTML = "";

    if (plantDetails.commonProblems && plantDetails.commonProblems.length > 0) {
      plantDetails.commonProblems.forEach((problem) => {
        let li = document.createElement("li");
        li.textContent = problem;
        commonProblemsList.appendChild(li);
      });
    } else {
      let li = document.createElement("li");
      li.textContent = "No common problems listed.";
      commonProblemsList.appendChild(li);
    }

    const incompatiblePlants = document.getElementById(
      "modalIncompatiblePlants"
    );
    incompatiblePlants.innerHTML = "";

    if (
      plantDetails.incompatiblePlants &&
      plantDetails.incompatiblePlants.length > 0
    ) {
      plantDetails.incompatiblePlants.forEach((plant) => {
        let li = document.createElement("li");
        li.textContent = plant;
        incompatiblePlants.appendChild(li);
      });
    } else {
      let li = document.createElement("li");
      li.textContent = "No incompatible plants listed.";
      incompatiblePlants.appendChild(li);
    }

    plantInfoModal.style.display = "block";
    plantFormOverlay.style.display = "block";
  }

  // Add click event to all plants
  document.querySelectorAll(".plant").forEach((plant) => {
    plant.addEventListener("click", function (event) {
      if (!event.target.closest(".menu-container")) {
        openPlantInfo(plant);
      }
    });
  });

  document.querySelectorAll(".menu-container").forEach((menu) => {
    menu.addEventListener("click", function (event) {
      event.stopPropagation();
    });
  });

  // Close modal when clicking the close button
  closePlantInfo.addEventListener("click", function () {
    plantInfoModal.style.display = "none";
    plantFormOverlay.style.display = "none";
  });

  plantFormOverlay.addEventListener("click", function () {
    plantInfoModal.style.display = "none";
    plantFormOverlay.style.display = "none";
  });
});
