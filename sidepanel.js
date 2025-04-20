const textarea = document.getElementById("notes");
const toggle = document.getElementById("autoAddToggle");

// Load saved notes and toggle state
chrome.storage.local.get(["notepad", "autoAddEnabled"], (data) => {
  if (data.notepad) {
    textarea.value = data.notepad;
  }
  toggle.checked = data.autoAddEnabled !== false; // default to true
});

// Save notes on input
textarea.addEventListener("input", () => {
  chrome.storage.local.set({ notepad: textarea.value });
});

// Update toggle state
toggle.addEventListener("change", () => {
  chrome.storage.local.set({ autoAddEnabled: toggle.checked });
});

// Live update textarea if content changes externally
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.notepad) {
    textarea.value = changes.notepad.newValue || "";
    console.log("🟡 Notepad live-updated from background change.");
  }
});
