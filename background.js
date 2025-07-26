// Background service worker for TipN Chrome extension

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('TipN extension installed successfully');
    
    // Set default settings
    chrome.storage.local.set({
      lastFid: '',
      theme: 'dark'
    });
  }
});

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
  console.log('TipN extension started');
});

// Handle messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getFidInfo') {
    // This could be used for background processing if needed
    sendResponse({ success: true });
  }
});

// Optional: Handle browser action click
chrome.action.onClicked.addListener((tab) => {
  // This will only trigger if no popup is defined in manifest
  console.log('Extension icon clicked');
}); 