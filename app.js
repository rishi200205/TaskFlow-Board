// app.js

const taskForm = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const descInput = document.getElementById("task-description");
const searchInput = document.getElementById("search-input");

const todoList = document.getElementById("todo-list");
const inProgressList = document.getElementById("in-progress-list");
const doneList = document.getElementById("done-list");

let draggedTaskId = null;

/* =========================================================
   TASK SUMMARY
   ========================================================= */
function updateTaskSummary(tasks) {
    const todoCount = tasks.filter(t => t.status === "todo").length;
    const progressCount = tasks.filter(t => t.status === "in-progress").length;
    const doneCount = tasks.filter(t => t.status === "done").length;

    document.querySelector('[data-status="todo"] h2').textContent =
        `Todo (${todoCount})`;

    document.querySelector('[data-status="in-progress"] h2').textContent =
        `In Progress (${progressCount})`;

    document.querySelector('[data-status="done"] h2').textContent =
        `Done (${doneCount})`;

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
   RENDERING (WITH SEARCH FILTER)
   ========================================================= */
function renderTasks() {
    todoList.innerHTML = "";
    inProgressList.innerHTML = "";
    doneList.innerHTML = "";

    const query = searchInput.value.toLowerCase();
    const allTasks = getTasks();

    const filteredTasks = allTasks.filter(task =>
        task.title.toLowerCase().includes(query)
    );

    const todoTasks = filteredTasks.filter(t => t.status === "todo");
    const progressTasks = filteredTasks.filter(t => t.status === "in-progress");
    const doneTasks = filteredTasks.filter(t => t.status === "done");

    if (todoTasks.length === 0) {
        renderEmptyState(todoList, "No matching tasks");
    } else {
        todoTasks.forEach(task => todoList.appendChild(createTaskElement(task)));
    }

    if (progressTasks.length === 0) {
        renderEmptyState(inProgressList, "No matching tasks");
    } else {
        progressTasks.forEach(task =>
            inProgressList.appendChild(createTaskElement(task))
        );
    }

    if (doneTasks.length === 0) {
        renderEmptyState(doneList, "No matching tasks");
    } else {
        doneTasks.forEach(task => doneList.appendChild(createTaskElement(task)));
    }

    updateTaskSummary(filteredTasks);
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
   SEARCH
   ========================================================= */
searchInput.addEventListener("input", renderTasks);

/* =========================================================
   CLICK ACTIONS
   ========================================================= */
document.querySelector(".board").addEventListener("click", e => {
    const action = e.target.dataset.action;
    if (!action) return;

    const taskEl = e.target.closest(".task");
    const taskId = taskEl.dataset.id;

    if (action === "delete") {
        deleteTask(taskId);
        saveTasksToStorage(getTasks());
        renderTasks();
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
});

document.addEventListener("dragend", () => {
    draggedTaskId = null;
});

document.querySelectorAll(".column").forEach(column => {
    column.addEventListener("dragover", e => e.preventDefault());
    column.addEventListener("drop", e => {
        e.preventDefault();
        if (!draggedTaskId) return;

        updateTaskStatus(draggedTaskId, column.dataset.status);
        saveTasksToStorage(getTasks());
        renderTasks();
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
