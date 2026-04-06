const form = document.getElementById("task-form");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const taskList = document.getElementById("task-list");

const tasks = [
  {
    id: 1,
    title: "Configurar estructura inicial",
    description: "Crear base del proyecto para backend, frontend y BD"
  }
];

function createTaskItem(task) {
  const item = document.createElement("li");
  item.className = "task-item";

  const taskTitle = document.createElement("h3");
  taskTitle.textContent = task.title;

  const taskDescription = document.createElement("p");
  taskDescription.textContent = task.description || "Sin descripcion";

  item.appendChild(taskTitle);
  item.appendChild(taskDescription);

  return item;
}

function createEmptyStateItem() {
  const emptyItem = document.createElement("li");
  emptyItem.textContent = "No hay tareas registradas.";
  return emptyItem;
}

function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    taskList.appendChild(createEmptyStateItem());
    return;
  }

  tasks.forEach((task) => {
    taskList.appendChild(createTaskItem(task));
  });
}

function addTask(title, description) {
  tasks.unshift({
    id: Date.now(),
    title,
    description
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!title) {
    return;
  }

  addTask(title, description);

  form.reset();
  renderTasks();
});

renderTasks();
