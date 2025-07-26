# TipN Chrome Extension - Release Notes

## Version 1.7.0 - "Dark Theme & Animated Logos"

**Release Date**: 7 2025  
**Author**: XppaiCyber  
**Repository**: [https://github.com/XppaiCyberr/tipnExt](https://github.com/XppaiCyberr/tipnExt)

---

## 🎉 What's New

### ✨ Major Features
- **Dark Theme UI**: Complete redesign with sleek dark interface matching Farcaster.xyz
- **Animated Logos**: Beautiful animated GIF logos for both popup and widget
- **Enhanced Widget Integration**: Seamless sidebar integration on Farcaster.xyz
- **Progress Indicators**: Visual progress bars for allocation and earnings tracking
- **Earnings Increase Alerts**: Real-time notifications when unclaimed earnings increase

### 🎨 UI/UX Improvements
- **Consistent Design Language**: Unified dark theme across popup and widget
- **Modern Typography**: Improved font hierarchy and readability
- **Smooth Animations**: Hover effects, transitions, and loading states
- **Better Contrast**: Enhanced accessibility with proper color contrast
- **Responsive Layout**: Optimized for different screen sizes

### 🔧 Technical Enhancements
- **Updated Manifest**: Manifest v3 with proper permissions and web accessible resources
- **Improved Error Handling**: Better error messages and recovery
- **Enhanced Storage**: Persistent settings with Chrome storage API
- **RPC Configuration**: Support for custom RPC endpoints
- **Performance Optimizations**: Faster loading and data fetching

---

## 📋 Feature Details

### Dark Theme Implementation
- **Background**: `#1a1a1a` with `#2a2a2a` borders
- **Text Colors**: `#ffffff` (primary), `#cccccc` (secondary), `#666666` (tertiary)
- **Accent Colors**: Orange gradient (`#ff6b35` to `#f7931e`) for buttons and highlights
- **Progress Bars**: Green for allocation, gold for earnings

### Animated Logos
- **Widget Logo**: `logo.gif` - Animated logo in the Farcaster.xyz sidebar
- **Popup Logo**: `popup.gif` - Animated logo in the extension popup
- **Optimized Sizes**: 32x32 pixels for optimal display
- **Web Accessible**: Properly declared in manifest.json

### Smart Contract Integration
- **Contract Address**: `0x1aABa4E64d9F1363A0ebD87cee2622e7782D6e60`
- **Network**: Base Mainnet
- **Default RPC**: `https://base.llamarpc.com`
- **Data Fetched**:
  - FID Allocation (total, remaining, spent)
  - Earnings (total, claimed, unclaimed)
  - Cast count and other metrics

### Widget Features
- **Real-time Updates**: Click refresh button to update data
- **Progress Visualization**: Visual bars showing allocation and earnings progress
- **Increase Indicators**: Notifications when earnings increase
- **Error States**: Clear error messages and loading indicators
- **Responsive Design**: Adapts to sidebar width

---

## 🚀 Installation

### For Users
1. Download the extension files
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode"
4. Click "Load unpacked" and select the extension folder
5. Click the TipN icon to configure your FID

### For Developers
1. Clone the repository: `git clone https://github.com/XppaiCyberr/tipnExt.git`
2. Load as unpacked extension in Chrome
3. Make changes and reload the extension

---

## 🔧 Configuration

### Setting Default FID
1. Click the TipN extension icon
2. Enter your Farcaster ID (FID)
3. Click "Save Default FID"
4. Visit Farcaster.xyz to see your widget

### Custom RPC Configuration
- **Default**: `https://base.llamarpc.com`
- **Alternative**: `https://base-mainnet.g.alchemy.com/v2/YOUR_API_KEY`
- **Benefits**: Better performance and reliability

---

## 📁 File Structure

```
tipnExt/
├── manifest.json          # Extension manifest (v3)
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
├── README.md             # Project documentation
└── RELEASE_NOTES.md      # This file
```

---

## 🐛 Bug Fixes

- **Fixed logo display**: Resolved broken image issues with proper web accessible resources
- **Improved error handling**: Better error messages and recovery mechanisms
- **Enhanced loading states**: Clear loading indicators and progress feedback
- **Fixed manifest permissions**: Proper declaration of web accessible resources

---

## 🔄 Migration from Previous Versions

### Breaking Changes
- **Theme Change**: Complete UI redesign from gradient to dark theme
- **Logo Update**: Replaced static "T" with animated GIF logos
- **Manifest Updates**: Updated to include image resources

### Migration Steps
1. Uninstall previous version
2. Install v1.7.0
3. Reconfigure your FID and RPC settings
4. Enjoy the new dark theme and animated logos

---

## 🎯 Known Issues

- **RPC Rate Limiting**: Some RPC endpoints may have rate limits
- **Network Dependencies**: Requires internet connection for data fetching
- **Browser Compatibility**: Tested on Chrome, may work on other Chromium-based browsers

---

## 🔮 Future Roadmap

### Planned Features
- **Multiple FID Support**: Track multiple Farcaster IDs
- **Historical Data**: View allocation and earnings history
- **Notifications**: Browser notifications for earnings increases
- **Export Data**: Export tracking data to CSV/JSON
- **Mobile Support**: PWA version for mobile devices

### Technical Improvements
- **Caching**: Implement data caching for better performance
- **Offline Support**: Basic offline functionality
- **Analytics**: Usage analytics and performance monitoring
- **Testing**: Comprehensive test suite

---

## 🤝 Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

### Development Setup
```bash
git clone https://github.com/XppaiCyberr/tipnExt.git
cd tipnExt
# Load as unpacked extension in Chrome
```

---

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/XppaiCyberr/tipnExt/issues)
- **Documentation**: Check the [README.md](README.md) for detailed information
- **Community**: Join the Farcaster community for discussions

---

## 📄 License

This project is licensed under the CC0-1.0 License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Farcaster Community**: For inspiration and feedback
- **Base Network**: For the blockchain infrastructure
- **Ethers.js**: For the Ethereum library
- **Chrome Extension APIs**: For the extension framework

---

*Built with ❤️ for the Farcaster community by XppaiCyber*

**Download**: [GitHub Releases](https://github.com/XppaiCyberr/tipnExt/releases)  
**Source**: [GitHub Repository](https://github.com/XppaiCyberr/tipnExt) 