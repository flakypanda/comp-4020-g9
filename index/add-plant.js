document.addEventListener("DOMContentLoaded", function () {
  const addPlantBtn = document.getElementById("addPlantBtn");
  const plantFormOverlay = document.getElementById("plantFormOverlay");
  const plantFormContainer = document.getElementById("plantFormContainer");
  const plantForm = document.getElementById("plantForm");
  const cancelBtn = document.getElementById("cancelBtn");
  const greenhouseGrid = document.getElementById("greenhouseGrid");
  const plantImageInput = document.getElementById("plantImage");
  const imagePreview = document.getElementById("imagePreview");

  loadPlants(); // Load plants from local storage

  // Show form when "Add" button is clicked
  addPlantBtn.addEventListener("click", function () {
    plantFormOverlay.style.display = "block";
    plantFormContainer.style.display = "block";
  });

  // Hide form when "Cancel" is clicked
  cancelBtn.addEventListener("click", function () {
    plantFormOverlay.style.display = "none";
    plantFormContainer.style.display = "none";
    plantForm.reset();
    imagePreview.style.display = "none"; // Hide preview when closing
  });

  // Also close form when clicking on the overlay
  plantFormOverlay.addEventListener("click", function () {
    plantFormOverlay.style.display = "none";
    plantFormContainer.style.display = "none";
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

  // Function to format date to "Month Day, Year"
  function formatDate(dateString) {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  }

  // Handle form submission
  plantForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent page refresh

    // Get user input values
    const petName = document.getElementById("plantPetName").value.trim();
    const plantName = document.getElementById("plantName").value.trim();
    const plantDate = document.getElementById("plantDate").value;
    const formattedDate = formatDate(plantDate); // Convert date format
    const plantImageSrc = imagePreview.src;

    // Validate input fields
    if (!petName || !plantName || !plantDate) {
      alert("Please fill in all fields!");
      return;
    }

    // Create new plant object
    const newPlant = {
      id: Date.now(),
      petName,
      plantName,
      dateAdded: formattedDate,
      imageSrc: plantImageSrc,
    };

    savePlant(newPlant); // Save plant to local storage

    addPlantToGrid(newPlant); // Add plant to grid

    // Hide overlay and form after adding plant
    plantFormOverlay.style.display = "none";
    plantFormContainer.style.display = "none";

    // Clear form fields
    plantForm.reset();
    imagePreview.style.display = "none"; // Hide image preview
  });

  // Function to save plants from local storage
  function savePlant(plant) {
    let plants = JSON.parse(localStorage.getItem("plants")) || [];
    plant.dateAddedRaw = document.getElementById("plantDate").value; // Store raw YYYY-MM-DD
    plant.dateAdded = formatDate(plant.dateAddedRaw);
    plants.push(plant);
    localStorage.setItem("plants", JSON.stringify(plants));
  }

  // Function to load plants from local storage
  function loadPlants() {
    let plants = JSON.parse(localStorage.getItem("plants")) || [];
    plants.forEach(function (plant) {
      addPlantToGrid(plant);
    });
  }

  // Function to add plant to grid
  function addPlantToGrid(plant) {
    const plantCard = document.createElement("div");
    plantCard.classList.add("plant");
    plantCard.innerHTML = `
      <img src="${plant.imageSrc}" alt="plant" class="plant-image" onerror="this.onerror=null; this.src='images/plants/default-plant.jpg';" />
      <span class="plant-pet-name">${plant.petName}</span>
            <span class="plant-name">${plant.plantName}</span>
            <div class="date-container">
                <span class="date-title">Date Added:</span>
                <span class="date">${plant.dateAdded}</span>
            </div>
            <div class="menu-container">
                  <img src="images/menu.png" alt="menu" class="menu-icon" />

                  <div class="menu-dropdown">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                  </div>
                </div>
    `;

    plantCard.querySelector(".edit-btn").addEventListener("click", function () {
      editPlant(plant.id);
    });

    plantCard
      .querySelector(".delete-btn")
      .addEventListener("click", function () {
        deletePlant(plant.id, plantCard);
      });

    greenhouseGrid.insertBefore(plantCard, addPlantBtn);
  }

  function resetForm() {
    document.getElementById("plantPetName").value = "";
    document.getElementById("plantName").value = "";
    document.getElementById("plantDate").value = "";
    imagePreview.src = "";
    imagePreview.style.display = "none";
  }

  function updatePlant(event, plantId) {
    event.preventDefault();

    let plants = JSON.parse(localStorage.getItem("plants")) || [];
    let plantToEdit = plants.find((plant) => plant.id === plantId);
    if (!plantToEdit) return;

    plantToEdit.petName = document.getElementById("plantPetName").value.trim();
    plantToEdit.plantName = document.getElementById("plantName").value.trim();
    plantToEdit.dateAddedRaw = document.getElementById("plantDate").value;
    plantToEdit.dateAdded = formatDate(plantToEdit.dateAddedRaw);
    plantToEdit.imageSrc = imagePreview.src;

    localStorage.setItem("plants", JSON.stringify(plants));
    resetForm();
    location.reload(); // Refresh to update UI
  }

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

    // Show form
    plantFormOverlay.style.display = "block";
    plantFormContainer.style.display = "block";

    plantForm.removeEventListener("submit", handleSubmit);

    // Create a new listener specific to this edit
    function handleSubmit(event) {
      updatePlant(event, plantId);
    }

    plantForm.addEventListener("submit", handleSubmit);
  }

  // Function to delete a plant
  function deletePlant(plantId, plantElement) {
    let plants = JSON.parse(localStorage.getItem("plants")) || [];
    plants = plants.filter((plant) => plant.id !== plantId);
    localStorage.setItem("plants", JSON.stringify(plants));

    // Remove from UI
    plantElement.remove();
  }
});
