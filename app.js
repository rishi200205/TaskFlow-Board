// app.js

const taskForm = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const descInput = document.getElementById("task-description");
const searchInput = document.getElementById("search-input");
const clearBtn = document.getElementById("clear-board-btn");

const todoList = document.getElementById("todo-list");
const inProgressList = document.getElementById("in-progress-list");
const doneList = document.getElementById("done-list");

let draggedTaskId = null;

/* =========================================================
   UTIL — TIME FORMATTER
   ========================================================= */
function formatTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
}

/* =========================================================
   TASK SUMMARY
   ========================================================= */
function updateTaskSummary(tasks) {
    document.querySelector('[data-status="todo"] h2').textContent =
        `Todo (${tasks.filter(t => t.status === "todo").length})`;

    document.querySelector('[data-status="in-progress"] h2').textContent =
        `In Progress (${tasks.filter(t => t.status === "in-progress").length})`;

    document.querySelector('[data-status="done"] h2').textContent =
        `Done (${tasks.filter(t => t.status === "done").length})`;

    document.getElementById("task-summary").textContent =
        `Total Tasks: ${tasks.length}`;
}

/* =========================================================
   EMPTY STATE
   ========================================================= */
function renderEmptyState(container, message) {
    const div = document.createElement("div");
    div.className = "empty-state";
    div.textContent = message;
    container.appendChild(div);
}

/* =========================================================
   RENDERING
   ========================================================= */
function renderTasks() {
    todoList.innerHTML = "";
    inProgressList.innerHTML = "";
    doneList.innerHTML = "";

    const query = searchInput.value.toLowerCase();
    const tasks = getTasks().filter(t =>
        t.title.toLowerCase().includes(query)
    );

    const buckets = { todo: [], "in-progress": [], done: [] };
    tasks.forEach(t => buckets[t.status].push(t));

    Object.entries(buckets).forEach(([status, list]) => {
        const container =
            status === "todo" ? todoList :
                status === "in-progress" ? inProgressList :
                    doneList;

        if (list.length === 0) {
            renderEmptyState(container, "No tasks here");
        } else {
            list.forEach(task => container.appendChild(createTaskElement(task)));
        }
    });

    updateTaskSummary(tasks);
}

function createTaskElement(task) {
    const div = document.createElement("div");
    div.className = "task";
    div.dataset.id = task.id;
    div.draggable = true;

    div.innerHTML = `
    <h3>${task.title}</h3>
    <p>${task.description}</p>
    <small class="timestamp">Created ${formatTimeAgo(task.createdAt)}</small>
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

/* SEARCH */
searchInput.addEventListener("input", renderTasks);

/* =========================================================
   CLEAR BOARD (DESTRUCTIVE)
   ========================================================= */
clearBtn.addEventListener("click", () => {
    const confirmed = confirm(
        "This will permanently delete all tasks. Are you sure?"
    );

    if (!confirmed) return;

    setTasks([]);
    saveTasksToStorage([]);
    renderTasks();
});

/* =========================================================
   ACTIONS
   ========================================================= */
document.querySelector(".board").addEventListener("click", e => {
    const action = e.target.dataset.action;
    if (!action) return;

    const taskId = e.target.closest(".task").dataset.id;

    if (action === "delete") {
        deleteTask(taskId);
        saveTasksToStorage(getTasks());
        renderTasks();
        return;
    }

    if (action === "move") {
        const task = getTasks().find(t => t.id === taskId);
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

/* INIT */
function init() {
    setTasks(loadTasksFromStorage());
    renderTasks();
}

init();
