const notesList = document.getElementById('notesList');
const addNoteForm = document.getElementById('addNoteForm');
const logoutBtn = document.getElementById('logoutBtn');

// Fetch and display notes
async function loadNotes() {
  try {
    const res = await fetch('/api/notes');
    if (!res.ok) throw new Error('Failed to load notes');
    const notes = await res.json();

    notesList.innerHTML = '';

    if (notes.length === 0) {
      notesList.textContent = 'No notes yet.';
      return;
    }

    notes.forEach(note => {
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

    // Attach delete handlers
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

  } catch (err) {
    notesList.textContent = 'Error loading notes.';
  }

  // Edit and Save handlers
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

      loadNotes(); // reload the updated notes
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

// Logout handler
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

// Initial load
loadNotes();
