# TipN - $TIPN Tracker Chrome Extension

A Chrome extension that allows you to track your $TIPN allocations and earnings on the Base network directly from Farcaster.xyz.

## Screenshot
<img width="1136" height="300" alt="{8E613D6D-F634-40C1-9F67-B7A86BFB60B9}" src="https://github.com/user-attachments/assets/d8225474-f2c8-4a9a-9998-0430d32f8fdf" />

### Popup setting
<img width="464" height="611" alt="{B434D112-43D9-4178-96FB-9520E7B1573A}" src="https://github.com/user-attachments/assets/4fa764e2-2e30-4564-bfbd-b89d08975393" />


## Features

- **Dark Theme UI**: Modern, sleek dark interface that matches Farcaster.xyz
- **Embedded Widget**: Seamlessly integrated into the Farcaster.xyz sidebar
- **Real-time Tracking**: Monitor your allocation progress and earnings
- **Custom RPC Support**: Configure your own RPC endpoint for better performance
- **Persistent Settings**: Your FID and RPC preferences are saved across sessions
- **Animated Logo**: Beautiful animated logo in both popup and widget
- **Progress Indicators**: Visual progress bars for allocation and earnings
- **Earnings Tracking**: Monitor claimed vs unclaimed earnings with increase indicators

## Installation

### Method 1: Load as Unpacked Extension (Development)

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right corner
3. Click "Load unpacked" and select the `tipnExt` folder
4. The extension should now appear in your extensions list

### Method 2: From Source

1. Clone or download this repository
2. Follow the steps in Method 1 to load the extension
3. The extension includes all necessary files and assets

## Usage

### Initial Setup

1. Click the TipN extension icon in your Chrome toolbar
2. Enter your Farcaster ID (FID) in the settings popup
3. Optionally configure a custom RPC URL for better performance
4. Click "Save Default FID" to save your settings

### Using the Widget

1. Visit [Farcaster.xyz](https://farcaster.xyz)
2. Look for the TipN widget in the sidebar
3. Click the refresh button (↻) to update your data
4. View your allocation progress and earnings information

### Widget Features

- **Allocation Progress**: See how much of your allocation you've used
- **Earnings Tracking**: Monitor your total, claimed, and unclaimed earnings
- **Increase Indicators**: Get notified when your unclaimed earnings increase
- **Real-time Updates**: Refresh data with a single click

## Technical Details

- **Network**: Base Mainnet
- **Contract**: `0x1aABa4E64d9F1363A0ebD87cee2622e7782D6e60`
- **Default RPC**: `https://base.llamarpc.com`
- **Manifest Version**: 3
- **Framework**: Vanilla JavaScript with ethers.js

## Files Structure

```
tipnFinalFinal/
├── manifest.json          # Extension manifest
├── popup.html            # Settings popup interface
├── popup.js              # Popup functionality
├── background.js         # Background service worker
├── content.js            # Content script for Farcaster.xyz
├── ethers.js             # Ethers.js library (local copy)
├── icons/
│   └── favicon.png       # Extension icon
├── img/
│   ├── logo.gif          # Widget logo (animated)
│   ├── popup.gif         # Popup logo (animated)
│   └── original.webp     # Original logo
└── README.md            # This file
```

## Smart Contract Integration

The extension interacts with the TipN smart contract to fetch:

- **FID Allocation**: Total allocation amount for your FID
- **Allocation Remaining**: How much allocation you have left
- **Allocation Spent**: How much allocation you've used
- **Total Earnings**: Your total earnings from the contract
- **Claimed Earnings**: Earnings you've already claimed
- **Unclaimed Earnings**: Earnings available to claim
- **Cast Count**: Number of casts for your FID

## UI/UX Features

- **Dark Theme**: Consistent with Farcaster.xyz design
- **Responsive Design**: Works on different screen sizes
- **Smooth Animations**: Hover effects and transitions
- **Progress Bars**: Visual representation of allocation and earnings
- **Error Handling**: Clear error messages and loading states
- **Accessibility**: Proper contrast and readable fonts

## Configuration Options

### Default FID
Set your primary Farcaster ID that the widget will track by default.

### Custom RPC URL
Configure a custom RPC endpoint for better performance:
- Default: `https://base.llamarpc.com`
- Alternative: `https://base-mainnet.g.alchemy.com/v2/YOUR_API_KEY`

## Development

### Key Technologies
- **Chrome Extension APIs**: Storage, messaging, and content scripts
- **Ethers.js**: Smart contract interactions
- **Vanilla JavaScript**: No framework dependencies
- **CSS3**: Modern styling with gradients and animations

### Building from Source
1. Clone the repository
2. Ensure all files are in the correct directory structure
3. Load as unpacked extension in Chrome
4. Make changes and reload the extension

## Troubleshooting

### Common Issues

**Widget not appearing on Farcaster.xyz:**
- Ensure the extension is enabled
- Refresh the Farcaster.xyz page
- Check browser console for errors

**Data not loading:**
- Verify your FID is set correctly
- Check your internet connection
- Try using a custom RPC URL

**Extension not loading:**
- Check that all files are present
- Verify manifest.json is valid
- Look for errors in chrome://extensions/

### Debug Mode
Open the browser console (F12) to see detailed logs and error messages.

## Contributing

This project is open source. Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## Author
**XppaiCyber**

