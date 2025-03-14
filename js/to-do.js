document.addEventListener("DOMContentLoaded", function () {
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

const addButton = document.getElementById("addButton");
const upcomingContainer = document.getElementById("upcoming");


let selectedDate = localStorage.getItem("selectedDate") || new Date().toISOString().split("T")[0];

function addTask() {
    if (inputBox.value.trim() === "") {
        alert("You must write something");
        return;
    }

    let li = document.createElement("li");
    li.innerHTML = inputBox.value;

    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);

    listContainer.appendChild(li);
    saveData();
    inputBox.value = "";
}

addButton.addEventListener("click", function (e) {
    addTask();
}, false);

listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveData();
    }
}, false);

document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});

function allChecked() {
    const listTasks = listContainer.querySelectorAll("li");
    return listTasks.length > 0 && Array.from(listTasks).every(li => li.classList.contains("checked"));
}

function saveData() {
    let tasksByDate = JSON.parse(localStorage.getItem("tasksByDate")) || {};
    tasksByDate[selectedDate] = listContainer.innerHTML;
    localStorage.setItem("tasksByDate", JSON.stringify(tasksByDate));

    let checkedDates = new Set(JSON.parse(localStorage.getItem("checkedDates")) || []);
    if (allChecked()) {
        checkedDates.add(selectedDate);
    } else {
        checkedDates.delete(selectedDate);
    }
    localStorage.setItem("checkedDates", JSON.stringify([...checkedDates]));

    // Notify calendar script that data changed
    window.dispatchEvent(new Event("tasksUpdated"));
}

function showTask() {
    let tasksByDate = JSON.parse(localStorage.getItem("tasksByDate")) || {};
    listContainer.innerHTML = tasksByDate[selectedDate] || "";
}

function showUpcoming() {
    let tasksByDate = JSON.parse(localStorage.getItem("tasksByDate")) || {};
    let newDate = new Date(selectedDate);
    if(newDate != null ){
        
        newDate = newDate + 2;

        //let tmrDate = new Date().setDate(tmr);

        console.log(newDate);
    }
    upcomingContainer.innerHTML = tasksByDate[newDate] || "";
}

window.addEventListener("dateChanged", function () {
    selectedDate = localStorage.getItem("selectedDate");
    showTask();
    showUpcoming();
});

showTask();
showUpcoming();

});
