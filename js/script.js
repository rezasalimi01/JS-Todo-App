const taskInput = document.getElementById("task-input");
const dateInput = document.getElementById("date-input");
const addButton = document.getElementById("add-button");
const alertMessage = document.getElementById("alert-message");

const todos = [];

const showAlert = (message, type) => {
  alertMessage.innerHTML = "";
  const alert = document.createElement("p");
  alert.innerText = message;
  alert.classList.add("alert");
  alert.classList.add(`alert-${type}`);
  alertMessage.append(alert);

  setTimeout(() => {
    alert.style.display = "none"
  }, 2000)
};

const addHandler = () => {
  const task = taskInput.value;
  const date = dateInput.value;

  const todo = {
    task: task,
    date: date,
    completed: false,
  };

  if (task) {
    todos.push();
    taskInput.value = "";
    dateInput.value = "";
    showAlert("Todo added successfully ✅", "success");
  } else {
    showAlert("Please enter a todo ❗", "error");
  }
};

addButton.addEventListener("click", addHandler);
