(function() {
  'use strict';
  
  let chatPanel = null;
  let isPanelOpen = false;
  
  function getPanelWidth() {
    if (window.innerWidth <= 768) {
      return window.innerWidth; // Full width on mobile
    } else if (window.innerWidth <= 1024) {
      return 320; // Smaller panel on tablets
    }
    return 380; // Default desktop width
  }
  
  function findAndAdjustContainers() {
    // Common container selectors
    const containerSelectors = [
      'main',
      '[class*="container"]',
      '[class*="wrapper"]',
      '[class*="content"]',
      '[class*="page"]',
      '[id*="container"]',
      '[id*="wrapper"]',
      '[id*="content"]',
      '[id*="main"]'
    ];
    
    const containers = [];
    containerSelectors.forEach(selector => {
      try {
        const elements = document.querySelectorAll(selector);
        elements.forEach(el => {
          const computedStyle = window.getComputedStyle(el);
          const maxWidth = computedStyle.maxWidth;
          const width = computedStyle.width;
          
          // Only adjust if element has a max-width or fixed width
          if (maxWidth && maxWidth !== 'none' && maxWidth !== '100%') {
            const originalMaxWidth = el.getAttribute('data-sider-original-maxwidth');
            if (!originalMaxWidth) {
              el.setAttribute('data-sider-original-maxwidth', maxWidth);
            }
            containers.push(el);
          } else if (width && width !== 'auto' && width !== '100%' && !width.includes('calc')) {
            const originalWidth = el.getAttribute('data-sider-original-width');
            if (!originalWidth) {
              el.setAttribute('data-sider-original-width', width);
            }
            containers.push(el);
          }
        });
      } catch (e) {
        // Ignore invalid selectors
      }
    });
    
    return containers;
  }
  
  function compressWebsite(compress) {
    const html = document.documentElement;
    const body = document.body;
    
    if (compress) {
      // Add class for additional CSS control
      html.classList.add('sider-panel-active');
      body.classList.add('sider-panel-active');
      
      // Adjust viewport width calculation by setting body width
      const panelWidth = getPanelWidth();
      const bodyWidth = window.innerWidth - panelWidth;
      body.style.width = `${bodyWidth}px`;
      body.style.maxWidth = `${bodyWidth}px`;
      body.style.transition = 'width 0.3s ease-in-out, max-width 0.3s ease-in-out';
      
      // Also set margin-right for overflow content
      html.style.marginRight = `${panelWidth}px`;
      html.style.transition = 'margin-right 0.3s ease-in-out';
      
      // Update panel width if needed
      if (chatPanel) {
        chatPanel.style.width = `${panelWidth}px`;
      }
      
      // Find and adjust all container elements
      const containers = findAndAdjustContainers();
      containers.forEach(container => {
        const originalMaxWidth = container.getAttribute('data-sider-original-maxwidth');
        const originalWidth = container.getAttribute('data-sider-original-width');
        
        // Mark as adjusted
        container.setAttribute('data-sider-adjusted', 'true');
        
        if (originalMaxWidth) {
          // Parse and reduce max-width
          if (originalMaxWidth.includes('px')) {
            const val = parseFloat(originalMaxWidth);
            if (!isNaN(val) && val > 400) {
              const newMaxWidth = Math.max(300, val - panelWidth);
              container.style.maxWidth = `${newMaxWidth}px`;
              container.style.transition = 'max-width 0.3s ease-in-out';
            }
          } else if (originalMaxWidth.includes('%')) {
            // For percentage-based, use calc
            container.style.maxWidth = `calc(${originalMaxWidth} - ${panelWidth}px)`;
            container.style.transition = 'max-width 0.3s ease-in-out';
          } else if (originalMaxWidth.includes('rem') || originalMaxWidth.includes('em')) {
            // For rem/em, calculate based on viewport
            const val = parseFloat(originalMaxWidth);
            if (!isNaN(val)) {
              const fontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize) || 16;
              const pxValue = val * fontSize;
              if (pxValue > 400) {
                const newValue = Math.max(18.75, val - (panelWidth / fontSize));
                container.style.maxWidth = `${newValue}${originalMaxWidth.includes('rem') ? 'rem' : 'em'}`;
                container.style.transition = 'max-width 0.3s ease-in-out';
              }
            }
          }
        }
        
        if (originalWidth && !originalMaxWidth) {
          // Similar logic for fixed width
          if (originalWidth.includes('px')) {
            const val = parseFloat(originalWidth);
            if (!isNaN(val) && val > 400) {
              const newWidth = Math.max(300, val - panelWidth);
              container.style.width = `${newWidth}px`;
              container.style.transition = 'width 0.3s ease-in-out';
            }
          } else if (originalWidth.includes('%')) {
            container.style.width = `calc(${originalWidth} - ${panelWidth}px)`;
            container.style.transition = 'width 0.3s ease-in-out';
          }
        }
        
        // Ensure container fills available space if it's too small
        const containerWidth = container.offsetWidth;
        const parentWidth = container.parentElement ? container.parentElement.offsetWidth : bodyWidth;
        
        if (containerWidth < parentWidth - 100 && originalMaxWidth && !originalMaxWidth.includes('%')) {
          // Only override if original wasn't percentage-based
          container.style.maxWidth = '100%';
        }
      });
      
    } else {
      // Remove class and reset styles completely
      html.classList.remove('sider-panel-active');
      body.classList.remove('sider-panel-active');
      
      // Force remove all inline styles related to compression
      body.style.removeProperty('width');
      body.style.removeProperty('max-width');
      body.style.removeProperty('margin-right');
      html.style.removeProperty('margin-right');
      html.style.removeProperty('overflow-x');
      body.style.removeProperty('overflow-x');
      
      // Reset all container elements
      const containers = document.querySelectorAll('[data-sider-original-maxwidth], [data-sider-original-width]');
      containers.forEach(container => {
        const originalMaxWidth = container.getAttribute('data-sider-original-maxwidth');
        const originalWidth = container.getAttribute('data-sider-original-width');
        
        if (originalMaxWidth) {
          container.style.maxWidth = originalMaxWidth;
          container.removeAttribute('data-sider-original-maxwidth');
        } else {
          // If no original was saved, just remove the style
          container.style.removeProperty('max-width');
        }
        
        if (originalWidth) {
          container.style.width = originalWidth;
          container.removeAttribute('data-sider-original-width');
        } else {
          // If no original was saved, just remove the style
          container.style.removeProperty('width');
        }
        
        container.removeAttribute('data-sider-adjusted');
        container.style.removeProperty('transition');
      });
      
      // Force a layout recalculation to ensure styles are applied
      void body.offsetHeight;
    }
  }
  
  function createChatPanel() {
    if (chatPanel) {
      return chatPanel;
    }
    
    const panel = document.createElement('div');
    panel.id = 'sider-ai-chat-panel';
    panel.innerHTML = `
      <div class="sider-panel-container">
        <div class="sider-panel-header">
          <div class="sider-panel-title">
            <span>Sider: Chat with all AI</span>
            <div class="sider-panel-controls">
              <button class="sider-btn-toggle" id="sider-toggle-btn" title="Collapse/Expand">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18L15 12L9 6"/>
                </svg>
              </button>
              <button class="sider-btn-close" id="sider-close-btn" title="Close">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div class="sider-panel-body" id="sider-panel-body">
          <div class="sider-welcome">
            <h3>Hi,</h3>
            <p>How can I assist you today?</p>
            
            <div class="sider-action-buttons">
              <button class="sider-action-btn" data-action="fullscreen">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <path d="M7 8h10M7 12h10M7 16h8"/>
                </svg>
                <span>Full Screen Chat</span>
              </button>
              <button class="sider-action-btn" data-action="research">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="22"/>
                  <line x1="8" y1="22" x2="16" y2="22"/>
                </svg>
                <span>Deep Research</span>
              </button>
              <button class="sider-action-btn" data-action="highlights">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
                </svg>
                <span>My Highlights</span>
              </button>
              <button class="sider-action-btn" data-action="slides">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="14" rx="2" ry="2"/>
                  <line x1="8" y1="21" x2="16" y2="21"/>
                  <line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
                <span>AI Slides</span>
              </button>
            </div>
            
          </div>
          
          <div class="sider-chat-container" id="sider-chat-container" style="display: none;">
            <div class="sider-chat-messages" id="sider-chat-messages"></div>
          </div>
        </div>
        
        <div class="sider-panel-footer">
          <div class="sider-input-wrapper">
            <div class="sider-toolbar">
              <button class="sider-toolbar-btn sider-ai-selector-btn" id="sider-ai-selector-btn" title="Select AI Model">
                <div class="sider-ai-selector-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="#3b82f6"/>
                    <circle cx="12" cy="12" r="6" fill="#3b82f6"/>
                  </svg>
                </div>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="sider-dropdown-arrow">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              <button class="sider-toolbar-btn" id="sider-screenshot-btn" title="Capture Selected Area">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
                  <path d="M6 14h12"/>
                </svg>
              </button>
              <button class="sider-toolbar-btn" id="sider-attach-btn" title="Attach File">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>
                </svg>
              </button>
              <button class="sider-toolbar-btn" id="sider-read-page-btn" title="Read This Page">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  <line x1="8" y1="7" x2="16" y2="7"/>
                  <line x1="8" y1="11" x2="16" y2="11"/>
                </svg>
              </button>
              <button class="sider-toolbar-btn" id="sider-filter-btn" title="Filters">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="3" y1="6" x2="21" y2="6"/>
                  <line x1="7" y1="12" x2="17" y2="12"/>
                  <line x1="11" y1="18" x2="13" y2="18"/>
                </svg>
                <span class="sider-notification-dot"></span>
              </button>
              <button class="sider-toolbar-btn" id="sider-history-btn" title="Chat History">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </button>
              <button class="sider-toolbar-btn" id="sider-new-chat-btn" title="New Chat">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
            </div>
            <div class="sider-ai-dropdown" id="sider-ai-dropdown" style="display: none;">
              <div class="sider-ai-dropdown-section">
                <div class="sider-ai-dropdown-title">Basic</div>
                <div class="sider-ai-option" data-model="chatgpt">
                  <div class="sider-ai-option-icon">🤖</div>
                  <span>GPT-3.5</span>
                </div>
                <div class="sider-ai-option" data-model="gpt4">
                  <div class="sider-ai-option-icon">🧠</div>
                  <span>GPT-4</span>
                </div>
                <div class="sider-ai-option" data-model="gemini">
                  <div class="sider-ai-option-icon">⭐</div>
                  <span>Gemini</span>
                </div>
                <div class="sider-ai-option" data-model="claude">
                  <div class="sider-ai-option-icon">🌟</div>
                  <span>Claude</span>
                </div>
              </div>
            </div>
            <textarea 
              id="sider-chat-input" 
              class="sider-chat-input" 
              placeholder="Ask anything, @models, / prompts"
              rows="1"
            ></textarea>
            <div class="sider-input-buttons">
              <button class="sider-send-btn" id="sider-send-btn" title="Send">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
          <input type="file" id="sider-file-input" style="display: none;" multiple>
        </div>
      </div>
    `;
    
    document.body.appendChild(panel);
    return panel;
  }
  
  function togglePanel() {
    if (!chatPanel) {
      chatPanel = createChatPanel();
    }
    
    isPanelOpen = !isPanelOpen;
    
    if (isPanelOpen) {
      chatPanel.classList.add('sider-panel-open');
      chatPanel.classList.remove('sider-panel-collapsed');
      chatPanel.style.transform = 'translateX(0)';
      // Compress website when panel opens
      compressWebsite(true);
    } else {
      chatPanel.classList.remove('sider-panel-open');
      chatPanel.classList.remove('sider-panel-collapsed');
      chatPanel.style.transform = 'translateX(100%)';
      // Fully restore website when panel closes
      compressWebsite(false);
      // Small delay to ensure clean restoration
      setTimeout(() => {
        compressWebsite(false);
      }, 100);
    }
    
    chrome.storage.local.set({ siderPanelOpen: isPanelOpen });
  }
  
  function closePanel() {
    if (chatPanel) {
      isPanelOpen = false;
      chatPanel.classList.remove('sider-panel-open');
      chatPanel.classList.remove('sider-panel-collapsed');
      
      // Completely hide the panel (slide it off screen)
      chatPanel.style.transform = 'translateX(100%)';
      
      // Fully restore website when panel closes
      compressWebsite(false);
      
      // Double check to ensure complete restoration after transition
      setTimeout(() => {
        compressWebsite(false);
        // Force layout recalculation
        void document.body.offsetHeight;
      }, 350);
      
      chrome.storage.local.set({ siderPanelOpen: false });
    }
  }
  
  let currentModel = 'chatgpt';
  let isScreenshotMode = false;
  let screenshotOverlay = null;
  let screenshotStartX = 0;
  let screenshotStartY = 0;
  let screenshotSelection = null;
  let fileInput = null;
  
  function initializePanel() {
    chatPanel = createChatPanel();
    
    const toggleBtn = document.getElementById('sider-toggle-btn');
    const closeBtn = document.getElementById('sider-close-btn');
    const sendBtn = document.getElementById('sider-send-btn');
    const chatInput = document.getElementById('sider-chat-input');
    const aiSelectorBtn = document.getElementById('sider-ai-selector-btn');
    const aiDropdown = document.getElementById('sider-ai-dropdown');
    const screenshotBtn = document.getElementById('sider-screenshot-btn');
    const attachBtn = document.getElementById('sider-attach-btn');
    const readPageBtn = document.getElementById('sider-read-page-btn');
    const newChatBtn = document.getElementById('sider-new-chat-btn');
    fileInput = document.getElementById('sider-file-input');
    
    toggleBtn?.addEventListener('click', togglePanel);
    closeBtn?.addEventListener('click', closePanel);
    
    // New Chat button
    newChatBtn?.addEventListener('click', () => {
      createNewChat();
    });
    
    sendBtn?.addEventListener('click', () => sendMessage());
    chatInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
      autoResize(e.target);
    });
    
    chatInput?.addEventListener('input', (e) => {
      autoResize(e.target);
    });
    
    // AI Model Selector Dropdown
    aiSelectorBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = aiDropdown.style.display !== 'none';
      aiDropdown.style.display = isVisible ? 'none' : 'block';
    });
    
    document.querySelectorAll('.sider-ai-option').forEach(option => {
      option.addEventListener('click', (e) => {
        const model = e.currentTarget.dataset.model;
        currentModel = model;
        aiDropdown.style.display = 'none';
        updateAISelectorIcon(model);
      });
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!aiSelectorBtn?.contains(e.target) && !aiDropdown?.contains(e.target)) {
        aiDropdown.style.display = 'none';
      }
    });
    
    // Screenshot capture
    screenshotBtn?.addEventListener('click', () => {
      startScreenshotMode();
    });
    
    // File attachment
    attachBtn?.addEventListener('click', () => {
      fileInput?.click();
    });
    
    fileInput?.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      handleFileAttachments(files);
    });
    
    // Read page
    readPageBtn?.addEventListener('click', () => {
      readCurrentPage();
    });
    
    document.querySelectorAll('.sider-action-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.currentTarget.dataset.action;
        handleAction(action);
      });
    });
    
    chrome.storage.local.get(['siderPanelOpen'], (result) => {
      if (result.siderPanelOpen) {
        isPanelOpen = true;
        chatPanel.classList.add('sider-panel-open');
        chatPanel.classList.remove('sider-panel-collapsed');
        chatPanel.style.transform = 'translateX(0)';
        compressWebsite(true);
      } else {
        // Ensure panel is closed if state says it should be
        isPanelOpen = false;
        chatPanel.classList.remove('sider-panel-open');
        chatPanel.classList.remove('sider-panel-collapsed');
        chatPanel.style.transform = 'translateX(100%)';
        compressWebsite(false);
      }
    });
    
    // Handle window resize for responsiveness
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        if (isPanelOpen) {
          // Reapply compression with new dimensions
          compressWebsite(true);
        }
      }, 100);
    });
    
    // Handle dynamic content changes (for SPAs)
    const observer = new MutationObserver(() => {
      if (isPanelOpen) {
        // Reapply compression if new containers are added
        setTimeout(() => {
          compressWebsite(true);
        }, 50);
      }
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }
  
  function autoResize(textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 150) + 'px';
  }
  
  function handleAction(action) {
    const chatContainer = document.getElementById('sider-chat-container');
    const welcome = document.querySelector('.sider-welcome');
    
    switch(action) {
      case 'fullscreen':
        chatContainer.style.display = 'flex';
        welcome.style.display = 'none';
        break;
      default:
        console.log('Action:', action);
    }
  }
  
  function updateAISelectorIcon(model) {
    const icons = {
      chatgpt: '🤖',
      gpt4: '🧠',
      gemini: '⭐',
      claude: '🌟'
    };
    const btn = document.getElementById('sider-ai-selector-btn');
    if (btn) {
      const iconDiv = btn.querySelector('.sider-ai-selector-icon');
      if (iconDiv) {
        iconDiv.textContent = icons[model] || '🤖';
      }
    }
  }
  
  function startScreenshotMode() {
    if (isScreenshotMode) {
      stopScreenshotMode();
      return;
    }
    
    isScreenshotMode = true;
    document.body.style.cursor = 'crosshair';
    
    // Create overlay
    screenshotOverlay = document.createElement('div');
    screenshotOverlay.id = 'sider-screenshot-overlay';
    screenshotOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.3);
      z-index: 2147483646;
      cursor: crosshair;
    `;
    document.body.appendChild(screenshotOverlay);
    
    // Create selection rectangle
    screenshotSelection = document.createElement('div');
    screenshotSelection.style.cssText = `
      position: fixed;
      border: 2px dashed #3b82f6;
      background: rgba(59, 130, 246, 0.1);
      pointer-events: none;
      display: none;
    `;
    document.body.appendChild(screenshotSelection);
    
    screenshotOverlay.addEventListener('mousedown', handleScreenshotMouseDown);
    screenshotOverlay.addEventListener('mousemove', handleScreenshotMouseMove);
    screenshotOverlay.addEventListener('mouseup', handleScreenshotMouseUp);
    
    // Add cancel instruction
    const instruction = document.createElement('div');
    instruction.textContent = 'Select area to capture (Press ESC to cancel)';
    instruction.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: #3b82f6;
      color: white;
      padding: 10px 20px;
      border-radius: 6px;
      z-index: 2147483647;
      font-size: 14px;
    `;
    screenshotOverlay.appendChild(instruction);
    
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isScreenshotMode) {
        stopScreenshotMode();
      }
    });
  }
  
  function handleScreenshotMouseDown(e) {
    screenshotStartX = e.clientX;
    screenshotStartY = e.clientY;
    screenshotSelection.style.left = `${screenshotStartX}px`;
    screenshotSelection.style.top = `${screenshotStartY}px`;
    screenshotSelection.style.width = '0px';
    screenshotSelection.style.height = '0px';
    screenshotSelection.style.display = 'block';
  }
  
  function handleScreenshotMouseMove(e) {
    if (!screenshotSelection || screenshotSelection.style.display === 'none') return;
    
    const width = Math.abs(e.clientX - screenshotStartX);
    const height = Math.abs(e.clientY - screenshotStartY);
    const left = Math.min(e.clientX, screenshotStartX);
    const top = Math.min(e.clientY, screenshotStartY);
    
    screenshotSelection.style.left = `${left}px`;
    screenshotSelection.style.top = `${top}px`;
    screenshotSelection.style.width = `${width}px`;
    screenshotSelection.style.height = `${height}px`;
  }
  
  function handleScreenshotMouseUp(e) {
    if (!screenshotSelection || screenshotSelection.style.display === 'none') return;
    
    const width = Math.abs(e.clientX - screenshotStartX);
    const height = Math.abs(e.clientY - screenshotStartY);
    
    if (width > 10 && height > 10) {
      captureScreenshotArea(
        Math.min(e.clientX, screenshotStartX),
        Math.min(e.clientY, screenshotStartY),
        width,
        height
      );
    }
    
    stopScreenshotMode();
  }
  
  function stopScreenshotMode() {
    isScreenshotMode = false;
    document.body.style.cursor = '';
    if (screenshotOverlay) {
      screenshotOverlay.remove();
      screenshotOverlay = null;
    }
    if (screenshotSelection) {
      screenshotSelection.remove();
      screenshotSelection = null;
    }
  }
  
  async function captureScreenshotArea(x, y, width, height) {
    try {
      // Request screenshot from background script
      chrome.runtime.sendMessage({
        type: 'CAPTURE_SCREENSHOT',
        bounds: { x, y, width, height }
      }, (response) => {
        if (response && response.dataUrl) {
          // Add screenshot to input
          const input = document.getElementById('sider-chat-input');
          if (input) {
            const screenshotText = `[Screenshot: ${width}x${height}]\n`;
            input.value = screenshotText + input.value;
            autoResize(input);
          }
          // Show in chat
          addMessage('user', '📸 Screenshot captured');
        }
      });
    } catch (error) {
      console.error('Screenshot error:', error);
      // Fallback: use html2canvas if available
      alert('Screenshot captured. Note: Full screenshot feature requires additional permissions.');
    }
  }
  
  function handleFileAttachments(files) {
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileData = {
          name: file.name,
          type: file.type,
          size: file.size,
          data: e.target.result
        };
        
        const input = document.getElementById('sider-chat-input');
        if (input) {
          const fileText = `📎 ${file.name} (${(file.size / 1024).toFixed(1)}KB)\n`;
          input.value = fileText + input.value;
          autoResize(input);
        }
        
        addMessage('user', `📎 Attached: ${file.name}`);
      };
      reader.readAsDataURL(file);
    });
  }
  
  async function readCurrentPage() {
    const pageContent = {
      title: document.title,
      url: window.location.href,
      text: document.body.innerText.substring(0, 5000) // Limit to 5000 chars
    };
    
    const input = document.getElementById('sider-chat-input');
    if (input) {
      const pageText = `📖 Read this page: ${pageContent.title}\nURL: ${pageContent.url}\n\n${pageContent.text.substring(0, 500)}...`;
      input.value = pageText + (input.value ? '\n\n' + input.value : '');
      autoResize(input);
    }
    
    addMessage('user', `📖 Reading page: ${pageContent.title}`);
    
    // Auto-send a summary request
    const summaryPrompt = `Please summarize this page: ${pageContent.title}\n\nContent preview: ${pageContent.text.substring(0, 1000)}`;
    setTimeout(() => {
      const input = document.getElementById('sider-chat-input');
      if (input) {
        input.value = summaryPrompt;
        sendMessage();
      }
    }, 500);
  }
  
  async function sendMessage() {
    const input = document.getElementById('sider-chat-input');
    const messagesContainer = document.getElementById('sider-chat-messages');
    const chatContainer = document.getElementById('sider-chat-container');
    const welcome = document.querySelector('.sider-welcome');
    
    if (!input || !input.value.trim()) return;
    
    const message = input.value.trim();
    const model = currentModel;
    
    input.value = '';
    autoResize(input);
    
    if (chatContainer) {
      chatContainer.style.display = 'flex';
    }
    if (welcome) {
      welcome.style.display = 'none';
    }
    
    addMessage('user', message);
    const thinkingMsg = addMessage('assistant', 'Thinking...', true);
    
    try {
      chrome.runtime.sendMessage({
        type: 'CHAT_REQUEST',
        message: message,
        model: model
      }, (response) => {
        if (response && response.error) {
          updateMessage(thinkingMsg, 'assistant', `Error: ${response.error}`);
        } else if (response && response.text) {
          updateMessage(thinkingMsg, 'assistant', response.text);
        } else {
          updateMessage(thinkingMsg, 'assistant', 'No response received');
        }
      });
    } catch (error) {
      updateMessage(thinkingMsg, 'assistant', `Error: ${error.message}`);
    }
  }
  
  function createNewChat() {
    // Clear all chat messages
    const messagesContainer = document.getElementById('sider-chat-messages');
    if (messagesContainer) {
      messagesContainer.innerHTML = '';
    }
    
    // Clear input field
    const chatInput = document.getElementById('sider-chat-input');
    if (chatInput) {
      chatInput.value = '';
      autoResize(chatInput);
    }
    
    // Reset chat container and show welcome screen
    const chatContainer = document.getElementById('sider-chat-container');
    const welcome = document.querySelector('.sider-welcome');
    
    if (chatContainer) {
      chatContainer.style.display = 'none';
    }
    if (welcome) {
      welcome.style.display = 'block';
    }
    
    // Close AI dropdown if open
    const aiDropdown = document.getElementById('sider-ai-dropdown');
    if (aiDropdown) {
      aiDropdown.style.display = 'none';
    }
    
    // Reset file input
    if (fileInput) {
      fileInput.value = '';
    }
    
    // Scroll to top
    if (messagesContainer) {
      messagesContainer.scrollTop = 0;
    }
  }
  
  function addMessage(role, text, isThinking = false) {
    const messagesContainer = document.getElementById('sider-chat-messages');
    if (!messagesContainer) return null;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `sider-message sider-message-${role}`;
    
    if (isThinking) {
      messageDiv.classList.add('sider-thinking');
    }
    
    messageDiv.innerHTML = `
      <div class="sider-message-avatar">
        ${role === 'user' ? '👤' : '🤖'}
      </div>
      <div class="sider-message-content">
        <div class="sider-message-text">${text}</div>
      </div>
    `;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    return messageDiv;
  }
  
  function updateMessage(messageDiv, role, text) {
    if (!messageDiv) return;
    
    messageDiv.classList.remove('sider-thinking');
    const textElement = messageDiv.querySelector('.sider-message-text');
    if (textElement) {
      textElement.textContent = text;
    }
    
    const messagesContainer = document.getElementById('sider-chat-messages');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }
  
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    try {
      if (request.type === 'TOGGLE_PANEL') {
        togglePanel();
        if (sendResponse) {
          sendResponse({ success: true, isOpen: isPanelOpen });
        }
        return true;
      } else if (request.type === 'CLOSE_PANEL') {
        closePanel();
        if (sendResponse) {
          sendResponse({ success: true, isOpen: false });
        }
        return true;
      } else if (request.type === 'GET_PANEL_STATE') {
        if (sendResponse) {
          sendResponse({ isOpen: isPanelOpen });
        }
        return true;
      }
    } catch (error) {
      console.error('Error handling message:', error);
      if (sendResponse) {
        sendResponse({ error: error.message });
      }
    }
    return true;
  });
  
  // Text Selection Toolbar
  let selectionToolbar = null;
  let selectedText = '';
  
  function createSelectionToolbar() {
    if (selectionToolbar) {
      return selectionToolbar;
    }
    
    const toolbar = document.createElement('div');
    toolbar.id = 'sider-selection-toolbar';
    toolbar.innerHTML = `
      <button class="sider-selection-btn" id="sider-ai-analyze-btn" title="Ask AI about this text">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" fill="url(#brain-gradient)"/>
          <circle cx="12" cy="12" r="6" fill="url(#brain-gradient)"/>
          <defs>
            <linearGradient id="brain-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#9333ea;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#ec4899;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:1" />
            </linearGradient>
          </defs>
        </svg>
      </button>
      <button class="sider-selection-btn" id="sider-copy-btn" title="Copy">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
      </button>
      <button class="sider-selection-btn" id="sider-highlight-btn" title="Highlight">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" fill="#fbbf24" stroke="#f59e0b"/>
        </svg>
      </button>
      <button class="sider-selection-btn" id="sider-notes-btn" title="Add to Notes">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          <line x1="8" y1="7" x2="16" y2="7"/>
          <line x1="8" y1="11" x2="16" y2="11"/>
          <line x1="8" y1="15" x2="12" y2="15"/>
        </svg>
      </button>
      <button class="sider-selection-btn" id="sider-more-btn" title="More options">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="1"/>
          <circle cx="19" cy="12" r="1"/>
          <circle cx="5" cy="12" r="1"/>
        </svg>
      </button>
      <button class="sider-selection-btn" id="sider-close-selection-btn" title="Close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    `;
    
    document.body.appendChild(toolbar);
    return toolbar;
  }
  
  function showSelectionToolbar() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.toString().trim().length === 0) {
      hideSelectionToolbar();
      return;
    }
    
    selectedText = selection.toString().trim();
    if (selectedText.length < 3) {
      hideSelectionToolbar();
      return;
    }
    
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    if (!selectionToolbar) {
      selectionToolbar = createSelectionToolbar();
    }
    
    // Position toolbar above selection
    const toolbar = selectionToolbar;
    const toolbarHeight = 40;
    const toolbarPadding = 8;
    
    let top = rect.top - toolbarHeight - toolbarPadding;
    let left = rect.left + (rect.width / 2) - (toolbar.offsetWidth / 2);
    
    // Keep toolbar within viewport
    if (top < 10) {
      top = rect.bottom + toolbarPadding;
    }
    if (left < 10) {
      left = 10;
    }
    if (left + toolbar.offsetWidth > window.innerWidth - 10) {
      left = window.innerWidth - toolbar.offsetWidth - 10;
    }
    
    toolbar.style.top = `${top + window.scrollY}px`;
    toolbar.style.left = `${left + window.scrollX}px`;
    toolbar.style.display = 'flex';
  }
  
  function hideSelectionToolbar() {
    if (selectionToolbar) {
      selectionToolbar.style.display = 'none';
    }
    selectedText = '';
  }
  
  function initializeSelectionToolbar() {
    selectionToolbar = createSelectionToolbar();
    
    // AI Analyze button
    document.getElementById('sider-ai-analyze-btn')?.addEventListener('click', () => {
      if (selectedText) {
        analyzeTextWithAI(selectedText);
        hideSelectionToolbar();
        window.getSelection().removeAllRanges();
      }
    });
    
    // Copy button
    document.getElementById('sider-copy-btn')?.addEventListener('click', () => {
      if (selectedText) {
        navigator.clipboard.writeText(selectedText).then(() => {
          showCopyFeedback();
        });
        hideSelectionToolbar();
        window.getSelection().removeAllRanges();
      }
    });
    
    // Highlight button
    document.getElementById('sider-highlight-btn')?.addEventListener('click', () => {
      if (selectedText) {
        highlightSelectedText();
        hideSelectionToolbar();
      }
    });
    
    // Notes button
    document.getElementById('sider-notes-btn')?.addEventListener('click', () => {
      if (selectedText) {
        addToNotes(selectedText);
        hideSelectionToolbar();
        window.getSelection().removeAllRanges();
      }
    });
    
    // More options button
    document.getElementById('sider-more-btn')?.addEventListener('click', () => {
      showMoreOptions();
    });
    
    // Close button
    document.getElementById('sider-close-selection-btn')?.addEventListener('click', () => {
      hideSelectionToolbar();
      window.getSelection().removeAllRanges();
    });
    
    // Show toolbar on text selection
    document.addEventListener('mouseup', showSelectionToolbar);
    document.addEventListener('keyup', (e) => {
      if (e.key === 'Escape') {
        hideSelectionToolbar();
      } else {
        showSelectionToolbar();
      }
    });
    
    // Hide toolbar on click outside
    document.addEventListener('mousedown', (e) => {
      if (selectionToolbar && !selectionToolbar.contains(e.target)) {
        const selection = window.getSelection();
        if (!selection || selection.toString().trim().length === 0) {
          hideSelectionToolbar();
        }
      }
    });
  }
  
  function analyzeTextWithAI(text) {
    // Open chat panel if closed
    if (!isPanelOpen) {
      togglePanel();
    }
    
    // Set the input with the selected text
    const input = document.getElementById('sider-chat-input');
    if (input) {
      const prompt = `Analyze this text: "${text}"\n\nWhat does this mean? Provide insights and context.`;
      input.value = prompt;
      autoResize(input);
      
      // Auto-send after a short delay
      setTimeout(() => {
        sendMessage();
      }, 300);
    }
  }
  
  function showCopyFeedback() {
    const feedback = document.createElement('div');
    feedback.textContent = '✓ Copied!';
    feedback.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #10b981;
      color: white;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 500;
      z-index: 2147483647;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      pointer-events: none;
    `;
    document.body.appendChild(feedback);
    
    setTimeout(() => {
      feedback.style.opacity = '0';
      feedback.style.transition = 'opacity 0.3s';
      setTimeout(() => feedback.remove(), 300);
    }, 1500);
  }
  
  function highlightSelectedText() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.cssText = 'background-color: #fef08a; padding: 2px 0;';
    span.className = 'sider-highlight';
    
    try {
      range.surroundContents(span);
      hideSelectionToolbar();
      selection.removeAllRanges();
    } catch (e) {
      // If surroundContents fails, create a highlight differently
      const contents = range.extractContents();
      span.appendChild(contents);
      range.insertNode(span);
      hideSelectionToolbar();
      selection.removeAllRanges();
    }
  }
  
  function addToNotes(text) {
    // Store note in chrome storage
    chrome.storage.local.get(['sider_notes'], (result) => {
      const notes = result.sider_notes || [];
      notes.push({
        text: text,
        url: window.location.href,
        title: document.title,
        timestamp: Date.now()
      });
      
      chrome.storage.local.set({ sider_notes: notes }, () => {
        showCopyFeedback();
        setTimeout(() => {
          const feedback = document.querySelector('.sider-copy-feedback');
          if (feedback) {
            feedback.textContent = '✓ Added to Notes!';
          }
        }, 0);
      });
    });
  }
  
  function showMoreOptions() {
    // Show a dropdown with more options
    alert('More options: Translate, Summarize, Explain, etc. (Coming soon!)');
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initializePanel();
      initializeSelectionToolbar();
    });
  } else {
    initializePanel();
    initializeSelectionToolbar();
  }
})();

