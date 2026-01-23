📋 TaskFlow Board

TaskFlow Board is a modern, feature-complete Kanban-style task management application built using pure HTML, CSS, and JavaScript.

This project was intentionally developed without any frameworks to master core frontend fundamentals before transitioning to React.

🚀 Overview

TaskFlow Board allows users to manage tasks visually across different stages of progress:

Todo

In Progress

Done

The application focuses on clean architecture, state-driven UI, and real-world UX patterns, making it an ideal foundation for React migration.

✨ Features
🧩 Core Task Management

Add tasks with title and description

Move tasks between columns

Delete individual tasks

Clear all tasks with confirmation

🎯 Task Priority

Set priority during task creation:

Low

Medium

High

Priority shown as a visual badge

Priority persists after refresh

🔍 Search & Filter

Real-time task search by title

Filters tasks across all columns instantly

🕒 Timestamps & Metadata

Each task shows when it was created:

“Just now”

“5 min ago”

“2 days ago”

📊 Board Summary

Live task count per column

Total task count displayed in the header

🧱 Empty States

Helpful messages when columns are empty

Prevents blank or confusing UI

💾 Persistent Storage

Uses localStorage

Data remains after page refresh or browser restart

🖱️ Drag & Drop

Drag tasks between columns

State-driven (no direct DOM manipulation)

🎨 UI & UX

Clean and modern design system

Consistent color palette

Responsive layout for mobile

Clear visual hierarchy

🛠️ Tech Stack

HTML5 – semantic structure

CSS3 – design system and responsiveness

JavaScript (ES6+)

State management

Event delegation

DOM rendering

LocalStorage – persistence

Git & GitHub – version control

No libraries. No frameworks. Pure fundamentals.

🗂️ Project Structure
TaskFlow-Board/
│
├── index.html      # Application structure
├── style.css       # Complete design system
├── app.js          # UI logic & event handling
├── state.js        # Application state management
├── storage.js     # localStorage abstraction
└── README.md

🧠 Architecture Principles

Single source of truth (state.js)

UI always renders from state

No direct DOM manipulation for logic

Clear separation of concerns

This mirrors React’s mental model, making future migration straightforward.