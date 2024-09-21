chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ enabled: true }, () => {
    console.log("Japanese Romaji Helper is enabled");
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getState') {
    chrome.storage.sync.get('enabled', (data) => {
      sendResponse({ enabled: data.enabled !== false });
    });
    return true;
  }
});