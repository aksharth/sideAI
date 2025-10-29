document.addEventListener('DOMContentLoaded', () => {
  const openai = document.getElementById('openaiKey');
  const gemini = document.getElementById('geminiKey');
  const claude = document.getElementById('claudeKey');
  const saveBtn = document.getElementById('saveBtn');
  const success = document.getElementById('success');

  chrome.storage.sync.get(['openai_key', 'gemini_key', 'claude_key'], (r) => {
    if (r.openai_key) openai.value = r.openai_key;
    if (r.gemini_key) gemini.value = r.gemini_key;
    if (r.claude_key) claude.value = r.claude_key;
  });

  saveBtn.addEventListener('click', () => {
    saveBtn.disabled = true;
    chrome.storage.sync.set({
      openai_key: openai.value.trim(),
      gemini_key: gemini.value.trim(),
      claude_key: claude.value.trim()
    }, () => {
      success.style.display = 'block';
      setTimeout(() => { success.style.display = 'none'; }, 1500);
      saveBtn.disabled = false;
    });
  });
});

