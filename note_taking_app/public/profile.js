const profileForm = document.getElementById('profileForm');
const message = document.getElementById('message');
const logoutBtn = document.getElementById('logoutBtn');

// Fetch current user data when page loads
async function loadProfile() {
  try {
    const res = await fetch('/api/users/me');
    if (!res.ok) throw new Error('Failed to fetch profile');
    const data = await res.json();
    document.getElementById('username').value = data.user.username;
    document.getElementById('email').value = data.user.email;
  } catch (err) {
    message.textContent = err.message;
  }
}

// Handle profile form submission
profileForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = profileForm.username.value.trim();
  const email = profileForm.email.value.trim();

  try {
    const res = await fetch('/api/users/me', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Update failed');

    message.textContent = 'Profile updated successfully!';
  } catch (err) {
    message.textContent = err.message;
  }
});

// Logout button handler
logoutBtn.addEventListener('click', async () => {
  await fetch('/api/users/logout');
  window.location.href = '/index.html'; // or wherever your login page is
});

// Load profile on page load
loadProfile();
