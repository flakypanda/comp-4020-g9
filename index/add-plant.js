document.addEventListener("DOMContentLoaded", function () {
  const addPlantBtn = document.getElementById("addPlantBtn");
  const plantFormOverlay = document.getElementById("plantFormOverlay");
  const plantFormContainer = document.getElementById("plantFormContainer");
  const plantForm = document.getElementById("plantForm");
  const cancelBtn = document.getElementById("cancelBtn");
  const greenhouseGrid = document.getElementById("greenhouseGrid");
  const plantImageInput = document.getElementById("plantImage");
  const imagePreview = document.getElementById("imagePreview");

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

    // Create new plant div
    const newPlant = document.createElement("div");
    newPlant.classList.add("plant");
    newPlant.innerHTML = `
          <img src="${plantImageSrc}" alt="plant" class="plant-image" onerror="this.onerror=null; this.src='images/plants/default-plant.jpg';" />
          <span class="plant-pet-name">${petName}</span>
          <span class="plant-name">${plantName}</span>
          <div class="date-container">
              <span class="date-title">Date Added:</span>
              <span class="date">${formattedDate}</span>
          </div>
      `;

    // Insert the new plant **before** the add button
    greenhouseGrid.insertBefore(newPlant, addPlantBtn);

    // Hide overlay and form after adding plant
    plantFormOverlay.style.display = "none";
    plantFormContainer.style.display = "none";

    // Clear form fields
    plantForm.reset();
    imagePreview.style.display = "none"; // Hide image preview
  });
});
