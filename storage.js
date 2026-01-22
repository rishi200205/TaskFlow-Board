// storage.js

const STORAGE_KEY = "taskflow_tasks";

// Save tasks to localStorage
function saveTasksToStorage(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasksFromStorage() {
    const storedTasks = localStorage.getItem(STORAGE_KEY);
    if (!storedTasks) return [];
    return JSON.parse(storedTasks);
}
