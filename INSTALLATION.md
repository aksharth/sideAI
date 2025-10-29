# SiderAI Chrome Extension - Installation Guide

## Quick Start

### Step 1: Generate Icons
1. Open `siderAI/extension/create-icons.html` in your browser
2. Click "Generate & Download All" to create placeholder icons
3. Move the downloaded icons (`icon16.png`, `icon48.png`, `icon128.png`) to `siderAI/extension/icons/` folder

### Step 2: Load Extension in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top-right corner)
3. Click **"Load unpacked"**
4. Navigate to and select the `siderAI/extension/` folder
5. The extension should now appear in your extensions list

### Step 3: Set Up API Keys
1. Click the SiderAI extension icon in Chrome toolbar
2. Click **"Settings"** button
3. Enter your API keys:
   - **OpenAI API Key**: Get from [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - **Gemini API Key**: Get from [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
   - **Claude API Key**: Get from [console.anthropic.com](https://console.anthropic.com/)
4. Click **"Save API Keys"**

### Step 4: Start Chatting!
1. Visit any website
2. Click the SiderAI extension icon
3. Click **"Open Chat Panel"**
4. The chat panel will slide in from the right
5. Select an AI model and start chatting!

## Features

✅ **Right-side Chat Panel** - Slides in smoothly from the right
✅ **Multiple AI Models** - ChatGPT, GPT-4, Gemini, Claude
✅ **Modern UI** - Clean, responsive design similar to Sider.ai
✅ **Secure** - API keys stored locally in Chrome sync storage
✅ **Easy Toggle** - Click extension icon to open/close panel

## Troubleshooting

### Panel doesn't appear
- Refresh the webpage
- Check that the extension is enabled in `chrome://extensions/`
- Make sure you clicked "Open Chat Panel" from the popup

### API errors
- Verify your API keys are correct in Settings
- Check that your API keys have available credits
- For OpenAI, ensure you have a paid account with credits

### Icons missing
- Make sure `icon16.png`, `icon48.png`, and `icon128.png` exist in `extension/icons/` folder
- Use `create-icons.html` to generate placeholder icons

## File Structure

```
siderAI/
└── extension/
    ├── manifest.json          # Extension configuration
    ├── background.js          # Service worker (handles API calls)
    ├── content.js            # Injects chat panel on web pages
    ├── content.css           # Chat panel styles
    ├── popup.html            # Extension popup UI
    ├── popup.js              # Popup logic
    ├── create-icons.html     # Icon generator tool
    ├── icons/                # Extension icons (add your icons here)
    │   ├── icon16.png
    │   ├── icon48.png
    │   └── icon128.png
    └── README.md             # Extension documentation
```

## Development

The extension uses:
- **Manifest V3** (latest Chrome extension standard)
- **Vanilla JavaScript** (no build process required)
- **Chrome Storage API** for secure key storage
- **Chrome Runtime Messaging** for communication

## Next Steps

- Customize the UI colors and styling in `content.css`
- Add more AI models by extending `background.js`
- Enhance features like chat history, export, etc.

## Support

For issues or questions, refer to the extension's README.md file.

