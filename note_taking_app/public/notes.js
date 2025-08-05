const notesList = document.getElementById('notesList');
const addNoteForm = document.getElementById('addNoteForm');
const logoutBtn = document.getElementById('logoutBtn');

const sortSelect = document.getElementById('sortSelect');
const filterDate = document.getElementById('filterDate');
const clearFiltersBtn = document.getElementById('clearFilters');

let allNotes = [];

// Fetch notes and store in allNotes, then render
async function loadNotes() {
  try {
    const res = await fetch('/api/notes');
    if (!res.ok) throw new Error('Failed to load notes');
    allNotes = await res.json();
    renderNotes();
  } catch (err) {
    notesList.textContent = 'Error loading notes.';
  }
}

// Render notes with filter and sort applied
function renderNotes() {
  let filteredNotes = [...allNotes];

  // Filter by created date if filterDate has value
  if (filterDate && filterDate.value) {
    filteredNotes = filteredNotes.filter(note => {
      const noteDate = new Date(note.createdAt).toISOString().slice(0, 10);
      return noteDate === filterDate.value;
    });
  }

  // Sort notes by created date
  if (sortSelect) {
    filteredNotes.sort((a, b) => {
      if (sortSelect.value === 'newest') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });
  }

  notesList.innerHTML = '';

  if (filteredNotes.length === 0) {
    notesList.textContent = 'No notes found.';
    return;
  }

  filteredNotes.forEach(note => {
    const noteEl = document.createElement('div');
    noteEl.className = 'note';
    noteEl.innerHTML = `
      <input type="text" class="edit-title" value="${note.title}" disabled />
      <textarea class="edit-content" disabled>${note.content || ''}</textarea>
      <p class="timestamp">Created: ${new Date(note.createdAt).toLocaleString()}</p>
      <p class="timestamp">Updated: ${new Date(note.updatedAt).toLocaleString()}</p>
      <button data-id="${note._id}" class="editBtn">Edit</button>
      <button data-id="${note._id}" class="saveBtn" style="display:none">Save</button>
      <button data-id="${note._id}" class="deleteBtn">Delete</button>
    `;
    notesList.appendChild(noteEl);
  });

  attachNoteEventHandlers();
}

// Attach edit, save, and delete button event handlers
function attachNoteEventHandlers() {
  document.querySelectorAll('.deleteBtn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const id = e.target.getAttribute('data-id');
      try {
        const res = await fetch(`/api/notes/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete note');
        loadNotes();
      } catch (err) {
        alert(err.message);
      }
    });
  });

  document.querySelectorAll('.editBtn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const noteDiv = e.target.closest('.note');
      noteDiv.querySelector('.edit-title').disabled = false;
      noteDiv.querySelector('.edit-content').disabled = false;
      noteDiv.querySelector('.saveBtn').style.display = 'inline-block';
      e.target.style.display = 'none';
    });
  });

  document.querySelectorAll('.saveBtn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const noteId = e.target.getAttribute('data-id');
      const noteDiv = e.target.closest('.note');
      const title = noteDiv.querySelector('.edit-title').value;
      const content = noteDiv.querySelector('.edit-content').value;

      try {
        const res = await fetch(`/api/notes/${noteId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content }),
        });

        if (!res.ok) throw new Error('Failed to update note');

        loadNotes();
      } catch (err) {
        alert(err.message);
      }
    });
  });
}

// Add new note handler
addNoteForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(addNoteForm);
  const title = formData.get('title');
  const content = formData.get('content');

  try {
    const res = await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || 'Failed to add note');
    }

    addNoteForm.reset();
    loadNotes();

  } catch (err) {
    alert(err.message);
  }
});

// Logout handler with safe check for logoutBtn
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    try {
      const res = await fetch('/api/users/logout');
      if (res.ok) {
        window.location.href = '/';
      } else {
        alert('Logout failed');
      }
    } catch (err) {
      alert('Error logging out');
    }
  });
}

// Sorting, filtering, and clear filters listeners
if (sortSelect) sortSelect.addEventListener('change', renderNotes);
if (filterDate) filterDate.addEventListener('change', renderNotes);
if (clearFiltersBtn) clearFiltersBtn.addEventListener('click', () => {
  if (sortSelect) sortSelect.value = 'newest';
  if (filterDate) filterDate.value = '';
  renderNotes();
});

// Initial load
loadNotes();

