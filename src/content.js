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
let highlightedSpan = null;

async function handleSelection(event) {
  const selection = window.getSelection();
  if (!selection || selection.toString().trim().length === 0) {
    hideOverlay();
    return;
  }

  const text = selection.toString().trim();

  try {
    const response = await fetch('http://localhost:3000/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const { romaji } = await response.json();

    if (highlightedSpan) {
      highlightedSpan.outerHTML = highlightedSpan.textContent;
    }

    if (selection.rangeCount === 0) {
      updateOverlayContent(text, romaji);
      showOverlay({ left: event.pageX, bottom: event.pageY });
      return;
    }

    const range = selection.getRangeAt(0);
    highlightedSpan = document.createElement('span');
    highlightedSpan.style.backgroundColor = 'rgba(255, 255, 0, 0.3)';
    highlightedSpan.textContent = text;
    range.deleteContents();
    range.insertNode(highlightedSpan);

    updateOverlayContent(text, romaji);
    showOverlay(highlightedSpan.getBoundingClientRect());
  } catch (error) {
    console.error('Error in handleSelection:', error);
    hideOverlay();
  }
}

function showOverlay(rect) {
  overlay.style.opacity = '0';
  overlay.style.display = 'block';
  overlay.style.left = `${window.pageXOffset + rect.left}px`;
  overlay.style.top = `${window.pageYOffset + rect.bottom + 5}px`;
  setTimeout(() => overlay.style.opacity = '1', 10);
}

function hideOverlay() {
  overlay.style.opacity = '0';
  setTimeout(() => overlay.style.display = 'none', 200);
}

function updateOverlayContent(text, romaji) {
  overlay.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; background-color: #f3f4f6; padding: 8px 16px; border-top-left-radius: 8px; border-top-right-radius: 8px;">
      <h3 style="margin: 0; font-size: 14px; font-weight: 600; color: #374151;">Romaji Translation</h3>
      <button id="close-romaji-overlay" style="background: none; border: none; cursor: pointer; color: #6b7280;">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <div style="padding: 16px;">
      <p style="font-size: 16px; font-weight: 500; color: #1f2937; margin-bottom: 8px;">${text}</p>
      <p style="font-size: 14px; color: #4b5563; font-family: monospace;">${romaji}</p>
    </div>
  `;

  overlay.querySelector('#close-romaji-overlay').addEventListener('click', hideOverlay);
}

document.addEventListener('mouseup', handleSelection);

function cleanup() {
  document.removeEventListener('mouseup', handleSelection);
  if (highlightedSpan) {
    highlightedSpan.outerHTML = highlightedSpan.textContent;
  }
  if (overlay && overlay.parentNode) {
    overlay.parentNode.removeChild(overlay);
  }
}

if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'cleanup') {
      cleanup();
      sendResponse({ success: true });
    }
  });
}