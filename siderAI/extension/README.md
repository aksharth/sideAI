# SiderAI Chrome Extension

A Chrome extension that allows you to chat with multiple AI models (ChatGPT, Gemini, Claude) directly from any webpage, similar to Sider.ai.

## Features

- 🚀 Right-side chat panel that slides in from the right
- 🤖 Support for multiple AI models:
  - ChatGPT / GPT-4
  - Google Gemini
  - Claude (Anthropic)
- 💬 Real-time chat interface
- 🎨 Modern, clean UI design
- ⚙️ Easy API key management via popup settings

## Installation

1. **Prepare Icons**
   - Add icons to the `icons/` folder:
     - `icon16.png` (16x16)
     - `icon48.png` (48x48)
     - `icon128.png` (128x128)

2. **Load Extension in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top-right)
   - Click "Load unpacked"
   - Select the `extension/` folder from this project

3. **Set API Keys**
   - Click the extension icon in Chrome toolbar
   - Click "Settings"
   - Enter your API keys:
     - **OpenAI**: Get from https://platform.openai.com/api-keys
     - **Gemini**: Get from https://makersuite.google.com/app/apikey
     - **Claude**: Get from https://console.anthropic.com/
   - Click "Save API Keys"

## Usage

1. **Open Chat Panel**
   - Click the extension icon in Chrome toolbar
   - Click "Open Chat Panel"
   - Or click the extension icon again to toggle the panel

2. **Select AI Model**
   - Choose your preferred AI model from the dropdown

3. **Start Chatting**
   - Type your message in the input box
   - Press Enter or click the send button
   - View responses in the chat window

## File Structure

```
extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for API calls
├── content.js            # Content script that injects the panel
├── content.css           # Styling for the chat panel
├── popup.html            # Extension popup UI
├── popup.js              # Popup functionality
├── icons/                # Extension icons
└── README.md             # This file
```

## Development

The extension uses:
- Manifest V3 (latest Chrome extension format)
- Vanilla JavaScript (no frameworks required)
- Chrome Storage API for API key management
- Chrome Runtime API for messaging

## API Requirements

- **OpenAI API**: Requires a paid account with API credits
- **Gemini API**: Free tier available
- **Claude API**: Requires API access (may require waitlist)

## Security Notes

- API keys are stored securely in Chrome's sync storage
- All API calls are made from the background service worker
- No data is collected or sent to third parties (except the selected AI service)

## Troubleshooting

- **Panel doesn't open**: Refresh the page and try again
- **API errors**: Verify your API keys are correct in Settings
- **No response**: Check your API key has credits/permissions

## License

MIT

