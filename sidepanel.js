const textarea = document.getElementById("notes");

// Load saved notes on startup
chrome.storage.local.get("notepad", (data) => {
  if (data.notepad) {
    textarea.value = data.notepad;
  }
});

// Save notes on input
textarea.addEventListener("input", () => {
  chrome.storage.local.set({ notepad: textarea.value });
});

// Live update notepad if storage changes (e.g. user selects new text)
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.notepad) {
    textarea.value = changes.notepad.newValue || "";
    console.log("🟡 Notepad live-updated from background change.");
  }
});
