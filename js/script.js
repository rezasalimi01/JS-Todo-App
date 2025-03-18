const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addButton = document.getElementById("add-button");
const editButton = document.getElementById("edit-button");
const alertMessage = document.getElementById("alert-message");
const todosBody = document.querySelector("tbody");
const deleteAllButton = document.getElementById("delete-all-button");
const filterButtons = document.querySelectorAll(".filter-todos");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
const saveToLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const generateId = () => {
  return Math.round(
    Math.random() * Math.random() * Math.pow(10, 15)
  ).toString();
};

const showAlert = (message, type) => {
  alertMessage.innerHTML = "";
  const alert = document.createElement("p");
  alert.innerText = message;
  alert.classList.add("alert");
  alert.classList.add(`alert-${type}`);
  alertMessage.append(alert);

  setTimeout(() => {
    alert.style.display = "none";
  }, 2000);
};

const displayTodos = (data) => {
  const todoList = data ? data : todos;
  todosBody.innerHTML = "";

  if (!todoList.length) {
    todosBody.innerHTML = `<tr><td colspan="4" style="text-align: center; padding: 20px;">No task found ❗</td></tr>`;
    return;
  }

  todoList.forEach((todo) => {
    const row = document.createElement("tr");

    const taskCell = document.createElement("td");
    taskCell.textContent = todo.task;
    taskCell.setAttribute("data-label", "Task");
    row.appendChild(taskCell);

    const dateCell = document.createElement("td");
    dateCell.textContent = `📅 ${todo.date ? todo.date : "No date"}`;
    dateCell.setAttribute("data-label", "Date");
    row.appendChild(dateCell);

    const statusCell = document.createElement("td");
    statusCell.textContent = todo.completed ? "Completed ✅" : "Pending ⏳";
    statusCell.setAttribute("data-label", "Status");
    row.appendChild(statusCell);

    const actionsCell = document.createElement("td");
    actionsCell.setAttribute("data-label", "Actions");

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.onclick = () => editHandler(todo.id);
    actionsCell.appendChild(editButton);

    const toggleButton = document.createElement("button");
    toggleButton.textContent = todo.completed ? "Undo" : "Do";
    toggleButton.onclick = () => toggleHandler(todo.id);
    actionsCell.appendChild(toggleButton);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = () => deleteHandler(todo.id);
    actionsCell.appendChild(deleteButton);

    row.appendChild(actionsCell);
    todosBody.appendChild(row);
  });
};

const addHandler = () => {
  const task = taskInput.value.trim();
  const date = dateInput.value;
  const today = new Date().toISOString().split("T")[0];

  if (!task) {
    showAlert("Please enter a todo ❗", "error");
    return;
  }

  if (date && date < today) {
    showAlert("Date cannot be in the past ❗", "error");
    return;
  }

  const todo = {
    id: generateId(),
    completed: false,
    task: task,
    date: date || "",
  };

  todos.push(todo);
  saveToLocalStorage();
  displayTodos();
  taskInput.value = "";
  dateInput.value = "";
  showAlert("Todo added successfully ✅", "success");
};


const deleteAllHandler = () => {
  if (todos.length) {
    todos = [];
    saveToLocalStorage();
    displayTodos();
    showAlert("All todos cleared successfully ✅", "success");
  } else {
    showAlert("No todos to clear ❗", "error");
  }
};

const deleteHandler = (id) => {
  const newTodos = todos.filter((todo) => todo.id !== id);
  todos = newTodos;
  saveToLocalStorage();
  displayTodos();
  showAlert("Todo deleted successfully ✅", "success");
};

const toggleHandler = (id) => {
  const todo = todos.find((todo) => todo.id === id);
  todo.completed = !todo.completed;
  saveToLocalStorage();
  displayTodos();
  showAlert("Todo status changed successfully ✅", "success");
};

const editHandler = (id) => {
  const todo = todos.find((todo) => todo.id === id);
  taskInput.value = todo.task;
  dateInput.value = todo.date;
  addButton.style.display = "none";
  editButton.style.display = "inline-block";
  editButton.dataset.id = id;
};

const applyEditHandler = (event) => {
  const id = event.target.dataset.id;
  const todo = todos.find((todo) => todo.id === id);
  
  const newTask = taskInput.value.trim();
  const newDate = dateInput.value;
  const today = new Date().toISOString().split("T")[0];

  if (!newTask) {
    showAlert("Please enter a todo ❗", "error");
    return;
  }

  if (newDate && newDate < today) {
    showAlert("Date cannot be in the past ❗", "error");
    return;
  }

  todo.task = newTask;
  todo.date = newDate || ""; 

  taskInput.value = "";
  dateInput.value = "";
  addButton.style.display = "inline-block";
  editButton.style.display = "none";

  saveToLocalStorage();
  displayTodos();
  showAlert("Todo edited successfully ✅", "success");
};

const filterHandler = (event) => {
  let filteredTodos = null;
  const filter = event.target.dataset.filter;

  switch (filter) {
    case "pending":
      filteredTodos = todos.filter((todo) => todo.completed === false);
      break;

    case "completed":
      filteredTodos = todos.filter((todo) => todo.completed === true);
      break;

    default:
      filteredTodos = todos;
      break;
  }
  displayTodos(filteredTodos);
};

document.addEventListener("DOMContentLoaded", function () {
  flatpickr("#date-input", {
    dateFormat: "Y-m-d",  
    allowInput: false,      
    minDate: "today",      
    disableMobile: true,    
    position: "auto centre",
  });
});


window.addEventListener("load", () => displayTodos());
addButton.addEventListener("click", addHandler);
deleteAllButton.addEventListener("click", deleteAllHandler);
editButton.addEventListener("click", applyEditHandler);
filterButtons.forEach((button) => {
  button.addEventListener("click", filterHandler);
});
