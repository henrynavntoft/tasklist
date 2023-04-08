"use strict";

// Force FontAwesome icons to load
window.FontAwesomeConfig = {
  autoReplaceSvg: "nest",
};

const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("taskInput");
let selectedCategory = "";

// load tasks from local storage
function loadTasks() {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  taskList.innerHTML = "";
  tasks.forEach((task) => createTask(task.text, task.category, task.done));
}

// save tasks to local storage
function saveTasks() {
  const tasks = Array.from(document.querySelectorAll("#taskList li")).map(
    (li) => {
      return {
        text: li.querySelector("span").textContent,
        category: li.getAttribute("data-category"),
        done: li.querySelector(".check-container input").checked,
      };
    }
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateCategoryCount() {
  const categoryCounts = {};
  const tasks = Array.from(document.querySelectorAll("#taskList li"));
  tasks.forEach((task) => {
    const category = task.getAttribute("data-category");
    if (category) {
      categoryCounts[category] = categoryCounts[category] + 1 || 1;
    }
  });

  const categoryElements = document.querySelectorAll("#categoryList li");
  categoryElements.forEach((category) => {
    const categoryName = category.getAttribute("data-category");
    const count = categoryCounts[categoryName] || 0;
    category.querySelector(".category-count").textContent = count;
  });
}

function createTask(text, category, done = false) {
  const taskLabel = document.createElement("span");
  taskLabel.textContent = text;
  if (done) {
    taskLabel.classList.add("done");
  }

  const deleteBtn = document.createElement("button");
  deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
  deleteBtn.className = "delete-btn";

  const checkContainer = document.createElement("div");
  checkContainer.className = "check-container";

  const taskDetails = document.createElement("div");
  taskDetails.className = "task-details";
  taskDetails.appendChild(checkContainer);
  taskDetails.appendChild(taskLabel);

  const newTask = document.createElement("li");
  newTask.setAttribute("data-category", category);
  newTask.appendChild(taskDetails);
  newTask.appendChild(deleteBtn);

  taskLabel.addEventListener("click", function () {
    taskLabel.classList.toggle("done");
    checkContainer.classList.toggle("checked");
    saveTasks();
    updateCategoryCount();
  });

  checkContainer.addEventListener("click", function () {
    taskLabel.classList.toggle("done");
    checkContainer.classList.toggle("checked");
    saveTasks();
    updateCategoryCount();
  });

  deleteBtn.addEventListener("click", function () {
    taskList.removeChild(newTask);
    saveTasks();
    updateCategoryCount();
  });

  taskList.appendChild(newTask);
}

// add a new task item to the task list
document.getElementById("addTaskButton").addEventListener("click", function () {
  const taskText = taskInput.value.trim();

  if (taskText === "") return;

  createTask(taskText, selectedCategory);

  taskInput.value = "";
  taskInput.focus();

  saveTasks();
});

taskInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    document.getElementById("addTaskButton").click();
  }
});

// toggle dark mode
const darkModeToggle = document.getElementById("darkModeToggle");
darkModeToggle.addEventListener("change", function () {
  document.body.classList.toggle("dark-mode");
});

// load tasks on page load
loadTasks();
