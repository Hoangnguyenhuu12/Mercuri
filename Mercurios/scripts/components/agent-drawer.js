/**
 * MERCURIOS // MERCURIX MINI CHAT CONTROLLER (MESSENGER STYLE)
 * Clean, lightweight presentation harness for bottom-right floating chat.
 * Renders single-frame Messenger bubbles, zero thinking toggle boxes, zero action cards.
 */

(function () {
  'use strict';

  let isOpen = false;
  let isProcessing = false;

  // DOM Elements
  let drawerEl, btnClose, btnClearChat;
  let btnFloatingLauncher;
  let chatStreamEl, composerForm, inputText, btnSend;

  function getCurrentTime() {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  const WELCOME_MESSAGE = `Chào bạn, tôi là **Mercurix** — trợ lý vận hành MercuriOS.\n\nTôi có thể hỗ trợ bạn mở các trang nghiệp vụ, kiểm tra tồn kho, đơn hàng hoặc tạo phiếu điều chuyển kho.\n\nBạn cần hỗ trợ gì ạ?`;

  // Internal Conversation Memory (in-memory: resets on F5, persists across toggle)
  let messages = [
    {
      id: 'msg-init',
      role: 'assistant',
      time: getCurrentTime(),
      text: WELCOME_MESSAGE
    }
  ];

  function init() {
    drawerEl = document.getElementById('agent-drawer');
    btnFloatingLauncher = document.getElementById('btn-agent-floating-launcher');
    btnClose = document.getElementById('btn-close-agent-drawer');
    btnClearChat = document.getElementById('btn-clear-chat');
    chatStreamEl = document.getElementById('agent-chat-stream');
    composerForm = document.getElementById('agent-composer-form');
    inputText = document.getElementById('agent-input-text');
    btnSend = document.getElementById('btn-agent-send');

    if (!drawerEl) return;

    // Toggle Listeners: Floating button at bottom right (Hình 1)
    if (btnFloatingLauncher) {
      btnFloatingLauncher.addEventListener('click', toggleDrawer);
    }
    if (btnClose) {
      btnClose.addEventListener('click', closeDrawer);
    }
    if (btnClearChat) {
      btnClearChat.addEventListener('click', clearChat);
    }

    // Keyboard Shortcuts: Ctrl+Space to toggle, Esc to close
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey && e.code === 'Space') || (e.altKey && (e.key === 'a' || e.key === 'A'))) {
        e.preventDefault();
        toggleDrawer();
      } else if (e.key === 'Escape' && isOpen) {
        closeDrawer();
      }
    });

    // Composer Form Submission
    if (composerForm) {
      composerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        handleUserSubmit();
      });
    }

    // Enter to send
    if (inputText) {
      inputText.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleUserSubmit();
        }
      });
    }

    // Initial render
    renderChatStream();

    console.log('[MercuriosAgentDrawer] Messenger mini-chat controller ready.');
  }

  function openDrawer() {
    isOpen = true;
    drawerEl?.classList.add('active');
    btnFloatingLauncher?.classList.add('chat-open');
    setTimeout(() => {
      if (inputText && typeof inputText.focus === 'function') inputText.focus();
    }, 120);
  }

  function closeDrawer() {
    isOpen = false;
    drawerEl?.classList.remove('active');
    btnFloatingLauncher?.classList.remove('chat-open');
  }

  function toggleDrawer() {
    if (isOpen) closeDrawer();
    else openDrawer();
  }

  function clearChat() {
    messages = [
      {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        time: getCurrentTime(),
        text: WELCOME_MESSAGE
      }
    ];
    renderChatStream();
    if (window.MercuriosToast && window.MercuriosToast.show) {
      window.MercuriosToast.show('Đã xóa cuộc trò chuyện');
    }
  }

  function renderChatStream() {
    if (!chatStreamEl) return;
    chatStreamEl.innerHTML = '';

    messages.forEach(msg => {
      const node = document.createElement('div');
      node.className = `agent-node agent-node-${msg.role}`;

      if (msg.role === 'user') {
        node.innerHTML = `
          <div class="agent-user-bubble">${escapeHtml(msg.text)}</div>
          <div class="agent-user-meta">${msg.time}</div>
        `;
      } else {
        // Assistant: Strictly single clean Messenger bubble without toggle frames or action cards
        const formattedText = formatMarkdown(msg.text);
        node.innerHTML = `
          <div class="agent-assistant-bubble">
            ${formattedText}
          </div>
          <div class="agent-assistant-meta">${msg.time}</div>
        `;
      }

      chatStreamEl.appendChild(node);
    });

    // Auto-scroll to bottom
    chatStreamEl.scrollTop = chatStreamEl.scrollHeight;
  }

  async function handleUserSubmit() {
    if (isProcessing) return;
    const text = (inputText?.value || '').trim();
    if (!text) return;

    if (inputText) inputText.value = '';

    // Handle user typing "xóa chat" or "clear" directly
    const lower = text.toLowerCase();
    if (lower === 'xóa chat' || lower === 'xoa chat' || lower === 'clear' || lower === 'clear chat') {
      clearChat();
      return;
    }

    // Add user message to UI
    messages.push({
      id: `msg-${Date.now()}`,
      role: 'user',
      time: getCurrentTime(),
      text: text
    });
    renderChatStream();

    isProcessing = true;

    try {
      let result;
      if (window.Mercurix && window.Mercurix.processCommand) {
        result = await window.Mercurix.processCommand(text);
      } else {
        result = {
          text: 'Trợ lý Mercurix hiện chưa kết nối. Vui lòng tải lại trang.'
        };
      }

      messages.push({
        id: `msg-${Date.now()}`,
        role: 'assistant',
        time: getCurrentTime(),
        text: result.text || 'Đã thực hiện xong thao tác.'
      });
    } catch (err) {
      console.error('[MercuriosAgentDrawer] Error during command execution:', err);
      messages.push({
        id: `msg-${Date.now()}`,
        role: 'assistant',
        time: getCurrentTime(),
        text: 'Có lỗi xảy ra trong quá trình xử lý yêu cầu. Bạn vui lòng thử lại nhé.'
      });
    } finally {
      renderChatStream();
      isProcessing = false;
    }
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatMarkdown(text) {
    if (!text) return '';
    let html = escapeHtml(text);

    // Bold: **text**
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Italic: *text*
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Inline code: `code`
    html = html.replace(/`([^`]+)`/g, '<span class="mono-num">$1</span>');

    // Clean paragraph & list rendering
    const lines = html.split('\n');
    let inList = false;
    const processedLines = [];

    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('• ') || trimmed.startsWith('- ')) {
        if (!inList) {
          processedLines.push('<ul>');
          inList = true;
        }
        processedLines.push(`<li>${trimmed.substring(2)}</li>`);
      } else {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        if (trimmed === '') {
          processedLines.push('<div style="height: 4px;"></div>');
        } else {
          processedLines.push(`<p>${line}</p>`);
        }
      }
    });

    if (inList) {
      processedLines.push('</ul>');
    }

    return processedLines.join('');
  }

  // Public API
  window.MercuriosAgentDrawer = {
    init: init,
    open: openDrawer,
    close: closeDrawer,
    toggle: toggleDrawer,
    clear: clearChat,
    executePrompt: function (prompt) {
      openDrawer();
      if (inputText) inputText.value = prompt;
      handleUserSubmit();
    }
  };

})();
