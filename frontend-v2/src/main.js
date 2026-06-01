import "./style.css";
import { renderAuthPage } from "./auth.js";

const API_URL = "http://localhost:4000/chat";

let isLoggedIn = localStorage.getItem("loggedIn") === "true";
let currentUser = JSON.parse(localStorage.getItem("currentUser"));

let currentPage = "dashboard";
let darkMode = JSON.parse(localStorage.getItem("darkMode")) || false;

let tasks = currentUser
  ? JSON.parse(localStorage.getItem(`tasks_${currentUser.username}`)) || []
  : [];

let notes = currentUser
  ? JSON.parse(localStorage.getItem(`notes_${currentUser.username}`)) || []
  : [];

let planner = currentUser
  ? JSON.parse(localStorage.getItem(`planner_${currentUser.username}`)) || []
  : [];

let aiPlan = currentUser
  ? localStorage.getItem(`aiPlan_${currentUser.username}`) || ""
  : "";

let streak = currentUser
  ? Number(localStorage.getItem(`streak_${currentUser.username}`)) || 0
  : 0;

function saveData() {
  if (currentUser) {
    localStorage.setItem(`tasks_${currentUser.username}`, JSON.stringify(tasks));
    localStorage.setItem(`notes_${currentUser.username}`, JSON.stringify(notes));
    localStorage.setItem(`planner_${currentUser.username}`, JSON.stringify(planner));
    localStorage.setItem(`aiPlan_${currentUser.username}`, aiPlan);
    localStorage.setItem(`streak_${currentUser.username}`, streak);
  }

  localStorage.setItem("darkMode", JSON.stringify(darkMode));
}

if (!isLoggedIn || !currentUser) {
  renderAuthPage(() => {
    isLoggedIn = true;
    currentUser = JSON.parse(localStorage.getItem("currentUser"));

    tasks = JSON.parse(localStorage.getItem(`tasks_${currentUser.username}`)) || [];
    notes = JSON.parse(localStorage.getItem(`notes_${currentUser.username}`)) || [];
    planner = JSON.parse(localStorage.getItem(`planner_${currentUser.username}`)) || [];
    aiPlan = localStorage.getItem(`aiPlan_${currentUser.username}`) || "";
    streak = Number(localStorage.getItem(`streak_${currentUser.username}`)) || 0;

    renderApp();
  });
} else {
  renderApp();
}

function renderApp() {
  const completed = tasks.filter(task => task.completed).length;
  const pending = tasks.length - completed;
  const productivity =
    tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);

  document.querySelector("#app").innerHTML = `
    <div class="app ${darkMode ? "light" : ""}">
      <aside class="sidebar">
        <h1>AI<span>Companion</span></h1>

        <button data-page="dashboard">📊 Dashboard</button>
        <button data-page="tasks">✅ Tasks</button>
        <button data-page="notes">📝 Notes</button>
        <button data-page="planner">📚 Planner</button>
        <button data-page="timer">⏳ Timer</button>
        <button data-page="ai">🤖 AI Chat</button>
        <button data-page="profile">👤 Profile</button>
        <button data-page="settings">⚙️ Settings</button>

        <button id="themeBtn">${darkMode ? "🌙 Dark" : "☀ Light"}</button>
        <button id="logoutBtn">Logout</button>
      </aside>

      <main class="main">
        ${currentPage === "dashboard" ? `
          <h2>Welcome, ${currentUser.username} 👋</h2>
          <p class="muted">Your AI productivity dashboard.</p>

          <div class="stats">
            <div class="card"><h3>Total Tasks</h3><p>${tasks.length}</p></div>
            <div class="card"><h3>Completed</h3><p>${completed}</p></div>
            <div class="card"><h3>Pending</h3><p>${pending}</p></div>
            <div class="card"><h3>Productivity</h3><p>${productivity}%</p></div>
            <div class="card"><h3>Daily Streak</h3><p>🔥 ${streak}</p></div>
          </div>
        ` : ""}

        ${currentPage === "tasks" ? `
          <h2>Task Manager</h2>

          <div class="card">
            <div class="input-row">
              <input id="taskInput" placeholder="Add a task..." />
              <button id="addTaskBtn">Add</button>
            </div>
          </div>

          <div class="card">
            <div id="taskList"></div>
          </div>
        ` : ""}

        ${currentPage === "notes" ? `
          <h2>Notes</h2>

          <div class="card">
            <textarea id="noteInput" placeholder="Write a note..."></textarea>
            <button id="saveNoteBtn">Save Note</button>
          </div>

          <div id="notesList"></div>
        ` : ""}

        ${currentPage === "planner" ? `
          <h2>Study Planner</h2>

          <div class="card">
            <h3>Manual Planner</h3>

            <div class="input-row">
              <input id="subjectInput" placeholder="Subject" />
              <input id="goalInput" placeholder="Study goal" />
              <button id="addPlanBtn">Add</button>
            </div>
          </div>

          <div class="card">
            <h3>Your Plan Items</h3>
            <div id="plannerList"></div>
          </div>

          <div class="card">
            <h3>AI Timetable Generator</h3>

            <div class="input-row">
              <input id="aiSubjectInput" placeholder="Subject, e.g. Math" />
              <input id="aiHoursInput" placeholder="Hours available, e.g. 3" />
              <button id="generatePlanBtn">Generate</button>
            </div>

            <div id="aiPlanBox" class="ai-msg" style="margin-top: 20px; white-space: pre-wrap;">
              ${aiPlan || "Your AI-generated timetable will appear here."}
            </div>
          </div>
        ` : ""}

        ${currentPage === "timer" ? `
          <h2>Focus Timer</h2>

          <div class="card center">
            <h1 id="timerDisplay">25:00</h1>
            <button id="startTimerBtn">Start</button>
            <button id="resetTimerBtn">Reset</button>
          </div>
        ` : ""}

        ${currentPage === "ai" ? `
          <h2>AI Study Assistant</h2>

          <div class="card">
            <div id="chatBox"></div>

            <div class="input-row">
              <input id="aiInput" placeholder="Ask AI something..." />
              <button id="sendAiBtn">Send</button>
            </div>
          </div>
        ` : ""}

        ${currentPage === "profile" ? `
          <h2>Profile</h2>

          <div class="stats">
            <div class="card"><h3>Username</h3><p>${currentUser.username}</p></div>
            <div class="card"><h3>Total Tasks</h3><p>${tasks.length}</p></div>
            <div class="card"><h3>Completed Tasks</h3><p>${completed}</p></div>
            <div class="card"><h3>Planner Items</h3><p>${planner.length}</p></div>
            <div class="card"><h3>Daily Streak</h3><p>🔥 ${streak}</p></div>
          </div>
        ` : ""}

        ${currentPage === "settings" ? `
          <h2>Settings</h2>
          <p class="muted">Manage your app data and preferences.</p>

          <div class="card">
            <h3>Account</h3>
            <p class="muted">Logged in as ${currentUser.username}</p>
          </div>

          <div class="card">
            <h3>Data Controls</h3>

            <div class="input-row">
              <button id="clearTasksBtn">Clear Tasks</button>
              <button id="clearNotesBtn">Clear Notes</button>
              <button id="clearPlannerBtn">Clear Planner</button>
              <button id="resetStreakBtn">Reset Streak</button>
            </div>
          </div>

          <div class="card">
            <h3>Danger Zone</h3>
            <p class="muted">This only clears this account's local app data.</p>
            <button id="clearAllBtn">Clear All My Data</button>
          </div>
        ` : ""}
      </main>
    </div>
  `;

  setupEvents();
  renderTasks();
  renderNotes();
  renderPlanner();
}

function setupEvents() {
  document.querySelectorAll("[data-page]").forEach(btn => {
    btn.addEventListener("click", () => {
      currentPage = btn.dataset.page;
      renderApp();
    });
  });

  document.querySelector("#themeBtn")?.addEventListener("click", () => {
    darkMode = !darkMode;
    saveData();
    renderApp();
  });

  document.querySelector("#logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("currentUser");
    location.reload();
  });

  document.querySelector("#addTaskBtn")?.addEventListener("click", () => {
    const input = document.querySelector("#taskInput");
    const text = input.value.trim();

    if (!text) return;

    tasks.push({ text, completed: false });
    saveData();
    renderApp();
  });

  document.querySelector("#saveNoteBtn")?.addEventListener("click", () => {
    const input = document.querySelector("#noteInput");
    const text = input.value.trim();

    if (!text) return;

    notes.push(text);
    saveData();
    renderApp();
  });

  document.querySelector("#addPlanBtn")?.addEventListener("click", () => {
    const subject = document.querySelector("#subjectInput").value.trim();
    const goal = document.querySelector("#goalInput").value.trim();

    if (!subject || !goal) return;

    planner.push({ subject, goal });
    saveData();
    renderApp();
  });

  document.querySelector("#generatePlanBtn")?.addEventListener("click", generateAITimetable);
  document.querySelector("#sendAiBtn")?.addEventListener("click", sendAIMessage);

  document.querySelector("#aiInput")?.addEventListener("keydown", e => {
    if (e.key === "Enter") sendAIMessage();
  });

  document.querySelector("#clearTasksBtn")?.addEventListener("click", () => {
    tasks = [];
    saveData();
    renderApp();
  });

  document.querySelector("#clearNotesBtn")?.addEventListener("click", () => {
    notes = [];
    saveData();
    renderApp();
  });

  document.querySelector("#clearPlannerBtn")?.addEventListener("click", () => {
    planner = [];
    aiPlan = "";
    saveData();
    renderApp();
  });

  document.querySelector("#resetStreakBtn")?.addEventListener("click", () => {
    streak = 0;
    saveData();
    renderApp();
  });

  document.querySelector("#clearAllBtn")?.addEventListener("click", () => {
    tasks = [];
    notes = [];
    planner = [];
    aiPlan = "";
    streak = 0;
    saveData();
    renderApp();
  });

  if (document.querySelector("#startTimerBtn")) {
    setupTimer();
  }
}

function renderTasks() {
  const list = document.querySelector("#taskList");
  if (!list) return;

  list.innerHTML = "";

  if (tasks.length === 0) {
    list.innerHTML = `<p class="muted">No tasks yet.</p>`;
    return;
  }

  tasks.forEach((task, index) => {
    const div = document.createElement("div");
    div.className = "task";

    div.innerHTML = `
      <span class="${task.completed ? "done" : ""}">${task.text}</span>
      <div>
        <button class="completeBtn">${task.completed ? "Undo" : "Done"}</button>
        <button class="deleteBtn">Delete</button>
      </div>
    `;

    div.querySelector(".completeBtn").addEventListener("click", () => {
      const wasCompleted = tasks[index].completed;
      tasks[index].completed = !tasks[index].completed;

      if (!wasCompleted && tasks[index].completed) {
        streak++;
      }

      saveData();
      renderApp();
    });

    div.querySelector(".deleteBtn").addEventListener("click", () => {
      tasks.splice(index, 1);
      saveData();
      renderApp();
    });

    list.appendChild(div);
  });
}

function renderNotes() {
  const list = document.querySelector("#notesList");
  if (!list) return;

  list.innerHTML = "";

  if (notes.length === 0) {
    list.innerHTML = `<p class="muted">No notes yet.</p>`;
    return;
  }

  notes.forEach((note, index) => {
    const div = document.createElement("div");
    div.className = "card note";

    div.innerHTML = `
      <p>${note}</p>
      <button>Delete</button>
    `;

    div.querySelector("button").addEventListener("click", () => {
      notes.splice(index, 1);
      saveData();
      renderApp();
    });

    list.appendChild(div);
  });
}

function renderPlanner() {
  const list = document.querySelector("#plannerList");
  if (!list) return;

  list.innerHTML = "";

  if (planner.length === 0) {
    list.innerHTML = `<p class="muted">No planner items yet.</p>`;
    return;
  }

  planner.forEach((item, index) => {
    const div = document.createElement("div");
    div.className = "task";

    div.innerHTML = `
      <span>📚 ${item.subject} — ${item.goal}</span>
      <button class="deleteBtn">Delete</button>
    `;

    div.querySelector(".deleteBtn").addEventListener("click", () => {
      planner.splice(index, 1);
      saveData();
      renderApp();
    });

    list.appendChild(div);
  });
}

async function sendAIMessage() {
  const input = document.querySelector("#aiInput");
  const chatBox = document.querySelector("#chatBox");
  const message = input.value.trim();

  if (!message) return;

  chatBox.innerHTML += `<div class="user-msg">${message}</div>`;
  input.value = "";

  const aiDiv = document.createElement("div");
  aiDiv.className = "ai-msg";
  aiDiv.textContent = "Thinking...";
  chatBox.appendChild(aiDiv);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    aiDiv.textContent = data.reply;
  } catch {
    aiDiv.textContent = "AI connection failed.";
  }
}

async function generateAITimetable() {
  const subject = document.querySelector("#aiSubjectInput").value.trim();
  const hours = document.querySelector("#aiHoursInput").value.trim();
  const box = document.querySelector("#aiPlanBox");

  if (!subject || !hours) {
    box.textContent = "Enter both subject and available hours.";
    return;
  }

  box.textContent = "Generating timetable...";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `Create a simple study timetable for ${subject}. I have ${hours} hours available today. Keep it clear and beginner friendly.`
      })
    });

    const data = await response.json();
    aiPlan = data.reply;
    saveData();
    box.textContent = aiPlan;
  } catch {
    box.textContent = "AI timetable failed. Check backend.";
  }
}

function setupTimer() {
  let time = 25 * 60;
  let interval = null;

  const display = document.querySelector("#timerDisplay");
  const start = document.querySelector("#startTimerBtn");
  const reset = document.querySelector("#resetTimerBtn");

  function update() {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;

    display.textContent =
      `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  start.addEventListener("click", () => {
    if (interval) return;

    interval = setInterval(() => {
      if (time > 0) {
        time--;
        update();
      } else {
        clearInterval(interval);
        interval = null;
        alert("Focus session complete!");
      }
    }, 1000);
  });

  reset.addEventListener("click", () => {
    clearInterval(interval);
    interval = null;
    time = 25 * 60;
    update();
  });

  update();
}