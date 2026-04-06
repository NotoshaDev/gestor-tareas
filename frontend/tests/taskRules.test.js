const test = require("node:test");
const assert = require("node:assert/strict");

const { validateMissionName, isMissionOverdue } = require("../src/taskRules.js");

test("validateMissionName: retorna error cuando el nombre esta vacio", () => {
  const result = validateMissionName("");
  assert.equal(result, "El nombre de la mision es obligatorio.");
});

test("validateMissionName: acepta nombre corto siempre que no este vacio", () => {
  const result = validateMissionName("ok");
  assert.equal(result, "");
});

test("isMissionOverdue: detecta una mision pendiente fuera de tiempo", () => {
  const overdueTask = {
    status: "pending",
    dueDate: "2026-04-01"
  };

  const result = isMissionOverdue(overdueTask, new Date("2026-04-06T10:00:00"));
  assert.equal(result, true);
});

test("isMissionOverdue: no marca fuera de tiempo una mision completada", () => {
  const doneTask = {
    status: "done",
    dueDate: "2026-04-01"
  };

  const result = isMissionOverdue(doneTask, new Date("2026-04-06T10:00:00"));
  assert.equal(result, false);
});
