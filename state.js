// state.js

let tasks = [];

// Get all tasks
function getTasks() {
    return tasks;
}

// Add a new task
function addTask(title, description = "") {
    const newTask = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        status: "todo",
        createdAt: Date.now()
    };

    tasks.push(newTask);
    return newTask;
}

// Update task status
function updateTaskStatus(taskId, newStatus) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return null;

    task.status = newStatus;
    return task;
}

// Delete a task
function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
}

// Replace entire state (used for loading from storage)
function setTasks(newTasks) {
    tasks = newTasks;
}
