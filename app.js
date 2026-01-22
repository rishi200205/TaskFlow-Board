// app.js

// DOM Elements
const taskForm = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const descInput = document.getElementById("task-description");

const todoList = document.getElementById("todo-list");
const inProgressList = document.getElementById("in-progress-list");
const doneList = document.getElementById("done-list");

// ---------- Rendering ----------

function renderTasks() {
    // Clear existing UI
    todoList.innerHTML = "";
    inProgressList.innerHTML = "";
    doneList.innerHTML = "";

    const tasks = getTasks();

    tasks.forEach(task => {
        const taskEl = createTaskElement(task);

        if (task.status === "todo") {
            todoList.appendChild(taskEl);
        } else if (task.status === "in-progress") {
            inProgressList.appendChild(taskEl);
        } else if (task.status === "done") {
            doneList.appendChild(taskEl);
        }
    });
}

function createTaskElement(task) {
    const div = document.createElement("div");
    div.className = "task";
    div.dataset.id = task.id;

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

// ---------- Events ----------

// Add Task
taskForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const title = titleInput.value;
    const description = descInput.value;

    if (!title.trim()) return;

    addTask(title, description);
    saveTasksToStorage(getTasks());

    titleInput.value = "";
    descInput.value = "";

    renderTasks();
});

// Event Delegation for Task Actions
document.querySelector(".board").addEventListener("click", function (e) {
    const action = e.target.dataset.action;
    if (!action) return;

    const taskEl = e.target.closest(".task");
    if (!taskEl) return;

    const taskId = taskEl.dataset.id;

    if (action === "delete") {
        deleteTask(taskId);
    }

    if (action === "move") {
        const task = getTasks().find(t => t.id === taskId);
        if (!task) return;

        if (task.status === "todo") {
            updateTaskStatus(taskId, "in-progress");
        } else if (task.status === "in-progress") {
            updateTaskStatus(taskId, "done");
        }
    }

    saveTasksToStorage(getTasks());
    renderTasks();
});

// ---------- Initial Load ----------

function init() {
    const storedTasks = loadTasksFromStorage();
    setTasks(storedTasks);
    renderTasks();
}

init();
