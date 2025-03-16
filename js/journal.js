document.addEventListener("DOMContentLoaded", function () {
  const plantCards = document.querySelectorAll(".plant-card");

  plantCards.forEach((card) => {
    card.addEventListener("click", function () {
      const plantName = this.getAttribute("data-plant");
      window.location.href = `entries.html?plant=${encodeURIComponent(
        plantName
      )}`;
    });
  });
});
