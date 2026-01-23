// state.js

let tasks = [];

function getTasks() {
    return tasks;
}

function setTasks(newTasks) {
    tasks = newTasks;
}

function addTask(title, description = "", priority = "medium") {
    const newTask = {
        id: Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        priority,
        status: "todo",
        createdAt: Date.now()
    };

    tasks.push(newTask);
    return newTask;
}

function updateTaskStatus(taskId, newStatus) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return null;
    task.status = newStatus;
    return task;
}

function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
}
