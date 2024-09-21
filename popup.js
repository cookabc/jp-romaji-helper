document.addEventListener('DOMContentLoaded', function () {
  var changeColorButton = document.getElementById('changeColor');
  changeColorButton.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "change_color" });
    });
  });
});