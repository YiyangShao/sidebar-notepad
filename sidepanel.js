const menuView = document.getElementById("menuView");
const editorView = document.getElementById("editorView");
const noteList = document.getElementById("noteList");
const newNoteBtn = document.getElementById("newNoteBtn");
const backBtn = document.getElementById("backBtn");
const deleteBtn = document.getElementById("deleteBtn");
const noteContent = document.getElementById("noteContent");
const autoAddToggle = document.getElementById("autoAddToggle");

let currentNoteId = null;

// Generate ID
function generateId() {
  return "note_" + Date.now();
}

// Load notes
function loadNotes(callback) {
  chrome.storage.local.get("notes", (data) => {
    callback(data.notes || []);
  });
}

// Save notes
function saveNotes(notes, callback) {
  chrome.storage.local.set({ notes }, callback);
}

// Render menu
function renderNoteList() {
  loadNotes((notes) => {
    noteList.innerHTML = "";
    if (notes.length === 0) {
      noteList.innerHTML = "<p>No notes yet.</p>";
      return;
    }
    notes
      .sort((a, b) => b.timestamp - a.timestamp)
      .forEach((note) => {
        const div = document.createElement("div");
        div.className = "note-item";

        const title = document.createElement("span");
        title.textContent = note.content.split("\n")[0] || "Untitled note";
        title.onclick = () => openNote(note.id);

        const del = document.createElement("button");
        del.textContent = "🗑️";
        del.onclick = (e) => {
          e.stopPropagation();
          deleteNote(note.id);
        };

        div.appendChild(title);
        div.appendChild(del);
        noteList.appendChild(div);
      });
  });
}

// Open a note
function openNote(id) {
  loadNotes((notes) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    currentNoteId = id;
    noteContent.value = note.content;
    menuView.style.display = "none";
    editorView.style.display = "block";

    chrome.storage.local.get("autoAddEnabled", (data) => {
      autoAddToggle.checked = data.autoAddEnabled !== false;
    });
  });
}

// New note
newNoteBtn.onclick = () => {
  const id = generateId();
  const newNote = { id, content: "", timestamp: Date.now() };
  loadNotes((notes) => {
    notes.push(newNote);
    saveNotes(notes, () => openNote(id));
  });
};

// Save edits
noteContent.addEventListener("input", () => {
  loadNotes((notes) => {
    const note = notes.find((n) => n.id === currentNoteId);
    if (!note) return;
    note.content = noteContent.value;
    note.timestamp = Date.now();
    saveNotes(notes);
  });
});

// Save toggle
autoAddToggle.addEventListener("change", () => {
  chrome.storage.local.set({ autoAddEnabled: autoAddToggle.checked });
});

// Delete note
function deleteNote(id) {
  loadNotes((notes) => {
    const updated = notes.filter((n) => n.id !== id);
    saveNotes(updated, renderNoteList);
  });
}

// Back to menu
backBtn.onclick = () => {
  currentNoteId = null;
  menuView.style.display = "block";
  editorView.style.display = "none";
  renderNoteList();
};

// Live update
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.notes && currentNoteId) {
    const notes = changes.notes.newValue || [];
    const current = notes.find((n) => n.id === currentNoteId);
    if (current) {
      noteContent.value = current.content;
    }
  }
});

// Init
renderNoteList();
