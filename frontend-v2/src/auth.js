export function renderAuthPage(onLogin) {
  document.querySelector("#app").innerHTML = `
    <div class="auth-page">
      <div class="auth-card">
        <h1>North</h1>
        <p>Login or create an account</p>

        <input id="username" placeholder="Username" />
        <input id="password" type="password" placeholder="Password" />

        <button id="loginBtn">Login</button>
        <button id="signupBtn">Signup</button>

        <p id="authMessage"></p>
      </div>
    </div>
  `;

  const users = JSON.parse(localStorage.getItem("users")) || [];

  document.querySelector("#signupBtn").onclick = () => {
    const username = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value.trim();

    if (!username || !password) return;

    if (users.find(user => user.username === username)) {
      document.querySelector("#authMessage").textContent = "User already exists";
      return;
    }

    users.push({ username, password });

    localStorage.setItem("users", JSON.stringify(users));
    document.querySelector("#authMessage").textContent = "Signup successful";
  };

  document.querySelector("#loginBtn").onclick = () => {
    const username = document.querySelector("#username").value.trim();
    const password = document.querySelector("#password").value.trim();

    const user = users.find(
      user => user.username === username && user.password === password
    );

    if (!user) {
      document.querySelector("#authMessage").textContent = "Wrong login";
      return;
    }

    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify(user));

    onLogin();
  };
}