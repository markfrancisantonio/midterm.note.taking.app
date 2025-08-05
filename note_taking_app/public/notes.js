const notesList = document.getElementById("notesList");
const addNoteForm = document.getElementById("addNoteForm");
const logoutBtn = document.getElementById("logoutBtn");

const sortSelect = document.getElementById("sortSelect");
const filterDate = document.getElementById("filterDate");
const clearFiltersBtn = document.getElementById("clearFilters");

let allNotes = [];
let currentlyEditingNote = null;

// Load notes from the server and show them on the page
async function loadNotes() {
  try {
    const res = await fetch("/api/notes");
    if (!res.ok) throw new Error("Failed to load notes");
    allNotes = await res.json();
    renderNotes();
  } catch (err) {
    notesList.textContent = "Error loading notes.";
  }
}
let isEditing = false;

// Show notes on the page with sorting and filtering applied
function renderNotes() {
  let filteredNotes = [...allNotes];

  // If user picked a date to filter by, only keep notes from that date
  if (filterDate && filterDate.value) {
    filteredNotes = filteredNotes.filter((note) => {
      const noteDateObj = new Date(note.createdAt);
      const year = noteDateObj.getFullYear();
      const month = String(noteDateObj.getMonth() + 1).padStart(2, "0");
      const day = String(noteDateObj.getDate()).padStart(2, "0");
      const noteDateLocal = `${year}-${month}-${day}`;
      return noteDateLocal === filterDate.value;
    });
  }

  // Sort notes either newest first or oldest first based on user choice
  if (sortSelect) {
    filteredNotes.sort((a, b) => {
      if (sortSelect.value === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });
  }

  notesList.innerHTML = "";
  isEditing = false;
  currentlyEditingNote = null;

  if (filteredNotes.length === 0) {
    notesList.textContent = "No notes found.";
    return;
  }

  // Create and add each note’s HTML to the page
  filteredNotes.forEach((note) => {
    const noteEl = document.createElement("div");
    noteEl.className = "note";
    noteEl.innerHTML = `
  <div class="note-content">
    <input type="text" class="edit-title" value="${note.title}" disabled />
    <textarea class="edit-content" disabled>${note.content || ""}</textarea>
    <p class="timestamp">Created: ${new Date(
      note.createdAt
    ).toLocaleString()}</p>
    <p class="timestamp">Updated: ${new Date(
      note.updatedAt
    ).toLocaleString()}</p>
  </div>
  <div class="note-buttons">
    <button data-id="${note._id}" class="editBtn">Edit</button>
    <button data-id="${
      note._id
    }" class="saveBtn" style="display:none">Save</button>
    <button data-id="${
      note._id
    }" class="cancelBtn" style="display:none">Cancel</button>
    <button data-id="${note._id}" class="deleteBtn">Delete</button>
  </div>
  `;

    notesList.appendChild(noteEl);
  });

  attachNoteEventHandlers();
}

// Add event listeners to note buttons (edit, save, cancel, delete)
function attachNoteEventHandlers() {
  document.querySelectorAll(".deleteBtn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      // If we are editing a note, don’t allow deleting another one
      if (currentlyEditingNote) {
        alert(
          "Please save or cancel your current edit before deleting a note."
        );
        e.preventDefault();
        return;
      }

      const id = e.target.getAttribute("data-id");
      try {
        const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete note");
        loadNotes();
      } catch (err) {
        alert(err.message);
      }
    });
  });

  document.querySelectorAll(".editBtn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      // Only allow one note to be edited at a time
      if (currentlyEditingNote) {
        alert(
          "You can only edit one note at a time. Please save or cancel the current edit first."
        );
        return;
      }

      const noteDiv = e.target.closest(".note");
      if (!noteDiv) return;

      // Mark this note as currently being edited
      currentlyEditingNote = noteDiv;

      if (isEditing) {
        alert("Finish editing the current note before editing another one.");
        return;
      }
      // Make the title and content fields editable
      noteDiv.querySelector(".edit-title").disabled = false;
      noteDiv.querySelector(".edit-content").disabled = false;
      // Show Save and Cancel buttons, hide Edit button
      noteDiv.querySelector(".saveBtn").style.display = "inline-block";
      noteDiv.querySelector(".cancelBtn").style.display = "inline-block"; // <-- Show cancel button here
      e.target.style.display = "none";
      // Highlight the content area to show it’s being edited
      noteDiv.querySelector(".edit-content").classList.add("editing");

      // Set editing flag
      isEditing = true;
    });
  });
  document.querySelectorAll(".saveBtn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const noteId = e.target.getAttribute("data-id");
      const noteDiv = e.target.closest(".note");
      const title = noteDiv.querySelector(".edit-title").value;
      const content = noteDiv.querySelector(".edit-content").value;

      try {
        const res = await fetch(`/api/notes/${noteId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content }),
        });

        if (!res.ok) throw new Error("Failed to update note");
        currentlyEditingNote = null;

        loadNotes();
        isEditing = false;
      } catch (err) {
        alert(err.message);
      }
    });
  });
  document.querySelectorAll(".cancelBtn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const noteDiv = e.target.closest(".note");
      if (!noteDiv) return;

      const noteId = e.target.getAttribute("data-id");
      const originalNote = allNotes.find((note) => note._id === noteId);
      if (originalNote) {
        noteDiv.querySelector(".edit-title").value = originalNote.title;
        noteDiv.querySelector(".edit-content").value =
          originalNote.content || "";
      }

      // Disable inputs again
      noteDiv.querySelector(".edit-title").disabled = true;
      noteDiv.querySelector(".edit-content").disabled = true;

      // Hide save and cancel buttons, show edit button
      noteDiv.querySelector(".saveBtn").style.display = "none";
      noteDiv.querySelector(".cancelBtn").style.display = "none";
      noteDiv.querySelector(".editBtn").style.display = "inline-block";

      // Remove editing highlight
      noteDiv.querySelector(".edit-content").classList.remove("editing");

      // Clear editing state
      currentlyEditingNote = null;
      isEditing = false;
    });
  });
}

// When user adds a new note, send it to the server and reload notes
addNoteForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData(addNoteForm);
  const title = formData.get("title");
  const content = formData.get("content");

  try {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to add note");
    }

    addNoteForm.reset();
    loadNotes();
  } catch (err) {
    alert(err.message);
  }
});

// If logout button exists, add click listener to log the user out
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

// When user changes sort or filter options, update the notes shown
if (sortSelect) sortSelect.addEventListener("change", renderNotes);
if (filterDate) filterDate.addEventListener("change", renderNotes);

// Clear all filters and reset to defaults
if (clearFiltersBtn)
  clearFiltersBtn.addEventListener("click", (e) => {
    if (currentlyEditingNote) {
      alert("Please save or cancel your current edit before clearing filters.");
      e.preventDefault();
      return;
    }

    if (sortSelect) sortSelect.value = "newest";
    if (filterDate) filterDate.value = "";
    renderNotes();
  });

// Prevent user from clicking outside the note while editing
document.addEventListener("click", (e) => {
  if (!currentlyEditingNote) return; // no edit in progress

  // Allow clicks inside the note or on save/cancel buttons
  if (currentlyEditingNote.contains(e.target)) return;
  if (
    e.target.classList.contains("saveBtn") ||
    e.target.classList.contains("cancelBtn")
  )
    return;

  alert("Please save or cancel your current edit before clicking elsewhere.");

  // Stop clicks from doing anything outside the note during edit
  e.preventDefault();
  e.stopPropagation();
});

// Load notes when the page loads
loadNotes();
