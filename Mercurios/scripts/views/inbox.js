/**
 * MERCURIOS // OMNICHANNEL INBOX & MERCURIX AI COPILOT CONTROLLER
 * Minimalist, uncluttered 2/3 pane architecture with collapsible AI/CRM drawer.
 */

(function () {
  'use strict';

  function initInbox() {
    const store = window.mercuriosStore;
    const toast = window.MercuriosToast;

    // DOM Elements
    const conversationsContainer = document.getElementById('inbox-conversations-list');
    const channelPillBtns = document.querySelectorAll('.channel-pill-btn');
    const searchInput = document.getElementById('inbox-search');
    
    // Chat Elements
    const chatHeaderTitle = document.getElementById('chat-header-title');
    const chatHeaderSub = document.getElementById('chat-header-sub');
    const chatHeaderChannel = document.getElementById('chat-header-channel');
    const btnToggleAutopilot = document.getElementById('btn-toggle-autopilot');
    const btnToggleDrawer = document.getElementById('btn-toggle-inbox-drawer');
    const chatMessagesThread = document.getElementById('chat-messages-thread');
    const aiDraftBanner = document.getElementById('ai-draft-banner');
    const aiDraftText = document.getElementById('ai-draft-text');
    const btnUseAiDraft = document.getElementById('btn-use-ai-draft');
    const btnDismissAiDraft = document.getElementById('btn-dismiss-ai-draft');
    const chatComposerTextarea = document.getElementById('chat-composer-textarea');
    const btnSendMessage = document.getElementById('btn-send-message');

    // Drawer Elements
    const sideDrawer = document.getElementById('inbox-side-drawer');
    const drawerTabBtns = document.querySelectorAll('.drawer-tab-btn');
    const drawerCrmTab = document.getElementById('drawer-tab-crm');
    const drawerAiSimTab = document.getElementById('drawer-tab-ai-sim');
    const drawerMetricsTab = document.getElementById('drawer-tab-metrics');
    const btnCloseDrawer = document.getElementById('btn-close-drawer');
    const simCustInput = document.getElementById('sim-cust-input');
    const btnSimCustSend = document.getElementById('btn-sim-cust-send');

    let currentChannelFilter = 'ALL';

    // -------------------------------------------------------------------------
    // 1. RENDER CONVERSATION DIRECTORY (LEFT PANE)
    // -------------------------------------------------------------------------
    function renderConversationsList() {
      if (!conversationsContainer) return;
      const inboxState = store.getState().inbox;
      const list = inboxState.conversations || [];
      const query = (searchInput?.value || '').toLowerCase().trim();

      const filtered = list.filter(conv => {
        const matchesChannel = currentChannelFilter === 'ALL' || conv.channel.toUpperCase() === currentChannelFilter.toUpperCase();
        const matchesQuery = !query ||
          conv.name.toLowerCase().includes(query) ||
          conv.phone.includes(query) ||
          conv.messages.some(m => m.text.toLowerCase().includes(query));
        return matchesChannel && matchesQuery;
      });

      conversationsContainer.innerHTML = '';

      if (filtered.length === 0) {
        conversationsContainer.innerHTML = `
          <div style="padding: 24px 16px; text-align: center; color: var(--text-muted); font-family: var(--font-mono); font-size: 12px;">
            NO CONVERSATIONS
          </div>
        `;
        return;
      }

      filtered.forEach(conv => {
        const item = document.createElement('div');
        const isActive = conv.id === inboxState.activeConversationId;
        item.className = `conv-item ${isActive ? 'active' : ''} ${conv.unread ? 'unread' : ''}`;
        item.dataset.convId = conv.id;

        // Initials
        const initials = conv.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
        const lastMsg = conv.messages[conv.messages.length - 1];
        const lastSnippet = lastMsg ? (lastMsg.isAi ? '[AI] ' : '') + lastMsg.text : 'Chưa có tin nhắn';

        item.innerHTML = `
          <div class="conv-avatar">${initials}</div>
          <div class="conv-info">
            <div class="conv-top-line">
              <div style="display: flex; align-items: center;">
                <span class="conv-name">${conv.name}</span>
                ${conv.unread ? '<span class="unread-dot"></span>' : ''}
              </div>
              <span class="conv-time">${conv.lastActivity}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span class="conv-channel-tag">[${conv.channel}]</span>
              <span class="conv-snippet">${lastSnippet}</span>
            </div>
          </div>
        `;

        item.addEventListener('click', () => {
          store.selectConversation(conv.id);
        });

        conversationsContainer.appendChild(item);
      });
    }

    // -------------------------------------------------------------------------
    // 2. RENDER ACTIVE CONVERSATION (CENTER PANE)
    // -------------------------------------------------------------------------
    function renderActiveChat() {
      const inboxState = store.getState().inbox;
      const activeConv = (inboxState.conversations || []).find(c => c.id === inboxState.activeConversationId);

      if (!activeConv) {
        if (chatHeaderTitle) chatHeaderTitle.textContent = 'Select Conversation';
        if (chatMessagesThread) chatMessagesThread.innerHTML = '';
        return;
      }

      // Update Header
      if (chatHeaderTitle) chatHeaderTitle.textContent = activeConv.name;
      if (chatHeaderSub) chatHeaderSub.textContent = `${activeConv.phone} • ${activeConv.page}`;
      if (chatHeaderChannel) chatHeaderChannel.textContent = `[${activeConv.channel}]`;

      // Update AI Autopilot Button state
      if (btnToggleAutopilot) {
        btnToggleAutopilot.classList.toggle('active', inboxState.aiAutoPilot);
        btnToggleAutopilot.innerHTML = inboxState.aiAutoPilot
          ? `● AI AUTOPILOT: ON`
          : `○ AI AUTOPILOT: OFF`;
      }

      // Update Drawer toggle button
      if (btnToggleDrawer) {
        btnToggleDrawer.classList.toggle('active', inboxState.showSideDrawer);
        btnToggleDrawer.textContent = inboxState.showSideDrawer ? '[HIDE PANEL]' : '[CRM & AI COPILOT]';
      }

      // Render Messages
      if (chatMessagesThread) {
        chatMessagesThread.innerHTML = '';
        activeConv.messages.forEach(msg => {
          const row = document.createElement('div');
          const isCustomer = (msg.sender === 'customer');
          row.className = `chat-bubble-row ${isCustomer ? 'customer' : 'shop'}`;

          let authorLabel = isCustomer ? activeConv.name : 'HEIN ONE // Operations';
          if (msg.isAi) {
            authorLabel += ` <span class="ai-tag-pill">[MERCURIX AI]</span>`;
          }

          row.innerHTML = `
            <div class="chat-bubble-author">
              <span>${authorLabel}</span>
              <span style="color: var(--text-muted); font-size: 10px;">${msg.time}</span>
            </div>
            <div class="chat-bubble">
              ${msg.text.replace(/\n/g, '<br>')}
            </div>
          `;
          chatMessagesThread.appendChild(row);
        });

        // Scroll to bottom
        chatMessagesThread.scrollTop = chatMessagesThread.scrollHeight;
      }

      // Render AI Suggestion Banner
      if (aiDraftBanner && aiDraftText) {
        if (activeConv.aiSuggestion && activeConv.aiSuggestion.trim().length > 0) {
          aiDraftText.textContent = activeConv.aiSuggestion;
          aiDraftBanner.style.display = 'flex';
        } else {
          aiDraftBanner.style.display = 'none';
        }
      }

      // Update Drawer details if open
      renderDrawerContent(activeConv);
    }

    // -------------------------------------------------------------------------
    // 3. RENDER DRAWER CONTENT (RIGHT PANE - COLLAPSIBLE)
    // -------------------------------------------------------------------------
    function renderDrawerContent(conv) {
      if (!sideDrawer) return;
      const inboxState = store.getState().inbox;
      sideDrawer.classList.toggle('open', inboxState.showSideDrawer);

      // Match customer with CRM
      const cust = (store.getState().crmCustomers || []).find(c => c.id === conv.customerId) || {
        tier: 'Standard',
        ordersCount: 2,
        totalSpent: '2,500,000 đ',
        points: 250,
        joinedDate: '2026'
      };

      // CRM Details
      const crmTierEl = document.getElementById('drawer-crm-tier');
      const crmOrdersEl = document.getElementById('drawer-crm-orders');
      const crmSpentEl = document.getElementById('drawer-crm-spent');
      const crmPhoneEl = document.getElementById('drawer-crm-phone');
      const crmEmailEl = document.getElementById('drawer-crm-email');

      if (crmTierEl) crmTierEl.textContent = `[${cust.tier.toUpperCase()}]`;
      if (crmOrdersEl) crmOrdersEl.textContent = cust.ordersCount;
      if (crmSpentEl) crmSpentEl.textContent = cust.totalSpent;
      if (crmPhoneEl) crmPhoneEl.textContent = conv.phone;
      if (crmEmailEl) crmEmailEl.textContent = cust.email || '—';
    }

    // -------------------------------------------------------------------------
    // 4. EVENT LISTENERS & ACTIONS
    // -------------------------------------------------------------------------
    // Channel filter buttons
    channelPillBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        channelPillBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentChannelFilter = btn.dataset.channel;
        renderConversationsList();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', renderConversationsList);
    }

    // Toggle AI Autopilot
    if (btnToggleAutopilot) {
      btnToggleAutopilot.addEventListener('click', () => {
        store.toggleAiAutoPilot();
        const isNowOn = store.getState().inbox.aiAutoPilot;
        toast.show(`Mercurix AI Autopilot is now [${isNowOn ? 'ACTIVE' : 'STANDBY'}]`);
      });
    }

    // Toggle Collapsible Drawer
    if (btnToggleDrawer) {
      btnToggleDrawer.addEventListener('click', () => {
        store.toggleInboxDrawer();
      });
    }

    if (btnCloseDrawer) {
      btnCloseDrawer.addEventListener('click', () => {
        store.toggleInboxDrawer(false);
      });
    }

    // Drawer Tabs
    drawerTabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        drawerTabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const targetTab = btn.dataset.tab;
        
        if (drawerCrmTab) drawerCrmTab.style.display = (targetTab === 'crm' ? 'flex' : 'none');
        if (drawerAiSimTab) drawerAiSimTab.style.display = (targetTab === 'ai-sim' ? 'flex' : 'none');
        if (drawerMetricsTab) drawerMetricsTab.style.display = (targetTab === 'metrics' ? 'flex' : 'none');
      });
    });

    // Send Message Handler
    function handleSendMessage() {
      if (!chatComposerTextarea) return;
      const text = chatComposerTextarea.value.trim();
      if (!text) return;

      const convId = store.getState().inbox.activeConversationId;
      store.sendInboxMessage(convId, text, false, 'shop');
      chatComposerTextarea.value = '';
      toast.show('Message sent');
    }

    if (btnSendMessage) {
      btnSendMessage.addEventListener('click', handleSendMessage);
    }

    if (chatComposerTextarea) {
      chatComposerTextarea.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          e.preventDefault();
          handleSendMessage();
        }
      });
    }

    // Quick tag clicks
    document.querySelectorAll('.quick-action-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        const action = tag.dataset.tag;
        if (action === 'stock' && chatComposerTextarea) {
          chatComposerTextarea.value = 'Dạ sản phẩm hiện đang có sẵn hàng tại kho trung tâm [WH-01], shop có thể gửi hàng ngay trong ngày cho mình ạ!';
          chatComposerTextarea.focus();
        } else if (action === 'po' && chatComposerTextarea) {
          chatComposerTextarea.value = 'Dạ anh/chị cho shop xin Số điện thoại và Địa chỉ để shop gửi xác nhận đơn hàng qua Zalo nhé ạ!';
          chatComposerTextarea.focus();
        } else {
          toast.show(`Template [${action}] applied`);
        }
      });
    });

    // Use AI Draft
    if (btnUseAiDraft) {
      btnUseAiDraft.addEventListener('click', () => {
        const convId = store.getState().inbox.activeConversationId;
        store.applyAiSuggestion(convId);
        toast.show('Applied Mercurix AI suggestion');
      });
    }

    // Dismiss AI Draft
    if (btnDismissAiDraft) {
      btnDismissAiDraft.addEventListener('click', () => {
        const convId = store.getState().inbox.activeConversationId;
        const conv = (store.getState().inbox.conversations || []).find(c => c.id === convId);
        if (conv) {
          conv.aiSuggestion = '';
          store.notify();
        }
      });
    }

    // AI Simulation: Simulate Incoming Customer Message
    if (btnSimCustSend && simCustInput) {
      btnSimCustSend.addEventListener('click', () => {
        const text = simCustInput.value.trim();
        if (!text) return;

        const convId = store.getState().inbox.activeConversationId;
        store.sendInboxMessage(convId, text, false, 'customer');
        simCustInput.value = '';
        toast.show('Simulated customer message sent');

        // If Mercurix AI Autopilot is active, trigger automated smart reply after 700ms!
        if (store.getState().inbox.aiAutoPilot) {
          setTimeout(() => {
            const aiReplies = [
              'Dạ mẫu này shop đang có sẵn size chuẩn tại Flagship Store [ST-01], bên em có thể giao ngay ạ!',
              'Dạ đơn hàng trên 500k bên em đang được áp dụng mã freeship toàn quốc đó ạ!',
              'Dạ chị cho em xin số đo chiều cao và cân nặng để em tư vấn size vừa vặn nhất cho mình nha!'
            ];
            const randomReply = aiReplies[Math.floor(Math.random() * aiReplies.length)];
            store.sendInboxMessage(convId, randomReply, true, 'shop');
            toast.show('[Mercurix AI] Auto-replied to simulated customer');
          }, 800);
        }
      });
    }

    // Expose Inbox API to Mercurix Bridge
    window.MercuriosInbox = {
      simulateIncoming: (convId, text) => store.sendInboxMessage(convId, text, false, 'customer'),
      sendAiResponse: (convId, text) => store.sendInboxMessage(convId, text, true, 'shop'),
      setDraft: (convId, draft) => {
        const conv = (store.getState().inbox.conversations || []).find(c => c.id === convId);
        if (conv) {
          conv.aiSuggestion = draft;
          store.notify();
        }
      }
    };

    store.subscribe(() => {
      renderConversationsList();
      renderActiveChat();
    });

    renderConversationsList();
    renderActiveChat();
  }

  window.MercuriosInboxView = { init: initInbox };
})();
