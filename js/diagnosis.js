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

    const issuesContainer = document.getElementById("issuesContainer");
    issuesContainer.innerHTML = "";
    plantData.issues.forEach((issue) => {
      const issueDiv = document.createElement("div");
      issueDiv.classList.add("issue-card");

      // Create table rows for each reason and solution
      let tableRows = "";
      const maxLength = Math.max(issue.reasons.length, issue.solutions.length);

      for (let i = 0; i < maxLength; i++) {
        const reason = issue.reasons[i] ? issue.reasons[i] : ""; // Avoid undefined values
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
  } else {
    console.warn("Plant not found in database:", plantName);
  }
});
