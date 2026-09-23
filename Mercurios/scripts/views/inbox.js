/**
 * MERCURIOS // MESSENGER-STYLE OMNICHANNEL INBOX CONTROLLER
 * Ultra-clean Facebook Messenger UX with Pre-made Question Chips
 * and 100% Contextual, Accurate Mercurix AI Responses.
 */

(function () {
  'use strict';

  // KNOWLEDGE BASE FOR INTELLIGENT AI REPLIES
  const FAQ_RESPONSES = {
    size: 'Dạ bảng size chuẩn bên em gồm:\n• Size S: 43 - 48kg (eo 64-68cm, mông 88-92cm)\n• Size M: 49 - 54kg (eo 69-73cm, mông 93-96cm)\n• Size L: 55 - 60kg (eo 74-78cm, mông 97-100cm)\nChị cho shop xin chiều cao và cân nặng để tư vấn size vừa vặn nhất cho mình nha!',
    freeship: 'Dạ shop hỗ trợ FREESHIP TOÀN QUỐC cho tất cả đơn hàng từ 500.000đ ạ! Đơn dưới 500k phí ship đồng giá 30k toàn quốc. Riêng nội thành TP.HCM có hỗ trợ giao hỏa tốc trong 2 giờ ạ.',
    eveningGown: 'Dạ mẫu Client Style C - Evening Gown hiện đang có sẵn 2 chiếc size M tại Flagship Store [ST-01] (123 Nguyễn Trãi, Q1). Giá niêm yết 60.000.000đ, chất liệu lụa satin cao cấp may đo thủ công tinh xảo ạ!',
    store: 'Dạ Flagship Store [ST-01] bên em tọa lạc tại: 123 Nguyễn Trãi, P. Bến Thành, Quận 1, TP.HCM.\nGiờ mở cửa: 09:00 - 22:00 tất cả các ngày trong tuần (có bãi đỗ xe ô tô thuận tiện) ạ.',
    promo: 'Dạ ưu đãi tuần này tại HEIN ONE:\n• Tặng Voucher 200.000đ cho đơn hàng thời trang đầu tiên.\n• Nhân đôi điểm thưởng thành viên VIP cho mọi đơn hàng.\n• Tặng túi canvas thương hiệu cho hóa đơn từ 2.000.000đ ạ!',
    greeting: 'Dạ HEIN ONE xin chào quý khách! Shop có thể tư vấn mẫu trang phục hoặc hỗ trợ kiểm tra đơn hàng nào cho mình ạ?',
    stock: 'Dạ hiện tại các mẫu chủ đạo trong BST Fall/Winter và Holiday 2026 đều đang sẵn hàng tại kho trung tâm [WH-01]. Chị đang quan tâm đầm dạ hội, áo sơ mi hay chân váy lụa để shop kiểm tra size tức thì ạ?'
  };

  function getContextualAiReply(userText) {
    const text = userText.toLowerCase().trim();

    if (text.includes('size') || text.includes('số đo') || text.includes('chiều cao') || text.includes('cân nặng') || text.includes('bảng size') || text.includes('vừa không')) {
      return FAQ_RESPONSES.size;
    }
    if (text.includes('freeship') || text.includes('ship') || text.includes('vận chuyển') || text.includes('phí ship') || text.includes('giao hàng')) {
      return FAQ_RESPONSES.freeship;
    }
    if (text.includes('evening gown') || text.includes('dạ hội') || text.includes('váy dạ hội') || text.includes('đầm dạ hội')) {
      return FAQ_RESPONSES.eveningGown;
    }
    if (text.includes('địa chỉ') || text.includes('cửa hàng') || text.includes('store') || text.includes('ở đâu') || text.includes('chi nhánh') || text.includes('quận 1')) {
      return FAQ_RESPONSES.store;
    }
    if (text.includes('khuyến mãi') || text.includes('voucher') || text.includes('giảm giá') || text.includes('ưu đãi') || text.includes('sale')) {
      return FAQ_RESPONSES.promo;
    }
    if (text.includes('chào') || text.includes('hi') || text.includes('hello') || text.includes('alo') || text.includes('ê') || text.includes('shop ơi')) {
      return FAQ_RESPONSES.greeting;
    }
    if (text.includes('còn không') || text.includes('còn hàng') || text.includes('mẫu gì') || text.includes('có sẵn')) {
      return FAQ_RESPONSES.stock;
    }

    return 'Dạ shop đã nhận được tin nhắn của quý khách. Chuyên viên tư vấn HEIN ONE đang kiểm tra và sẽ phản hồi chi tiết ngay cho mình ạ!';
  }

  function initInbox() {
    const store = window.mercuriosStore;
    const toast = window.MercuriosToast;

    // DOM Elements - Column 1 (Chats List)
    const convListEl = document.getElementById('msg-conversations-list');
    const searchInput = document.getElementById('msg-search-input');
    const channelChips = document.querySelectorAll('.msg-channel-chip');

    // DOM Elements - Column 2 (Chat Thread)
    const headerAvatar = document.getElementById('msg-header-avatar');
    const headerName = document.getElementById('msg-header-name');
    const headerStatus = document.getElementById('msg-header-status');
    const messagesCanvas = document.getElementById('msg-messages-canvas');
    const composerInput = document.getElementById('msg-composer-input');
    const btnSend = document.getElementById('btn-msg-send');
    const promptChips = document.querySelectorAll('.msg-prompt-chip');
    const btnToggleInfo = document.getElementById('btn-toggle-info');

    // DOM Elements - Column 3 (Info Sidebar)
    const infoCol = document.getElementById('msg-info-col');
    const profileAvatar = document.getElementById('msg-profile-avatar');
    const profileName = document.getElementById('msg-profile-name');
    const profileTier = document.getElementById('msg-profile-tier');
    const profilePhone = document.getElementById('msg-profile-phone');
    const profileOrders = document.getElementById('msg-profile-orders');
    const profileSpent = document.getElementById('msg-profile-spent');
    const profileChannel = document.getElementById('msg-profile-channel');
    const btnAiToggle = document.getElementById('btn-msg-ai-toggle');
    const faqBtns = document.querySelectorAll('.msg-faq-btn');

    let selectedChannel = 'ALL';

    // -------------------------------------------------------------------------
    // 1. RENDER CHAT DIRECTORY (COLUMN 1)
    // -------------------------------------------------------------------------
    function renderChatsList() {
      if (!convListEl) return;
      const inboxState = store.getState().inbox;
      const list = inboxState.conversations || [];
      const query = (searchInput?.value || '').toLowerCase().trim();

      const filtered = list.filter(conv => {
        const matchesChannel = (selectedChannel === 'ALL' || conv.channel.toUpperCase() === selectedChannel.toUpperCase());
        const matchesQuery = !query || conv.name.toLowerCase().includes(query) || conv.phone.includes(query);
        return matchesChannel && matchesQuery;
      });

      convListEl.innerHTML = '';

      if (filtered.length === 0) {
        convListEl.innerHTML = `
          <div style="padding: 30px 16px; text-align: center; color: var(--text-muted); font-size: 13px;">
            No conversations found
          </div>
        `;
        return;
      }

      filtered.forEach(conv => {
        const item = document.createElement('div');
        const isActive = (conv.id === inboxState.activeConversationId);
        item.className = `msg-conv-item ${isActive ? 'active' : ''} ${conv.unread ? 'unread' : ''}`;

        const initials = conv.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
        const lastMsg = conv.messages[conv.messages.length - 1];
        const lastText = lastMsg ? (lastMsg.isAi ? '[AI] ' : '') + lastMsg.text : 'Chưa có tin nhắn';

        item.innerHTML = `
          <div class="msg-avatar-wrap">
            <div class="msg-avatar">${initials}</div>
            <span class="msg-online-dot"></span>
          </div>
          <div class="msg-conv-info">
            <div class="msg-conv-top">
              <span class="msg-conv-name">${conv.name}</span>
              <span class="msg-conv-time">${conv.lastActivity}</span>
            </div>
            <div style="display: flex; align-items: center;">
              <span class="msg-conv-snippet">${lastText}</span>
              ${conv.unread ? '<span class="msg-unread-badge"></span>' : ''}
            </div>
          </div>
        `;

        item.addEventListener('click', () => {
          store.selectConversation(conv.id);
        });

        convListEl.appendChild(item);
      });
    }

    // -------------------------------------------------------------------------
    // 2. RENDER ACTIVE CHAT THREAD (COLUMN 2)
    // -------------------------------------------------------------------------
    function renderActiveChat() {
      const inboxState = store.getState().inbox;
      const activeConv = (inboxState.conversations || []).find(c => c.id === inboxState.activeConversationId);

      if (!activeConv) return;

      const initials = activeConv.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

      // Update Header
      if (headerAvatar) headerAvatar.textContent = initials;
      if (headerName) headerName.textContent = activeConv.name;
      if (headerStatus) headerStatus.textContent = `Active now • ${activeConv.channel}`;

      // Update Messages Canvas
      if (messagesCanvas) {
        messagesCanvas.innerHTML = `
          <div class="msg-date-divider">TODAY</div>
        `;

        activeConv.messages.forEach(msg => {
          const row = document.createElement('div');
          const isCustomer = (msg.sender === 'customer');
          row.className = `msg-row ${isCustomer ? 'customer' : 'shop'}`;

          let avatarHtml = '';
          if (isCustomer) {
            avatarHtml = `<div class="msg-row-avatar">${initials}</div>`;
          }

          let aiTagHtml = msg.isAi ? `<span class="msg-ai-tag">AI</span>` : '';

          row.innerHTML = `
            ${avatarHtml}
            <div class="msg-bubble-group">
              <div class="msg-bubble">${msg.text.replace(/\n/g, '<br>')}</div>
              <div class="msg-time-stamp">${msg.time} ${aiTagHtml}</div>
            </div>
          `;

          messagesCanvas.appendChild(row);
        });

        // Auto scroll to bottom
        messagesCanvas.scrollTop = messagesCanvas.scrollHeight;
      }

      // Update Profile in Column 3
      renderCustomerProfile(activeConv);
    }

    // -------------------------------------------------------------------------
    // 3. RENDER CUSTOMER PROFILE (COLUMN 3)
    // -------------------------------------------------------------------------
    function renderCustomerProfile(conv) {
      const initials = conv.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
      const cust = (store.getState().crmCustomers || []).find(c => c.id === conv.customerId) || {
        tier: 'VIP',
        ordersCount: 8,
        totalSpent: '68,500,000 đ'
      };

      if (profileAvatar) profileAvatar.textContent = initials;
      if (profileName) profileName.textContent = conv.name;
      if (profileTier) profileTier.textContent = cust.tier.toUpperCase();
      if (profilePhone) profilePhone.textContent = conv.phone;
      if (profileOrders) profileOrders.textContent = `${cust.ordersCount} orders`;
      if (profileSpent) profileSpent.textContent = cust.totalSpent;
      if (profileChannel) profileChannel.textContent = conv.page;

      if (btnAiToggle) {
        const isAutopilot = store.getState().inbox.aiAutoPilot;
        btnAiToggle.className = `msg-switch-btn ${isAutopilot ? 'on' : ''}`;
        btnAiToggle.textContent = isAutopilot ? 'ON' : 'OFF';
      }
    }

    // -------------------------------------------------------------------------
    // 4. SMART CONTEXTUAL AI DISPATCHER
    // -------------------------------------------------------------------------
    function triggerSmartAiResponse(convId, userQuestion) {
      if (!store.getState().inbox.aiAutoPilot) return;

      const replyText = getContextualAiReply(userQuestion);

      setTimeout(() => {
        store.sendInboxMessage(convId, replyText, true, 'shop');
        toast.show('[Mercurix AI] Đã phản hồi tự động');
      }, 400);
    }

    // -------------------------------------------------------------------------
    // 5. EVENT LISTENERS
    // -------------------------------------------------------------------------
    // Channel filter chips
    channelChips.forEach(chip => {
      chip.addEventListener('click', () => {
        channelChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        selectedChannel = chip.dataset.channel;
        renderChatsList();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', renderChatsList);
    }

    // Send Message via Composer
    function handleSend() {
      if (!composerInput) return;
      const text = composerInput.value.trim();
      if (!text) return;

      const convId = store.getState().inbox.activeConversationId;
      store.sendInboxMessage(convId, text, false, 'shop');
      composerInput.value = '';
    }

    if (btnSend) {
      btnSend.addEventListener('click', handleSend);
    }

    if (composerInput) {
      composerInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSend();
        }
      });
    }

    // Pre-made Quick Question Chips
    promptChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const convId = store.getState().inbox.activeConversationId;
        const promptKey = chip.dataset.prompt;

        let questionText = chip.textContent.replace(/^[^\w\s\u00C0-\u1EF9]+/, '').trim();
        if (promptKey === 'size') questionText = 'Shop tư vấn giúp mình bảng size và số đo với ạ!';
        else if (promptKey === 'freeship') questionText = 'Đơn hàng bên mình chính sách freeship thế nào shop?';
        else if (promptKey === 'evening-gown') questionText = 'Mẫu đầm dạ hội Client Style C - Evening Gown còn sẵn size M không shop?';
        else if (promptKey === 'store') questionText = 'Cho mình xin địa chỉ Flagship Store và giờ mở cửa nhé!';
        else if (promptKey === 'promo') questionText = 'Tuần này shop có chương trình khuyến mãi hay voucher gì không ạ?';

        // 1. Send as Customer Question
        store.sendInboxMessage(convId, questionText, false, 'customer');

        // 2. Trigger accurate, highly contextual AI answer immediately!
        triggerSmartAiResponse(convId, questionText);
      });
    });

    // Right Column Quick FAQ Canned Answers (Staff Direct Send)
    faqBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const convId = store.getState().inbox.activeConversationId;
        const faqKey = btn.dataset.faq;
        let reply = FAQ_RESPONSES.greeting;

        if (faqKey === 'size') reply = FAQ_RESPONSES.size;
        else if (faqKey === 'freeship') reply = FAQ_RESPONSES.freeship;
        else if (faqKey === 'store') reply = FAQ_RESPONSES.store;
        else if (faqKey === 'promo') reply = FAQ_RESPONSES.promo;

        store.sendInboxMessage(convId, reply, false, 'shop');
        toast.show('Đã gửi câu trả lời mẫu');
      });
    });

    // Toggle Info Column
    if (btnToggleInfo && infoCol) {
      btnToggleInfo.addEventListener('click', () => {
        const isHidden = (infoCol.style.display === 'none');
        infoCol.style.display = isHidden ? 'flex' : 'none';
        btnToggleInfo.classList.toggle('active', isHidden);
      });
    }

    // Toggle AI Autopilot
    if (btnAiToggle) {
      btnAiToggle.addEventListener('click', () => {
        store.toggleAiAutoPilot();
        const isOn = store.getState().inbox.aiAutoPilot;
        btnAiToggle.className = `msg-switch-btn ${isOn ? 'on' : ''}`;
        btnAiToggle.textContent = isOn ? 'ON' : 'OFF';
        toast.show(`Mercurix AI Autopilot: [${isOn ? 'ON' : 'OFF'}]`);
      });
    }

    // Store Subscriptions
    store.subscribe(() => {
      renderChatsList();
      renderActiveChat();
    });

    renderChatsList();
    renderActiveChat();
  }

  window.MercuriosInboxView = { init: initInbox };
})();
