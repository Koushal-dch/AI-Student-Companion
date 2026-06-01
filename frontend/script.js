const loggedInUser =
  localStorage.getItem(
    "loggedInUser"
  );





if (!loggedInUser) {

  window.location.href =
    "login.html";

}
// =========================
// THEME SYSTEM
// =========================

const themeBtn =
  document.getElementById("themeBtn");

let darkMode = true;

themeBtn.onclick = () => {

  if (darkMode) {

    document.body.style.backgroundColor =
      "white";

    document.body.style.color =
      "black";

    darkMode = false;

  } else {

    document.body.style.backgroundColor =
      "#0f0f0f";

    document.body.style.color =
      "white";

    darkMode = true;

  }

};





// =========================
// BACKEND CONNECTION
// =========================

const serverMessage =
  document.getElementById("serverMessage");

fetch("http://localhost:3000/api/message")

  .then(response => response.json())

  .then(data => {

    serverMessage.textContent =
      data.message;

  })

  .catch(error => {

    serverMessage.textContent =
      "Server connection failed";

    console.log(error);

  });





// =========================
// TASK SYSTEM
// =========================

const taskInput =
  document.getElementById("taskInput");

const addTaskBtn =
  document.getElementById("addTaskBtn");

const taskContainer =
  document.getElementById("taskContainer");

let tasks = [];





function loadTasks() {

  fetch(
  `http://localhost:3000/api/tasks/${loggedInUser}`
)
    .then(response => response.json())

    .then(data => {

      tasks = data;

      renderTasks();

    });

}





addTaskBtn.onclick = () => {

  const taskText =
    taskInput.value;

  if (taskText === "") {
    return;
  }

  fetch("http://localhost:3000/api/tasks", {

    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
  text: taskText,
  completed: false,
  owner: loggedInUser
})

  })

  .then(response => response.json())

  .then(data => {

    tasks = data.tasks;

    renderTasks();

    taskInput.value = "";

  });

};





function renderTasks() {

  taskContainer.innerHTML = "";





  tasks.forEach((task, index) => {

    const taskDiv =
      document.createElement("div");

    taskDiv.classList.add("task-item");





    taskDiv.innerHTML = `

      <span class="${
        task.completed
          ? "completed-task"
          : ""
      }">

        ${task.text}

      </span>





      <div>

        <button class="complete-btn">
          Complete
        </button>

        <button class="delete-btn">
          Delete
        </button>

      </div>

    `;





    const completeBtn =
      taskDiv.querySelector(".complete-btn");

    const deleteBtn =
      taskDiv.querySelector(".delete-btn");





    completeBtn.onclick = () => {

      task.completed =
        !task.completed;

      fetch(
        `http://localhost:3000/api/tasks/${index}`,
        {

          method: "PUT",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify(task)

        }
      )

      .then(response => response.json())

      .then(data => {

        tasks = data;

        renderTasks();

      });

    };





    deleteBtn.onclick = () => {

      fetch(
        `http://localhost:3000/api/tasks/${index}`,
        {

          method: "DELETE"

        }
      )

      .then(response => response.json())

      .then(data => {

        tasks = data;

        renderTasks();

      });

    };





    taskContainer.appendChild(taskDiv);

  });





  updateStats();

}





// =========================
// NOTES SYSTEM
// =========================

const notesInput =
  document.getElementById("notesInput");

notesInput.value =
  localStorage.getItem("notes") || "";

notesInput.addEventListener(
  "input",
  () => {

    localStorage.setItem(
      "notes",
      notesInput.value
    );

  }
);





// =========================
// STATS SYSTEM
// =========================

const totalTasks =
  document.getElementById("totalTasks");

const completedTasks =
  document.getElementById("completedTasks");

const pendingTasks =
  document.getElementById("pendingTasks");

const completionRate =
  document.getElementById("completionRate");





function updateStats() {

  const total =
    tasks.length;

  const completed =
    tasks.filter(
      task => task.completed
    ).length;

  const pending =
    total - completed;

  const percentage =
    total === 0
      ? 0
      : Math.round(
          (completed / total) * 100
        );





  totalTasks.textContent =
    total;

  completedTasks.textContent =
    completed;

  pendingTasks.textContent =
    pending;

  completionRate.textContent =
    percentage + "%";

}





// =========================
// TIMER SYSTEM
// =========================

const timerDisplay =
  document.getElementById("timerDisplay");

const startBtn =
  document.getElementById("startBtn");

const pauseBtn =
  document.getElementById("pauseBtn");

const resetBtn =
  document.getElementById("resetBtn");





let timer =
  25 * 60;

let interval = null;





function updateTimerDisplay() {

  const minutes =
    Math.floor(timer / 60);

  const seconds =
    timer % 60;





  timerDisplay.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}





startBtn.onclick = () => {

  if (interval) {
    return;
  }

  interval = setInterval(() => {

    if (timer > 0) {

      timer--;

      updateTimerDisplay();

    }

  }, 1000);

};





pauseBtn.onclick = () => {

  clearInterval(interval);

  interval = null;

};





resetBtn.onclick = () => {

  clearInterval(interval);

  interval = null;

  timer = 25 * 60;

  updateTimerDisplay();

};





// =========================
// INITIAL LOAD
// =========================

updateTimerDisplay();
// =========================
// AI STUDY ASSISTANT
// =========================

const adviceBtn =
  document.getElementById("adviceBtn");

const adviceText =
  document.getElementById("adviceText");





adviceBtn.onclick = () => {

  fetch(
    "http://localhost:3000/api/study-advice"
  )

  .then(response => response.json())

  .then(data => {

    adviceText.textContent =
      data.advice;

  });

};
// =========================
// LOGOUT SYSTEM
// =========================

const logoutBtn =
  document.getElementById(
    "logoutBtn"
  );





logoutBtn.onclick = () => {

  localStorage.removeItem(
    "loggedInUser"
  );





  window.location.href =
    "login.html";

};
loadTasks();