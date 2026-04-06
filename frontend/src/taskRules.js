function validateMissionName(title) {
  if (!title || !title.trim()) {
    return "El nombre de la mision es obligatorio.";
  }

  return "";
}

function isMissionOverdue(task, now = new Date()) {
  if (task.status === "done" || !task.dueDate) {
    return false;
  }

  const [year, month, day] = task.dueDate.split("-").map(Number);
  const dueDate = new Date(year, month - 1, day);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return dueDate < today;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    validateMissionName,
    isMissionOverdue
  };
}

if (typeof window !== "undefined") {
  window.TaskRules = {
    validateMissionName,
    isMissionOverdue
  };
}
