document.addEventListener("DOMContentLoaded", function () {

    const searchInput = document.getElementById("searchPlants");
    const searchButton = document.querySelector(".search-btn");
    const plantsGrid = document.getElementById("myPlantsSection");


    searchButton.addEventListener("click", function () {
        performSearch();
    });

    searchInput.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            performSearch();
        }
    });

    function performSearch() {
        const wordSearched = searchInput.value.toLowerCase().trim();
        if (!wordSearched) {
            resetSearch();
            return;
        }


        const plantCards = document.querySelectorAll(".plant-card");

        plantCards.forEach(card => {
            card.style.display = "none";
        });

        let found = false;


        plantCards.forEach(card => {
            const plantName = card.getAttribute("data-plant").toLowerCase();


            if (plantName.startsWith(wordSearched) || plantName.includes(wordSearched)) {
                card.style.display = "block";
                found = true;
            }
        });

        if (!found) {
            const noResultsMessage = document.createElement("p");
            noResultsMessage.id = "no-results";
            noResultsMessage.textContent = "No plants matching your search.";
            noResultsMessage.style.textAlign = "center";
            noResultsMessage.style.width = "100%";
            noResultsMessage.style.padding = "20px";

            const existingMessage = document.getElementById("no-results");
            if (existingMessage) {
                existingMessage.remove();
            }

            plantsGrid.appendChild(noResultsMessage);
        }
    }

    function resetSearch() {
        searchInput.value = "";
        const plantCards = document.querySelectorAll(".plant-card");
        plantCards.forEach(card => {
            card.style.display = "block";
        });

        const noResultsMessage = document.getElementById("no-results");
        if (noResultsMessage) {
            noResultsMessage.remove();
        }
    }


    const myPlantsTab = document.getElementById("myPlantsTab");
    const pastDiagnosisTab = document.getElementById("pastDiagnosisTab");
    const myPlantsSection = document.getElementById("myPlantsSection");
    const pastDiagnosisSection = document.getElementById("pastDiagnosisSection");

    myPlantsTab.addEventListener("click", function () {
        myPlantsTab.classList.add("active");
        pastDiagnosisTab.classList.remove("active");
        myPlantsSection.style.display = "grid";
        pastDiagnosisSection.style.display = "none";
        searchInput.placeholder = "Search Plants...";
        resetSearch();
    });

    pastDiagnosisTab.addEventListener("click", function () {
        pastDiagnosisTab.classList.add("active");
        myPlantsTab.classList.remove("active");
        pastDiagnosisSection.style.display = "block";
        myPlantsSection.style.display = "none";
        searchInput.placeholder = "Search Diagnosis...";

        searchInput.value = "";
    });


    const plantCards = document.querySelectorAll(".plant-card");
    plantCards.forEach(card => {
        card.addEventListener("click", function () {
            const plant = this.getAttribute("data-plant");
            window.location.href = `diagnosis.html?plant=${encodeURIComponent(plant)}`;
        });
    });
});