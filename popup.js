// DOM elements
const defaultFidInput = document.getElementById('defaultFidInput');
const saveBtn = document.getElementById('saveBtn');
const successMessage = document.getElementById('successMessage');

// RPC elements
const rpcUrlInput = document.getElementById('rpcUrlInput');
const saveRpcBtn = document.getElementById('saveRpcBtn');
const resetRpcBtn = document.getElementById('resetRpcBtn');
const rpcSuccessMessage = document.getElementById('rpcSuccessMessage');
const currentRpcDisplay = document.getElementById('currentRpcDisplay');

// Event listeners
saveBtn.addEventListener('click', async () => {
  const fid = defaultFidInput.value.trim();
  
  if (!fid || isNaN(fid) || parseInt(fid) <= 0) {
    showError('Please enter a valid FID');
    return;
  }
  
  await saveDefaultFid(parseInt(fid));
});

defaultFidInput.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    const fid = defaultFidInput.value.trim();
    
    if (!fid || isNaN(fid) || parseInt(fid) <= 0) {
      showError('Please enter a valid FID');
      return;
    }
    
    await saveDefaultFid(parseInt(fid));
  }
});

// RPC Event listeners
saveRpcBtn.addEventListener('click', async () => {
  const rpcUrl = rpcUrlInput.value.trim();
  
  if (rpcUrl && !isValidUrl(rpcUrl)) {
    showError('Please enter a valid URL');
    return;
  }
  
  await saveRpcUrl(rpcUrl);
});

resetRpcBtn.addEventListener('click', async () => {
  await resetRpcUrl();
});

rpcUrlInput.addEventListener('keypress', async (e) => {
  if (e.key === 'Enter') {
    const rpcUrl = rpcUrlInput.value.trim();
    
    if (rpcUrl && !isValidUrl(rpcUrl)) {
      showError('Please enter a valid URL');
      return;
    }
    
    await saveRpcUrl(rpcUrl);
  }
});

// Functions
function showError(message) {
  // Create a temporary error message
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    background: rgba(255, 59, 48, 0.2);
    border: 1px solid rgba(255, 59, 48, 0.3);
    border-radius: 8px;
    padding: 12px;
    margin-top: 15px;
    font-size: 14px;
    color: #ff6b6b;
  `;
  errorDiv.textContent = message;
  
  const settingsSection = document.querySelector('.settings-section');
  settingsSection.appendChild(errorDiv);
  
  // Remove error message after 3 seconds
  setTimeout(() => {
    if (errorDiv.parentNode) {
      errorDiv.parentNode.removeChild(errorDiv);
    }
  }, 3000);
}

function showSuccess() {
  successMessage.classList.add('show');
  
  // Hide success message after 3 seconds
  setTimeout(() => {
    successMessage.classList.remove('show');
  }, 3000);
}

function showRpcSuccess() {
  rpcSuccessMessage.classList.add('show');
  
  // Hide success message after 3 seconds
  setTimeout(() => {
    rpcSuccessMessage.classList.remove('show');
  }, 3000);
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

async function saveDefaultFid(fid) {
  try {
    // Save to Chrome storage
    await chrome.storage.local.set({ defaultFid: fid.toString() });
    
    // Show success message
    showSuccess();
    
    console.log(`Default FID saved: ${fid}`);
  } catch (err) {
    console.error('Error saving default FID:', err);
    showError(`Failed to save FID: ${err.message}`);
  }
}

async function saveRpcUrl(rpcUrl) {
  try {
    // Save to Chrome storage
    await chrome.storage.local.set({ customRpcUrl: rpcUrl });
    
    // Show success message
    showRpcSuccess();
    
    // Update current RPC display
    updateCurrentRpcDisplay();
    
    console.log(`RPC URL saved: ${rpcUrl}`);
  } catch (err) {
    console.error('Error saving RPC URL:', err);
    showError(`Failed to save RPC URL: ${err.message}`);
  }
}

async function resetRpcUrl() {
  try {
    // Remove custom RPC URL from storage
    await chrome.storage.local.remove(['customRpcUrl']);
    
    // Clear input
    rpcUrlInput.value = '';
    
    // Show success message
    showRpcSuccess();
    
    // Update current RPC display
    updateCurrentRpcDisplay();
    
    console.log('RPC URL reset to default');
  } catch (err) {
    console.error('Error resetting RPC URL:', err);
    showError(`Failed to reset RPC URL: ${err.message}`);
  }
}

function updateCurrentRpcDisplay() {
  chrome.storage.local.get(['customRpcUrl'], (result) => {
    if (result.customRpcUrl) {
      currentRpcDisplay.textContent = result.customRpcUrl;
      currentRpcDisplay.style.color = '#4CAF50';
    } else {
      currentRpcDisplay.textContent = 'https://base.llamarpc.com (Default)';
      currentRpcDisplay.style.color = '#cccccc';
    }
  });
}

// Load saved settings from storage
chrome.storage.local.get(['defaultFid', 'customRpcUrl'], (result) => {
  if (result.defaultFid) {
    defaultFidInput.value = result.defaultFid;
  }
  if (result.customRpcUrl) {
    rpcUrlInput.value = result.customRpcUrl;
  }
  
  // Update current RPC display
  updateCurrentRpcDisplay();
}); 