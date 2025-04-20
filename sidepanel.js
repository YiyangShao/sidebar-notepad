const textarea = document.getElementById("notes");

// Load saved notes on startup
chrome.storage.local.get("notepad", (data) => {
  if (data.notepad) {
    textarea.value = data.notepad;
  }
});

// Save notes whenever the user types
textarea.addEventListener("input", () => {
  chrome.storage.local.set({ notepad: textarea.value });
});
