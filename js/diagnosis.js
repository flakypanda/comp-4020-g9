document.addEventListener("DOMContentLoaded", function () {
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    const plantName = getQueryParam("plant");

    if (plantName && plantDatabase[plantName]) {
        const plantData = plantDatabase[plantName];

        document.getElementById("plantPetName").textContent = plantData.name;
        document.getElementById("plantImage").src = plantData.image;
        document.getElementById("plantScientificName").textContent =
            plantData.scientificName;

        //search
        const searchInput = document.getElementById("searchSymptoms");
        const searchButton = document.querySelector(".search-btn");

        searchButton.addEventListener("click", function () {
            performSearch();
        });

        searchInput.addEventListener("keypress", function (event) {
            if (event.key === "Enter") {
                performSearch();
            }
        });

        function performSearch() {
            const searchWord = searchInput.value.toLowerCase().trim();
            if (!searchWord) return;

            const searchWords = searchWord.split(/\s+/).filter(word => word.length > 2);

            const matchingIssues = [];

            plantData.issues.forEach(issue => {
                let found = false;

                for (const word of searchWords) {
                    if (issue.title.toLowerCase().includes(word)) {
                        matchingIssues.push(issue);
                        found = true;
                        break;
                    }

                    for (const reason of issue.reasons) {
                        if (reason.toLowerCase().includes(word)) {
                            matchingIssues.push(issue);
                            found = true;
                            break;
                        }
                    }
                    if (found) break;

                    for (const solution of issue.solutions) {
                        if (solution.toLowerCase().includes(word)) {
                            matchingIssues.push(issue);
                            found = true;
                            break;
                        }
                    }
                    if (found) break;
                }
            });

            // Display results
            displaySearchResults(matchingIssues);
        }

        function displaySearchResults(issues) {
            issuesContainer.innerHTML = "";

            if (issues.length === 0) {
                issuesContainer.innerHTML = "<p>No matching issues found.</p>";
                return;
            }

            issues.forEach(issue => {
                const issueDiv = document.createElement("div");
                issueDiv.classList.add("issue-card");

                // Create table rows for each reason and solution
                let tableRows = "";
                const maxLength = Math.max(issue.reasons.length, issue.solutions.length);

                for (let i = 0; i < maxLength; i++) {
                    const reason = issue.reasons[i] ? issue.reasons[i] : "";
                    const solution = issue.solutions[i] ? issue.solutions[i] : "";

                    tableRows += `
            <tr>
              <td>${reason}</td>
              <td>${solution}</td>
            </tr>
          `;
                }

                issueDiv.innerHTML = `
          <h4 class="issue-title">${issue.title}</h4>
          <table class="issue-table">
            <thead>
              <tr>
                <th>Reasons</th>
                <th>Solutions</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        `;

                issuesContainer.appendChild(issueDiv);
            });
        }
    } else {
        console.warn("Plant not found in database:", plantName);
    }
});
