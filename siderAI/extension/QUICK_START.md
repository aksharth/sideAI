# Quick Start - Fix the Error

## The Problem
You're loading the **WRONG FOLDER**. Chrome needs to load the folder that contains `manifest.json` directly.

## Solution

### Step 1: Load the CORRECT Folder
When you click **"Load unpacked"** in Chrome:
- ❌ **DON'T** select: `C:\Users\DELL\Desktop\sider\sideAI\siderAI`
- ✅ **DO** select: `C:\Users\DELL\Desktop\sider\sideAI\siderAI\extension`

The `manifest.json` file is inside the `extension` folder, so that's the folder you must load!

### Step 2: Verify
After loading, you should see:
- The extension appears in your extensions list
- No error messages
- The extension name: "SiderAI Chat Assistant"

### Step 3: Generate Icons (Optional but Recommended)
1. Open `create-icons.html` in your browser
2. Click "Generate & Download All"
3. Save the 3 PNG files to the `extension/icons/` folder
4. Reload the extension in Chrome

## Path Reference
```
C:\Users\DELL\Desktop\sider\sideAI\siderAI\extension\    ← LOAD THIS FOLDER
├── manifest.json   ← Chrome looks for this file
├── background.js
├── content.js
├── content.css
└── popup.html
```

