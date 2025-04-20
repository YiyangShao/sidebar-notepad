const textarea = document.getElementById("notes");

// Load saved notes
chrome.storage.local.get("notepad", (data) => {
  if (data.notepad) {
    textarea.value = data.notepad;
  }
});

// Save on input
textarea.addEventListener("input", () => {
  chrome.storage.local.set({ notepad: textarea.value });
});
