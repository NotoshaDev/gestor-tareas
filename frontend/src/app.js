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

function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    const empty = document.createElement("li");
    empty.textContent = "No hay tareas registradas.";
    taskList.appendChild(empty);
    return;
  }

  tasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = "task-item";

    const title = document.createElement("h3");
    title.textContent = task.title;

    const description = document.createElement("p");
    description.textContent = task.description || "Sin descripcion";

    item.appendChild(title);
    item.appendChild(description);
    taskList.appendChild(item);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();

  if (!title) {
    return;
  }

  tasks.unshift({
    id: Date.now(),
    title,
    description
  });

  form.reset();
  renderTasks();
});

renderTasks();
