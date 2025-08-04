const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const messageDiv = document.getElementById("message");
const urlParams = new URLSearchParams(window.location.search);

messageDiv.style.display = "none";

// Toggle between forms
document.getElementById("showSignup").addEventListener("click", () => {
  signupForm.style.display = "block";
  loginForm.style.display = "none";
  messageDiv.textContent = "";
  messageDiv.style.display = "none";
  messageDiv.className = "";
  });

document.getElementById("showLogin").addEventListener("click", () => {
  loginForm.style.display = "block";
  signupForm.style.display = "none";
    messageDiv.textContent = "";
  messageDiv.style.display = "none";
  messageDiv.className = "";
});

// Signup handler
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(signupForm);
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const res = await fetch("/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Signup failed");

    messageDiv.textContent = "Signup successful! You can now log in.";
    messageDiv.className = "success"; 
    messageDiv.style.display = "block";
    signupForm.reset();
    document.getElementById("showLogin").click();
  } catch (err) {
    messageDiv.textContent = err.message;
    messageDiv.className = "error";
    messageDiv.style.display = "block";
  }
});

// Login handler
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(loginForm);
  const username = formData.get("username");
  const password = formData.get("password");

  try {
    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Login failed");

    messageDiv.textContent = "Login successful! Redirecting...";
    messageDiv.className = "success";
    messageDiv.style.display = "block";
    setTimeout(() => {
      window.location.href = "/notes.html";
    }, 1000);
  } catch (err) {
    messageDiv.textContent = err.message;
    messageDiv.className = "error";
    messageDiv.style.display = "block";
  }
});

if (urlParams.get("logout") === "1") {
  messageDiv.textContent = "Logout successful!";
  messageDiv.className = "success";
  messageDiv.style.display = "block";
};
