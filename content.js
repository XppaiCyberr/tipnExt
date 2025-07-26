// Content script for TipN Chrome extension
// This script injects TipN results into the Farcaster.xyz sidebar

console.log('TipN content script loaded');

// Smart contract ABI (same as popup.js)
const CONTRACT_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "token", "type": "address"}],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "fid", "type": "uint256"},
      {"indexed": true, "internalType": "address", "name": "user", "type": "address"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "Claim",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "address", "name": "previousOwner", "type": "address"},
      {"indexed": true, "internalType": "address", "name": "newOwner", "type": "address"}
    ],
    "name": "OwnershipTransferred",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": true, "internalType": "uint256", "name": "fromFid", "type": "uint256"},
      {"indexed": true, "internalType": "uint256", "name": "toFid", "type": "uint256"},
      {"indexed": true, "internalType": "uint256", "name": "season", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "Tip",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "TOKEN",
    "outputs": [{"internalType": "contract IERC20", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getCurrentSeason",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getDissolved",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getExecutors",
    "outputs": [{"internalType": "address[]", "name": "", "type": "address[]"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "fid", "type": "uint256"}],
    "name": "getFidAllocation",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "fid", "type": "uint256"}],
    "name": "getFidAllocationRemaining",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "fid", "type": "uint256"}],
    "name": "getFidAllocationSpent",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "fid", "type": "uint256"}],
    "name": "getFidEarnings",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "fid", "type": "uint256"}],
    "name": "getFidEarningsClaimed",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "fid", "type": "uint256"}],
    "name": "getFidEarningsUnclaimed",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "uint256", "name": "fid", "type": "uint256"}],
    "name": "getNumFidCasts",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// Configuration
const DEFAULT_RPC_URL = 'https://base.llamarpc.com';
const CONTRACT_ADDRESS = '0x1aABa4E64d9F1363A0ebD87cee2622e7782D6e60';

// Initialize ethers provider and contract
let provider, contract;

// Function to get RPC URL from storage or use default
async function getRpcUrl() {
  return new Promise((resolve) => {
    chrome.storage.local.get(['customRpcUrl'], (result) => {
      resolve(result.customRpcUrl || DEFAULT_RPC_URL);
    });
  });
}

// Initialize ethers
async function initializeEthers() {
  try {
    const rpcUrl = await getRpcUrl();
    provider = new ethers.providers.JsonRpcProvider(rpcUrl);
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
    console.log('Ethers initialized successfully with RPC:', rpcUrl);
    return true;
  } catch (error) {
    console.error('Failed to initialize ethers:', error);
    return false;
  }
}

// Utility functions
function formatWei(weiValue) {
  try {
    // Handle BigNumber objects directly
    let wei;
    if (ethers.BigNumber.isBigNumber(weiValue)) {
      wei = weiValue;
    } else {
      // Convert string to BigNumber, handling scientific notation
      const weiString = weiValue.toString();
      wei = ethers.BigNumber.from(weiString);
    }
    const ether = ethers.utils.formatEther(wei);
    return parseFloat(ether).toLocaleString();
  } catch (error) {
    console.error('Error formatting wei value:', error, 'Value:', weiValue);
    return '0';
  }
}

// Contract reader class
class ContractReader {
  constructor(contract) {
    this.contract = contract;
  }

  async getFidAllocation(fid) {
    try {
      const result = await this.contract.getFidAllocation(fid);
      return result.toString();
    } catch (error) {
      console.error('Error getting FID allocation:', error);
      throw error;
    }
  }

  async getFidAllocationRemaining(fid) {
    try {
      const result = await this.contract.getFidAllocationRemaining(fid);
      return result.toString();
    } catch (error) {
      console.error('Error getting FID allocation remaining:', error);
      throw error;
    }
  }

  async getFidAllocationSpent(fid) {
    try {
      const result = await this.contract.getFidAllocationSpent(fid);
      return result.toString();
    } catch (error) {
      console.error('Error getting FID allocation spent:', error);
      throw error;
    }
  }

  async getFidEarnings(fid) {
    try {
      const result = await this.contract.getFidEarnings(fid);
      return result.toString();
    } catch (error) {
      console.error('Error getting FID earnings:', error);
      throw error;
    }
  }

  async getFidEarningsClaimed(fid) {
    try {
      const result = await this.contract.getFidEarningsClaimed(fid);
      return result.toString();
    } catch (error) {
      console.error('Error getting FID earnings claimed:', error);
      throw error;
    }
  }

  async getFidEarningsUnclaimed(fid) {
    try {
      const result = await this.contract.getFidEarningsUnclaimed(fid);
      return result.toString();
    } catch (error) {
      console.error('Error getting FID earnings unclaimed:', error);
      throw error;
    }
  }

  async getNumFidCasts(fid) {
    try {
      const result = await this.contract.getNumFidCasts(fid);
      return result.toString();
    } catch (error) {
      console.error('Error getting FID num casts:', error);
      throw error;
    }
  }

  async getFidInfo(fid) {
    try {
      const [
        allocation,
        allocationRemaining,
        allocationSpent,
        earnings,
        earningsClaimed,
        earningsUnclaimed,
        numCasts
      ] = await Promise.all([
        this.getFidAllocation(fid),
        this.getFidAllocationRemaining(fid),
        this.getFidAllocationSpent(fid),
        this.getFidEarnings(fid),
        this.getFidEarningsClaimed(fid),
        this.getFidEarningsUnclaimed(fid),
        this.getNumFidCasts(fid)
      ]);

      return {
        fid: fid,
        allocation: allocation,
        allocationRemaining: allocationRemaining,
        allocationSpent: allocationSpent,
        earnings: earnings,
        earningsClaimed: earningsClaimed,
        earningsUnclaimed: earningsUnclaimed,
        numCasts: numCasts
      };
    } catch (error) {
      console.error(`Error getting FID info for ${fid}:`, error);
      throw error;
    }
  }
}

// Function to create TipN widget
function createTipNWidget() {
  const widget = document.createElement('div');
  widget.id = 'tipn-widget';
  widget.innerHTML = `
    <div style="
      background: #1a1a1a;
      border: 1px solid #2a2a2a;
      border-radius: 12px;
      padding: 16px;
      margin: 16px 0;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    ">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
        <div style="display: flex; align-items: center;">
          <div style="
            width: 32px;
            height: 32px;
            border-radius: 8px;
            margin-right: 12px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <img src="${chrome.runtime.getURL('img/logo.gif')}" 
                 alt="TipN Logo" 
                 style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
          </div>
          <h3 style="margin: 0; font-size: 18px; font-weight: 600; color: #ffffff;">TipN Tracker</h3>
        </div>
        <button id="tipn-refresh-btn" style="
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #ff6b35, #f7931e);
          border: none;
          border-radius: 6px;
          color: white;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          outline: none;
          display: flex;
          align-items: center;
          justify-content: center;
        " title="Refresh data">↻</button>
      </div>
      
      <div id="tipn-loading" style="
        text-align: center;
        padding: 16px;
        display: none;
        font-size: 14px;
        color: #cccccc;
      ">
        <div style="
          border: 2px solid #2a2a2a;
          border-top: 2px solid #ff6b35;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
          margin: 0 auto 12px;
        "></div>
        Loading...
      </div>
      
      <div id="tipn-results" style="display: none; margin-top: 16px;">
        <div style="
          font-size: 14px; 
          font-weight: 600; 
          color: #ffffff; 
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 1px solid #2a2a2a;
        ">Results</div>
        <div id="tipn-result-content" style="
          font-size: 13px; 
          line-height: 1.5;
          color: #cccccc;
        "></div>
      </div>
      
      <div id="tipn-error" style="
        background: rgba(255, 59, 48, 0.1);
        border: 1px solid rgba(255, 59, 48, 0.3);
        border-radius: 8px;
        padding: 12px;
        margin-top: 12px;
        font-size: 13px;
        color: #ff6b6b;
        display: none;
      "></div>
      
      <div id="tipn-no-fid" style="
        text-align: center;
        padding: 16px;
        color: #666666;
        font-size: 13px;
      ">
        <div style="margin-bottom: 8px;">No default FID set</div>
        <div style="font-size: 12px; opacity: 0.8;">Click the extension icon to set your FID</div>
      </div>
    </div>
    
    <style>
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.7; }
        100% { opacity: 1; }
      }
      
      #tipn-refresh-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);
      }
      
      #tipn-refresh-btn:active {
        transform: scale(1);
      }
      
      #tipn-refresh-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
        box-shadow: none;
      }
    </style>
  `;
  
  return widget;
}

// Function to inject TipN widget into sidebar
function injectTipNWidget() {
  const sidebarSelector = "#root > div.mx-auto.min-h-full.xl\\:container > div > aside.max-w-\\[393px\\].grow > div.sticky.top-0.hidden.h-screen.shrink-0.grow.flex-col.pt-3.mdlg\\:flex.mdlg\\:max-w-\\[393px\\]";
  
  const sidebar = document.querySelector(sidebarSelector);
  if (sidebar) {
    // Check if widget already exists
    if (document.getElementById('tipn-widget')) {
      return;
    }
    
    const widget = createTipNWidget();
    sidebar.appendChild(widget);
    
    // Add event listeners
    const refreshBtn = document.getElementById('tipn-refresh-btn');
    const loading = document.getElementById('tipn-loading');
    const results = document.getElementById('tipn-results');
    const error = document.getElementById('tipn-error');
    const resultContent = document.getElementById('tipn-result-content');
    const noFidMessage = document.getElementById('tipn-no-fid');
    
    // Load default FID from storage
    chrome.storage.local.get(['defaultFid'], (result) => {
      if (result.defaultFid) {
        noFidMessage.style.display = 'none';
        
        // Lookup function
        async function lookupFid() {
          const fid = result.defaultFid;
          
          if (!fid || isNaN(fid) || parseInt(fid) <= 0) {
            showError('No valid FID found in storage. Please set your FID in the extension settings. or try refreshing the page.');
            return;
          }
          
          showLoading();
          hideError();
          
          try {
            const data = await reader.getFidInfo(parseInt(fid));
            displayResults(data);
          } catch (err) {
            console.error('Error looking up FID:', err);
            showError(`Failed to load FID data: ${err.message}`);
          } finally {
            hideLoading();
          }
        }
        
        // Initial lookup on load
        lookupFid();

        // Refresh button listener
        refreshBtn.addEventListener('click', lookupFid);
      } else {
        noFidMessage.style.display = 'block';
      }
    });
    
    function showLoading() {
      loading.style.display = 'block';
      results.style.display = 'none';
      error.style.display = 'none';
      refreshBtn.disabled = true;
    }
    
    function hideLoading() {
      loading.style.display = 'none';
      refreshBtn.disabled = false;
    }
    
    function showError(message) {
      error.textContent = message;
      error.style.display = 'block';
      hideLoading();
    }
    
    function hideError() {
      error.style.display = 'none';
    }
    
    function displayResults(data) {
      // Calculate allocation progress percentages using BigNumber for precision
      const allocation = ethers.BigNumber.from(data.allocation);
      const remaining = ethers.BigNumber.from(data.allocationRemaining);
      const spent = allocation.sub(remaining);
      
      // Convert to percentages, handling division properly
      let remainingPercentage = 0;
      if (allocation.gt(0)) {
        // Use BigNumber division and convert to percentage
        const percentage = remaining.mul(100).div(allocation);
        remainingPercentage = percentage.toNumber();
      }
      
      // Calculate earnings progress percentages
      const earnings = ethers.BigNumber.from(data.earnings);
      const unclaimed = ethers.BigNumber.from(data.earningsUnclaimed);
      const claimed = earnings.sub(unclaimed);
      
      let unclaimedPercentage = 0;
      if (earnings.gt(0)) {
        const percentage = unclaimed.mul(100).div(earnings);
        unclaimedPercentage = percentage.toNumber();
      }
      
      // Check if unclaimed earnings are increasing
      const storageKey = `tipn_unclaimed_${data.fid}`;
      let unclaimedIncreasing = false;
      let unclaimedChange = '0';
      
      chrome.storage.local.get([storageKey], (result) => {
        const previousUnclaimed = result[storageKey];
        
        if (previousUnclaimed) {
          const previous = ethers.BigNumber.from(previousUnclaimed);
          const current = unclaimed;
          
          if (current.gt(previous)) {
            unclaimedIncreasing = true;
            const increase = current.sub(previous);
            unclaimedChange = formatWei(increase.toString());
          }
        }
        
        // Save current unclaimed amount for next comparison
        chrome.storage.local.set({ [storageKey]: data.earningsUnclaimed });
        
        // Update the display with the increase indicator
        updateEarningsDisplay(unclaimedIncreasing, unclaimedChange);
      });
      
      function updateEarningsDisplay(increasing, change) {
        const earningsSection = document.querySelector('#tipn-earnings-section');
        if (earningsSection) {
          const increaseIndicator = increasing ? `
            <div style="
              background: rgba(76, 175, 80, 0.2);
              border: 1px solid rgba(76, 175, 80, 0.3);
              border-radius: 6px;
              padding: 6px 8px;
              margin-top: 6px;
              font-size: 11px;
              color: #4CAF50;
              text-align: center;
              animation: pulse 2s infinite;
            ">
              📈 +${change} since last check
            </div>
          ` : '';
          
          earningsSection.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="color: #666666; font-size: 12px;">Earnings</span>
              <span style="color: #ffffff; font-weight: 500; font-size: 12px;">${formatWei(data.earnings)} total</span>
            </div>
            <div style="
              width: 100%;
              height: 8px;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 4px;
              overflow: hidden;
              position: relative;
            ">
              <div style="
                width: ${unclaimedPercentage}%;
                height: 100%;
                background: linear-gradient(90deg, #FFD700, #FFA500);
                border-radius: 4px;
                transition: width 0.3s ease;
              "></div>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 4px;">
              <span style="color: #FFD700; font-size: 11px;">Unclaimed: ${formatWei(data.earningsUnclaimed)}</span>
              <span style="color: #87CEEB; font-size: 11px;">Claimed: ${formatWei(claimed.toString())}</span>
            </div>
            ${increaseIndicator}
          `;
        }
      }
      
      resultContent.innerHTML = `
        <div style="margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="color: #666666; font-size: 12px;">Allocation</span>
            <span style="color: #ffffff; font-weight: 500; font-size: 12px;">${formatWei(data.allocation)} total</span>
          </div>
          <div style="
            width: 100%;
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            overflow: hidden;
            position: relative;
          ">
            <div style="
              width: ${remainingPercentage}%;
              height: 100%;
              background: linear-gradient(90deg, #4CAF50, #45a049);
              border-radius: 4px;
              transition: width 0.3s ease;
            "></div>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 4px;">
            <span style="color: #4CAF50; font-size: 11px;">Remaining: ${formatWei(data.allocationRemaining)}</span>
            <span style="color: #ff6b35; font-size: 11px;">Spent: ${formatWei(spent.toString())}</span>
          </div>
        </div>
        
        <div id="tipn-earnings-section" style="margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
            <span style="color: #666666; font-size: 12px;">Earnings Progress</span>
            <span style="color: #ffffff; font-weight: 500; font-size: 12px;">${formatWei(data.earnings)} total</span>
          </div>
          <div style="
            width: 100%;
            height: 8px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 4px;
            overflow: hidden;
            position: relative;
          ">
            <div style="
              width: ${unclaimedPercentage}%;
              height: 100%;
              background: linear-gradient(90deg, #FFD700, #FFA500);
              border-radius: 4px;
              transition: width 0.3s ease;
            "></div>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 4px;">
            <span style="color: #FFD700; font-size: 11px;">Unclaimed: ${formatWei(data.earningsUnclaimed)}</span>
            <span style="color: #87CEEB; font-size: 11px;">Claimed: ${formatWei(claimed.toString())}</span>
          </div>
        </div>
      `;
      results.style.display = 'block';
    }
    
    // Event listeners
    // The input.addEventListener('keypress', ...) and button.addEventListener('click', lookupFid)
    // are removed as per the new widget structure.
    
    console.log('TipN widget injected successfully');
  } else {
    console.log('Sidebar not found, retrying...');
    setTimeout(injectTipNWidget, 1000);
  }
}

// Initialize when ethers is loaded
async function initializeApp() {
  if (typeof ethers !== 'undefined') {
    if (await initializeEthers()) {
      reader = new ContractReader(contract);
      console.log('TipN app initialized successfully');
      injectTipNWidget();
    } else {
      console.error('Failed to initialize ethers library');
    }
  } else {
    // Wait for ethers to load
    setTimeout(initializeApp, 100);
  }
}

// Initialize the app when the page loads
function init() {
  // Wait for page to load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
    return;
  }
  
  // Start the app
  initializeApp();
}

// Start the content script
init();

// Handle dynamic content changes (SPA navigation)
const observer = new MutationObserver((mutations) => {
  // Re-inject widget if sidebar changes
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList') {
      const sidebarSelector = "#root > div.mx-auto.min-h-full.xl\\:container > div > aside.max-w-\\[393px\\].grow > div.sticky.top-0.hidden.h-screen.shrink-0.grow.flex-col.pt-3.mdlg\\:flex.mdlg\\:max-w-\\[393px\\]";
      const sidebar = document.querySelector(sidebarSelector);
      if (sidebar && !document.getElementById('tipn-widget')) {
        setTimeout(injectTipNWidget, 500);
      }
    }
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
