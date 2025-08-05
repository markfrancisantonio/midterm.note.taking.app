// Get references to forms and message display
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const messageDiv = document.getElementById("message");
const urlParams = new URLSearchParams(window.location.search);

// Hide message box by default
messageDiv.style.display = "none";

// When "Sign Up" button is clicked, show sign-up form and hide login form
document.getElementById("showSignup").addEventListener("click", () => {
  signupForm.style.display = "block";
  loginForm.style.display = "none";
  messageDiv.textContent = "";
  messageDiv.style.display = "none";
  messageDiv.className = "";
});

// When "Log In" button is clicked, show login form and hide sign-up form
document.getElementById("showLogin").addEventListener("click", () => {
  loginForm.style.display = "block";
  signupForm.style.display = "none";
  messageDiv.textContent = "";
  messageDiv.style.display = "none";
  messageDiv.className = "";
});

// Handle sign-up form submission
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(signupForm);
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const username = formData.get("username");
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    // Send data to backend to register the user
    const res = await fetch("/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, username, email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Signup failed");

    messageDiv.textContent = "Signup successful! You can now log in.";
    messageDiv.className = "success";
    messageDiv.style.display = "block";
    signupForm.reset();
    setTimeout(() => {
      document.getElementById("showLogin").click();
    }, 1500);
  } catch (err) {
    messageDiv.textContent = err.message;
    messageDiv.className = "error";
    messageDiv.style.display = "block";
  }
});

// Handle login form submission
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(loginForm);
  const username = formData.get("username");
  const password = formData.get("password");

  try {
    // Send login request to backend
    const res = await fetch("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Login failed");

    // Show success message and redirect
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

// Show logout success message if redirected from logout
if (urlParams.get("logout") === "1") {
  messageDiv.textContent = "Logout successful!";
  messageDiv.className = "success";
  messageDiv.style.display = "block";
}
