const profileForm = document.getElementById("profileForm");
const message = document.getElementById("message");
const logoutBtn = document.getElementById("logoutBtn");
const editBtn = document.getElementById("editBtn");
const cancelEditBtn = document.getElementById("cancelEdit");
const profileView = document.getElementById("profileView");

// Show or hide the edit form and the profile view depending on what the user is doing
function toggleEditMode(isEditing) {
  if (isEditing) {
    profileView.classList.add("hidden");
    profileForm.classList.remove("hidden");
  } else {
    profileView.classList.remove("hidden");
    profileForm.classList.add("hidden");
  }
}

// Get the current user info from the server and show it on the page
async function loadProfile() {
  try {
    const res = await fetch("/api/users/me");
    if (!res.ok) throw new Error("Failed to fetch profile");
    const data = await res.json();
    const user = data.user;

    // Update view mode display spans
    document.getElementById("viewFirstName").textContent = user.firstName || "";
    document.getElementById("viewLastName").textContent = user.lastName || "";
    document.getElementById("viewUsername").textContent = user.username || "";
    document.getElementById("viewEmail").textContent = user.email || "";

    // Also update the edit form inputs in case user switches to edit mode
    document.getElementById("firstName").value = user.firstName || "";
    document.getElementById("lastName").value = user.lastName || "";
    document.getElementById("username").value = user.username || "";
    document.getElementById("email").value = user.email || "";
  } catch (err) {
    message.textContent = err.message;
  }
}

// When user clicks Edit, switch to the form so they can make changes
editBtn.addEventListener("click", () => {
  toggleEditMode(true);
});

// When user clicks Cancel, undo any changes and go back to view mode
cancelEditBtn.addEventListener("click", () => {
  document.getElementById("firstName").value =
    document.getElementById("viewFirstName").textContent;
  document.getElementById("lastName").value =
    document.getElementById("viewLastName").textContent;
  document.getElementById("username").value =
    document.getElementById("viewUsername").textContent;
  document.getElementById("email").value =
    document.getElementById("viewEmail").textContent;

  toggleEditMode(false);
});

// When the form is submitted, send the changes to the server to update the profile
profileForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const firstName = profileForm.firstName.value.trim();
  const lastName = profileForm.lastName.value.trim();
  const username = profileForm.username.value.trim();
  const email = profileForm.email.value.trim();

  try {
    const res = await fetch("/api/users/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firstName, lastName, username, email }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Update failed");

    // Update the profile view with the new info
    document.getElementById("viewFirstName").textContent = firstName;
    document.getElementById("viewLastName").textContent = lastName;
    document.getElementById("viewUsername").textContent = username;
    document.getElementById("viewEmail").textContent = email;

    message.textContent = "Profile updated successfully!";
    toggleEditMode(false);
  } catch (err) {
    message.textContent = err.message;
  }
});

// If there is a logout button, let the user click it to log out safely
if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    try {
      const res = await fetch("/api/users/logout");
      if (res.ok) {
        window.location.href = "/";
      } else {
        alert("Logout failed");
      }
    } catch (err) {
      alert("Error logging out");
    }
  });
}

// When the page loads, fetch and show the user's profile
loadProfile();
