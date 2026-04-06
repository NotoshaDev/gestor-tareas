const STORAGE_KEY = "gestor_tareas_tasks";

function fallbackValidateMissionName(title) {
  if (!title || !title.trim()) {
    return "El nombre de la mision es obligatorio.";
  }
  return "";
}

function fallbackIsMissionOverdue(task, now = new Date()) {
  if (task.status === "done" || !task.dueDate) {
    return false;
  }

  const [year, month, day] = task.dueDate.split("-").map(Number);
  const dueDate = new Date(year, month - 1, day);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return dueDate < today;
}

const taskRules = window.TaskRules || {
  validateMissionName: fallbackValidateMissionName,
  isMissionOverdue: fallbackIsMissionOverdue
};
const missionNameValidator =
  typeof taskRules.validateMissionName === "function"
    ? taskRules.validateMissionName
    : fallbackValidateMissionName;
const missionOverdueChecker =
  typeof taskRules.isMissionOverdue === "function"
    ? taskRules.isMissionOverdue
    : fallbackIsMissionOverdue;

const form = document.getElementById("task-form");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const prioritySelect = document.getElementById("priority");
const dueDateInput = document.getElementById("due-date");
const addMissionButton =
  document.getElementById("add-mission-button") || document.querySelector("#task-form .primary-button");
const formError = document.getElementById("form-error");
const taskList = document.getElementById("task-list");
const filterGroup = document.getElementById("filter-group");
const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-select");
const statTotal = document.getElementById("stat-total");
const statPending = document.getElementById("stat-pending");
const statDone = document.getElementById("stat-done");
const statOverdue = document.getElementById("stat-overdue");

const requiredElementsReady =
  form &&
  titleInput &&
  descriptionInput &&
  prioritySelect &&
  dueDateInput &&
  addMissionButton &&
  formError &&
  taskList &&
  filterGroup &&
  searchInput &&
  sortSelect &&
  statTotal &&
  statPending &&
  statDone &&
  statOverdue;

if (!requiredElementsReady) {
  console.error("No se pudo inicializar la app: faltan elementos del DOM.");
}

const priorityLabelMap = {
  low: "Rutinaria",
  medium: "Importante",
  high: "Urgente"
};

const priorityWeightMap = {
  low: 1,
  medium: 2,
  high: 3
};

const uiState = {
  filter: "all",
  query: "",
  sort: "newest"
};

let tasks = loadTasks();

function normalizeTask(rawTask) {
  if (!rawTask || typeof rawTask !== "object") {
    return null;
  }

  const title = String(rawTask.title || "").trim();
  if (!title) {
    return null;
  }

  const priority = ["low", "medium", "high"].includes(rawTask.priority)
    ? rawTask.priority
    : "medium";

  const status = rawTask.status === "done" ? "done" : "pending";
  const description = String(rawTask.description || "").trim();
  const dueDate = typeof rawTask.dueDate === "string" ? rawTask.dueDate : "";
  const createdAt = rawTask.createdAt || new Date().toISOString();

  return {
    id: Number(rawTask.id) || Date.now() + Math.floor(Math.random() * 1000),
    title,
    description,
    priority,
    dueDate,
    status,
    createdAt
  };
}

function loadTasks() {
  try {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    if (!storedTasks) {
      return [
        {
          id: Date.now(),
          title: "Preparar briefing del gimnasio",
          description: "Organizar pendientes del equipo para iniciar la jornada",
          priority: "medium",
          dueDate: "",
          status: "pending",
          createdAt: new Date().toISOString()
        }
      ];
    }

    const parsed = JSON.parse(storedTasks);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map(normalizeTask).filter(Boolean);
  } catch (error) {
    return [];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    return true;
  } catch (error) {
    return false;
  }
}

function isTaskOverdue(task) {
  return missionOverdueChecker(task);
}

function validateFormData(taskData) {
  return missionNameValidator(taskData.title);
}

function createTask(taskData) {
  tasks.unshift({
    id: Date.now(),
    title: taskData.title,
    description: taskData.description,
    priority: taskData.priority,
    dueDate: taskData.dueDate,
    status: "pending",
    createdAt: new Date().toISOString()
  });
  return saveTasks();
}

function ensureTaskIntegrity() {
  const validTasks = tasks.map(normalizeTask).filter(Boolean);
  if (validTasks.length !== tasks.length) {
    tasks = validTasks;
    saveTasks();
  }
}

function toggleTaskStatus(taskId) {
  const task = tasks.find((currentTask) => currentTask.id === taskId);
  if (!task) {
    return;
  }

  task.status = task.status === "done" ? "pending" : "done";
  saveTasks();
}

function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks();
}

function formatDueDate(rawDate) {
  if (!rawDate) {
    return "Sin limite";
  }

  const [year, month, day] = rawDate.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function createBadge(className, text) {
  const badge = document.createElement("span");
  badge.className = `badge ${className}`;
  badge.textContent = text;
  return badge;
}

function createTaskItem(task) {
  const item = document.createElement("li");
  item.className = "task-item";
  if (task.status === "done") {
    item.classList.add("task-item-done");
  }
  if (isTaskOverdue(task)) {
    item.classList.add("task-item-overdue");
  }

  const top = document.createElement("div");
  top.className = "task-top";

  const title = document.createElement("h3");
  title.className = "task-title";
  title.textContent = task.title;

  const meta = document.createElement("div");
  meta.className = "task-meta";
  meta.appendChild(
    createBadge(
      task.status === "done" ? "badge-status-done" : "badge-status-pending",
      task.status === "done" ? "Mision completada" : "Mision pendiente"
    )
  );
  meta.appendChild(createBadge(`badge-priority-${task.priority}`, `${priorityLabelMap[task.priority]}`));
  if (isTaskOverdue(task)) {
    meta.appendChild(createBadge("badge-priority-high", "Fuera de tiempo"));
  }

  const dueDate = document.createElement("span");
  dueDate.className = "badge";
  dueDate.textContent = formatDueDate(task.dueDate);
  meta.appendChild(dueDate);

  top.appendChild(title);
  top.appendChild(meta);

  const description = document.createElement("p");
  description.className = "task-desc";
  description.textContent = task.description || "Sin descripcion";

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const toggleButton = document.createElement("button");
  toggleButton.type = "button";
  toggleButton.className = "ghost-button";
  toggleButton.textContent = task.status === "done" ? "Reactivar" : "Completar";
  toggleButton.addEventListener("click", () => {
    toggleTaskStatus(task.id);
    render();
  });

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "danger-button";
  deleteButton.textContent = "Descartar";
  deleteButton.addEventListener("click", () => {
    deleteTask(task.id);
    render();
  });

  actions.appendChild(toggleButton);
  actions.appendChild(deleteButton);

  item.appendChild(top);
  item.appendChild(description);
  item.appendChild(actions);
  return item;
}

function createEmptyStateItem(message) {
  const emptyItem = document.createElement("li");
  emptyItem.className = "empty-state";
  emptyItem.textContent = message;
  return emptyItem;
}

function sortTasks(taskListToSort) {
  const listCopy = [...taskListToSort];

  if (uiState.sort === "oldest") {
    return listCopy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  }

  if (uiState.sort === "priority") {
    return listCopy.sort((a, b) => priorityWeightMap[b.priority] - priorityWeightMap[a.priority]);
  }

  if (uiState.sort === "dueDate") {
    return listCopy.sort((a, b) => {
      if (!a.dueDate) {
        return 1;
      }
      if (!b.dueDate) {
        return -1;
      }
      return new Date(a.dueDate) - new Date(b.dueDate);
    });
  }

  return listCopy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getVisibleTasks() {
  const normalizedQuery = uiState.query.toLowerCase();
  const searched = tasks.filter((task) => {
    const joinedContent = `${task.title} ${task.description}`.toLowerCase();
    return joinedContent.includes(normalizedQuery);
  });

  const filtered = searched.filter((task) => {
    if (uiState.filter === "pending") {
      return task.status === "pending";
    }
    if (uiState.filter === "done") {
      return task.status === "done";
    }
    if (uiState.filter === "overdue") {
      return isTaskOverdue(task);
    }
    return true;
  });

  return sortTasks(filtered);
}

function renderFilters() {
  const filterButtons = filterGroup.querySelectorAll(".filter-chip");
  filterButtons.forEach((button) => {
    const isCurrent = button.dataset.filter === uiState.filter;
    button.classList.toggle("is-active", isCurrent);
  });
}

function renderStats() {
  const pendingCount = tasks.filter((task) => task.status === "pending").length;
  const doneCount = tasks.filter((task) => task.status === "done").length;
  const overdueCount = tasks.filter((task) => isTaskOverdue(task)).length;

  statTotal.textContent = String(tasks.length);
  statPending.textContent = String(pendingCount);
  statDone.textContent = String(doneCount);
  statOverdue.textContent = String(overdueCount);
}

function renderTaskList() {
  taskList.innerHTML = "";
  const visibleTasks = getVisibleTasks();
  if (visibleTasks.length === 0) {
    taskList.appendChild(createEmptyStateItem("No hay misiones que coincidan con el filtro actual."));
    return;
  }

  visibleTasks.forEach((task) => {
    taskList.appendChild(createTaskItem(task));
  });
}

function render() {
  ensureTaskIntegrity();
  renderStats();
  renderFilters();
  renderTaskList();
}

function handleFormSubmit(event) {
  if (event && typeof event.preventDefault === "function") {
    event.preventDefault();
  }

  try {
    const taskData = {
      title: titleInput.value.trim(),
      description: descriptionInput.value.trim(),
      priority: prioritySelect.value,
      dueDate: dueDateInput.value
    };

    const validationError = validateFormData(taskData);
    formError.textContent = validationError;
    if (validationError) {
      return;
    }

    const saved = createTask(taskData);
    if (!saved) {
      formError.textContent = "No se pudo guardar en el navegador, pero la mision se agrego en memoria.";
    } else {
      formError.textContent = "Mision registrada correctamente.";
    }

    // Evita que una mision nueva quede oculta por filtros o busquedas activas.
    uiState.filter = "all";
    uiState.query = "";
    searchInput.value = "";
    uiState.sort = "newest";
    sortSelect.value = "newest";

    form.reset();
    prioritySelect.value = "medium";
    if (formError.textContent.startsWith("No se pudo")) {
      setTimeout(() => {
        formError.textContent = "";
      }, 2600);
    } else {
      setTimeout(() => {
        formError.textContent = "";
      }, 1600);
    }
    render();
  } catch (error) {
    formError.textContent = "Ocurrio un error al registrar la mision.";
    console.error(error);
  }
}

function handleFilterClick(event) {
  const filterButton = event.target.closest(".filter-chip");
  if (!filterButton) {
    return;
  }

  uiState.filter = filterButton.dataset.filter;
  render();
}

function handleSearchInput(event) {
  uiState.query = event.target.value.trim();
  render();
}

function handleSortChange(event) {
  uiState.sort = event.target.value;
  render();
}

if (requiredElementsReady) {
  form.addEventListener("submit", handleFormSubmit);
  addMissionButton.addEventListener("click", handleFormSubmit);
  filterGroup.addEventListener("click", handleFilterClick);
  searchInput.addEventListener("input", handleSearchInput);
  sortSelect.addEventListener("change", handleSortChange);

  render();
}
