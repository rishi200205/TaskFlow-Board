// app.js

const taskForm = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const descInput = document.getElementById("task-description");

const todoList = document.getElementById("todo-list");
const inProgressList = document.getElementById("in-progress-list");
const doneList = document.getElementById("done-list");

let draggedTaskId = null;

/* =========================================================
   RENDERING
   ========================================================= */
function renderTasks() {
    todoList.innerHTML = "";
    inProgressList.innerHTML = "";
    doneList.innerHTML = "";

    getTasks().forEach(task => {
        const el = createTaskElement(task);

        if (task.status === "todo") todoList.appendChild(el);
        if (task.status === "in-progress") inProgressList.appendChild(el);
        if (task.status === "done") doneList.appendChild(el);
    });
}

function createTaskElement(task) {
    const div = document.createElement("div");
    div.className = "task";
    div.dataset.id = task.id;
    div.draggable = true;

    div.innerHTML = `
    <h3>${task.title}</h3>
    <p>${task.description}</p>
    <div class="actions">
      <button data-action="move">Move</button>
      <button data-action="delete">Delete</button>
    </div>
  `;

    return div;
}

/* =========================================================
   ADD TASK
   ========================================================= */
taskForm.addEventListener("submit", e => {
    e.preventDefault();

    if (!titleInput.value.trim()) return;

    addTask(titleInput.value, descInput.value);
    saveTasksToStorage(getTasks());

    titleInput.value = "";
    descInput.value = "";

    renderTasks();
});

/* =========================================================
   CLICK ACTIONS (DELEGATION)
   ========================================================= */
document.querySelector(".board").addEventListener("click", e => {
    const action = e.target.dataset.action;
    if (!action) return;

    const taskEl = e.target.closest(".task");
    const taskId = taskEl.dataset.id;

    if (action === "delete") {
        taskEl.classList.add("removing");
        setTimeout(() => {
            deleteTask(taskId);
            saveTasksToStorage(getTasks());
            renderTasks();
        }, 250);
        return;
    }

    if (action === "move") {
        const task = getTasks().find(t => t.id === taskId);
        if (!task) return;

        const next =
            task.status === "todo"
                ? "in-progress"
                : task.status === "in-progress"
                    ? "done"
                    : "done";

        updateTaskStatus(taskId, next);
        saveTasksToStorage(getTasks());
        renderTasks();
    }
});

/* =========================================================
   DRAG & DROP
   ========================================================= */
document.addEventListener("dragstart", e => {
    const task = e.target.closest(".task");
    if (!task) return;
    draggedTaskId = task.dataset.id;
    task.classList.add("moving");
});

document.addEventListener("dragend", e => {
    const task = e.target.closest(".task");
    if (!task) return;
    task.classList.remove("moving");
});

document.querySelectorAll(".column").forEach(column => {
    column.addEventListener("dragover", e => e.preventDefault());

    column.addEventListener("drop", e => {
        e.preventDefault();
        if (!draggedTaskId) return;

        updateTaskStatus(draggedTaskId, column.dataset.status);
        saveTasksToStorage(getTasks());
        renderTasks();
        draggedTaskId = null;
    });
});

/* =========================================================
   INIT
   ========================================================= */
function init() {
    setTasks(loadTasksFromStorage());
    renderTasks();
}

init();
