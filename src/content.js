function createOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'japanese-romaji-overlay';
  overlay.style.cssText = `
    position: absolute;
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    z-index: 9999;
    display: none;
  `;
  document.body.appendChild(overlay);
  return overlay;
}

const overlay = createOverlay();

async function handleSelection(event) {
  const selection = window.getSelection();
  if (selection && selection.toString().trim().length > 0) {
    const text = selection.toString();

    try {
      const response = await fetch('http://localhost:3000/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const { romaji } = await response.json();

      const range = selection.getRangeAt(0);
      const highlightSpan = document.createElement('span');
      highlightSpan.style.backgroundColor = 'yellow';
      highlightSpan.textContent = text;
      range.deleteContents();
      range.insertNode(highlightSpan);

      overlay.innerHTML = `
        <p style="font-weight: bold; margin-bottom: 5px;">${text}</p>
        <p style="color: #666;">${romaji}</p>
      `;

      const rect = highlightSpan.getBoundingClientRect();
      overlay.style.display = 'block';
      overlay.style.left = `${window.pageXOffset + rect.left}px`;
      overlay.style.top = `${window.pageYOffset + rect.bottom + 5}px`;
    } catch (error) {
      console.error('Error in handleSelection:', error);
      overlay.style.display = 'none';
    }
  } else {
    overlay.style.display = 'none';
  }
}

document.addEventListener('mouseup', handleSelection);

function cleanup() {
  document.removeEventListener('mouseup', handleSelection);
}

if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'cleanup') {
      cleanup();
      sendResponse({ success: true });
    }
  });
}