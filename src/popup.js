document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('enableToggle');

  chrome.storage.sync.get('enabled', (data) => {
    toggle.checked = data.enabled !== false;
  });

  toggle.addEventListener('change', () => {
    const enabled = toggle.checked;
    chrome.storage.sync.set({ enabled: enabled }, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "toggleOverlay", enabled: enabled });
      });
    });
  });
});