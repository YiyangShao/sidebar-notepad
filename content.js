console.log("🔥 content script running");

document.addEventListener("mouseup", () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText.length === 0) return;

  chrome.storage.local.get(["autoAddEnabled", "notes"], (data) => {
    if (!data.autoAddEnabled) return;

    const notes = data.notes || [];
    if (notes.length === 0) return;

    const recent = [...notes].sort((a, b) => b.timestamp - a.timestamp)[0];
    recent.content += "\n\n" + selectedText;
    recent.timestamp = Date.now();

    chrome.storage.local.set({ notes });
  });
});
