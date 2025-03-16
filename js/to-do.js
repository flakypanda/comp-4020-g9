document.addEventListener("DOMContentLoaded", function () {
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

const addButton = document.getElementById("addButton");
const upcomingContainer = document.getElementById("upcoming");


let selectedDate = localStorage.getItem("selectedDate") || new Date().toISOString().split("T")[0];

//add a new task
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

    let edit = document.createElement("button");
    li.appendChild(edit);

    listContainer.appendChild(li);
    saveData();
    inputBox.value = "";
}

addButton.addEventListener("click", function (e) {
    addTask();
}, false);

//complete, edit, or delete today's task 
listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveData();
    } else if (e.target.tagName === "BUTTON") {
        let li = e.target.parentElement;
        let currentText = li.childNodes[0].nodeValue.trim();

        if(e.target.classList.value === "editBtn") {
            // Save changes
            let input = li.querySelector(".edit-input");
            if (input) {
                let updatedText = input.value.trim();
                li.childNodes[0].nodeValue = updatedText + " ";
                input.remove();
            }
            saveData();
        } else {
            // Convert to input field
            let input = document.createElement("input");
            input.type = "text";
            input.value = currentText;
            input.classList.add("edit-input");

            li.childNodes[0].nodeValue = ""; // Clear text
            li.insertBefore(input, e.target);
            input.focus();
        }
        e.target.classList.toggle("editBtn");
    }
}, false);

//delete or edit tomorrow's task
upcomingContainer.addEventListener("click", function (e) {
     if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveData();
    } else if (e.target.tagName === "BUTTON") {
        let li = e.target.parentElement;
        let currentText = li.childNodes[0].nodeValue.trim();

        if(e.target.classList.value === "editBtn") {
            // Save changes
            let input = li.querySelector(".edit-input");
            if (input) {
                let updatedText = input.value.trim();
                li.childNodes[0].nodeValue = updatedText + " ";
                input.remove();
            }
            saveData();
        } else {
            // Convert to input field
            let input = document.createElement("input");
            input.type = "text";
            input.value = currentText;
            input.classList.add("edit-input");

            li.childNodes[0].nodeValue = ""; // Clear text
            li.insertBefore(input, e.target);
            input.focus();
        }
        e.target.classList.toggle("editBtn");
    }
}, false);

document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addTask();
    }
});

//check if all tasks are completed
function allChecked() {
    const listTasks = listContainer.querySelectorAll("li");
    return listTasks.length > 0 && Array.from(listTasks).every(li => li.classList.contains("checked"));
}

//save the Data to local storage
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

//show today's tasks
function showTask() {
    let tasksByDate = JSON.parse(localStorage.getItem("tasksByDate")) || {};
    listContainer.innerHTML = tasksByDate[selectedDate] || "";
}

//show tomorrow's tasks
function showUpcoming() {
    let tasksByDate = JSON.parse(localStorage.getItem("tasksByDate")) || {};
    let newDate = new Date(selectedDate);
    if(newDate != null ){
        let tmr = newDate.getDate()+ 1;

        newDate = new Date(newDate.setDate(tmr));
    }
    upcomingContainer.innerHTML = tasksByDate[newDate.toISOString().split("T")[0]] || "Nothing planned for tomorrow";
}

window.addEventListener("dateChanged", function () {
    selectedDate = localStorage.getItem("selectedDate");
    showTask();
    showUpcoming();
});

showTask();
showUpcoming();

});
