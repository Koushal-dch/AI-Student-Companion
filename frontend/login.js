const usernameInput =
  document.getElementById("username");

const passwordInput =
  document.getElementById("password");

const loginBtn =
  document.getElementById("loginBtn");

const signupBtn =
  document.getElementById("signupBtn");

const authMessage =
  document.getElementById("authMessage");





// =========================
// SIGNUP
// =========================

signupBtn.onclick = () => {

  const username =
    usernameInput.value;

  const password =
    passwordInput.value;





  if (
    username === "" ||
    password === ""
  ) {

    authMessage.textContent =
      "Fill all fields";

    return;

  }





  fetch(
    "http://localhost:3000/api/signup",
    {

      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({
        username,
        password
      })

    }
  )

  .then(response => response.json())

  .then(data => {

    authMessage.textContent =
      data.message;

  });

};





// =========================
// LOGIN
// =========================

loginBtn.onclick = () => {

  const username =
    usernameInput.value;

  const password =
    passwordInput.value;





  fetch(
    "http://localhost:3000/api/login",
    {

      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({
        username,
        password
      })

    }
  )

  .then(response => response.json())

  .then(data => {

    if (data.success) {

      localStorage.setItem(
        "loggedInUser",
        username
      );





      window.location.href =
        "index.html";

    } else {

      authMessage.textContent =
        data.message;

    }

  });

};