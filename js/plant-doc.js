document.addEventListener("DOMContentLoaded", function () {
  const myPlantsTab = document.getElementById("myPlantsTab");
  const pastDiagnosisTab = document.getElementById("pastDiagnosisTab");

  const myPlantsSection = document.getElementById("myPlantsSection");
  const pastDiagnosisSection = document.getElementById("pastDiagnosisSection");

  // Function to switch tabs
  function switchTab(activeTab, inactiveTab, showSection, hideSection) {
    activeTab.classList.add("active");
    inactiveTab.classList.remove("active");
    showSection.style.display = "grid"; // or "flex" if needed
    hideSection.style.display = "none";
  }

  // Click event for "My Plants" tab
  myPlantsTab.addEventListener("click", function () {
    switchTab(
      myPlantsTab,
      pastDiagnosisTab,
      myPlantsSection,
      pastDiagnosisSection
    );
  });

  // Click event for "Past Diagnosis" tab
  pastDiagnosisTab.addEventListener("click", function () {
    switchTab(
      pastDiagnosisTab,
      myPlantsTab,
      pastDiagnosisSection,
      myPlantsSection
    );
  });
});
