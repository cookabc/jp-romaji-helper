chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "change_color") {
    document.body.style.backgroundColor = getRandomColor();
  }
});

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}