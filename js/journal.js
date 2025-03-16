function add() {
  let plant = prompt("Enter journal entry then upload image:");
  let img = showOpenFilePicker();
  if(plant == null || person == "") {
    plant = "";
  }
  document.getElementById("name").innerHTML = text;
}

function openCard() {
  document.getElementById("myCard").style.display = "block";
}

function closeCard() {
  document.getElementById("myCard").style.display = "none";
}

function openGallery() {
  document.getElementById("myGallery").style.display = "block";
}

function closeGallery() {
  document.getElementById("myGallery").style.display = "none";
}