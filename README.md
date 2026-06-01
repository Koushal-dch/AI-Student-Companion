# AI Student Companion

AI Student Companion is a modern AI-powered productivity web app designed for students. It helps users manage tasks, notes, study plans, focus sessions, and AI-powered study assistance in one dashboard.

## Features

- User signup and login
- User-specific saved data
- Dashboard with productivity stats
- Task manager
- Notes section
- Study planner
- AI timetable generator
- AI chat assistant
- Focus timer
- Profile page
- Settings page
- Dark/light mode
- Modern Gen Z-inspired UI
- LocalStorage persistence
- Backend AI integration using OpenRouter

## Tech Stack

### Frontend
- HTML
- CSS
- JavaScript
- Vite

### Backend
- Node.js
- Express.js

### AI
- OpenRouter API

### Storage
- LocalStorage

## How It Works

The frontend is built using Vite and JavaScript. It handles the user interface, page navigation, task management, notes, planner, timer, profile, and settings.

The backend is built with Node.js and Express. It connects to OpenRouter and sends user messages to the AI model. The AI response is returned to the frontend and displayed inside the chat interface.

User data is stored locally in the browser using LocalStorage. Each user has separate tasks, notes, planner items, streaks, and settings.

## Project Structure

```text
AI-Student-Companion
├── backend
│   ├── server.js
│   ├── .env
│   └── package.json
│
└── frontend-v2
    ├── src
    │   ├── main.js
    │   ├── auth.js
    │   └── style.css
    └── package.json