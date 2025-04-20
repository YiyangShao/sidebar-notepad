console.log("🔥 content script running");

document.addEventListener("mouseup", () => {
  try {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 0) {
      chrome.storage.local.get(["autoAddEnabled", "notepad"], (data) => {
        if (!data.autoAddEnabled) return;

        const current = data.notepad || "";
        const updated = current + "\n\n" + selectedText;

        chrome.storage.local.set({ notepad: updated }, () => {
          console.log("✅ Saved to notepad.");
        });
      });
    }
  } catch (err) {
    console.error("❌ Error in content.js:", err);
  }
});
