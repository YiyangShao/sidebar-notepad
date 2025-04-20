// Open side panel on icon click — must be triggered by user
chrome.action.onClicked.addListener((tab) => {
    chrome.sidePanel.open({ tabId: tab.id });
  });
  
  // Set default settings on install
  chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get("autoAddEnabled", (data) => {
      if (data.autoAddEnabled === undefined) {
        chrome.storage.local.set({ autoAddEnabled: true });
      }
    });
  });
  