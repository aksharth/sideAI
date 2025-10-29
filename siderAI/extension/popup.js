document.addEventListener('DOMContentLoaded', () => {
  const openChatBtn = document.getElementById('openChatBtn');
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsSection = document.getElementById('settingsSection');
  const saveKeysBtn = document.getElementById('saveKeysBtn');
  const saveStatus = document.getElementById('saveStatus');
  
  const openaiKeyInput = document.getElementById('openaiKey');
  const geminiKeyInput = document.getElementById('geminiKey');
  const claudeKeyInput = document.getElementById('claudeKey');
  
  openChatBtn.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.tabs.sendMessage(tab.id, { type: 'TOGGLE_PANEL' });
    window.close();
  });
  
  settingsBtn.addEventListener('click', () => {
    const isVisible = settingsSection.style.display !== 'none';
    settingsSection.style.display = isVisible ? 'none' : 'block';
    
    if (!isVisible) {
      loadAPIKeys();
    }
  });
  
  saveKeysBtn.addEventListener('click', () => {
    const openaiKey = openaiKeyInput.value.trim();
    const geminiKey = geminiKeyInput.value.trim();
    const claudeKey = claudeKeyInput.value.trim();
    
    chrome.storage.sync.set({
      openai_key: openaiKey,
      gemini_key: geminiKey,
      claude_key: claudeKey
    }, () => {
      saveStatus.style.display = 'block';
      setTimeout(() => {
        saveStatus.style.display = 'none';
      }, 2000);
    });
  });
  
  function loadAPIKeys() {
    chrome.storage.sync.get(['openai_key', 'gemini_key', 'claude_key'], (result) => {
      if (result.openai_key) {
        openaiKeyInput.value = result.openai_key;
      }
      if (result.gemini_key) {
        geminiKeyInput.value = result.gemini_key;
      }
      if (result.claude_key) {
        claudeKeyInput.value = result.claude_key;
      }
    });
  }
});

