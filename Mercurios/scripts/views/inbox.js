/**
 * MERCURIOS // OMNICHANNEL INBOX CONTROLLER
 * Refactored for MercuriOS Design System:
 * - Brand: MERCURI
 * - 100% Zero-Icon compliance (clean typography and standard technical tags)
 * - Mẫu trả lời nhanh (Canned Replies / Slash Commands) integrated into composer
 * - Precise timestamp & avatar layout alignment (no clipping, no misalignment)
 * - Interactive customer message simulation
 * - Direct Enter to send
 */

(function () {
  'use strict';

  // KNOWLEDGE BASE FOR MERCURI FASHION OPERATIONS & AI ACCURACY
  const FAQ_RESPONSES = {
    size: 'Dạ bảng size chuẩn bên em gồm:\n• Size S: 43 - 48kg (eo 64-68cm, mông 88-92cm)\n• Size M: 49 - 54kg (eo 69-73cm, mông 93-96cm)\n• Size L: 55 - 60kg (eo 74-78cm, mông 97-100cm)\nChị cho shop xin chiều cao và cân nặng để tư vấn size vừa vặn nhất cho mình nha!',
    freeship: 'Dạ shop hỗ trợ FREESHIP TOÀN QUỐC cho tất cả đơn hàng từ 500.000đ ạ! Đơn dưới 500k phí ship đồng giá 25k nội thành HCM, 35k tỉnh khác. Riêng nội thành TP.HCM có hỗ trợ giao hỏa tốc trong 2 giờ ạ.',
    eveningGown: 'Dạ mẫu Client Style C - Evening Gown hiện đang có sẵn 2 chiếc size M tại Flagship Store [ST-01] (123 Nguyễn Trãi, Q1). Giá niêm yết 60.000.000đ, chất liệu lụa satin cao cấp may đo thủ công tinh xảo ạ!',
    store: 'Dạ Flagship Store [ST-01] bên em tọa lạc tại: 123 Nguyễn Trãi, P. Bến Thành, Quận 1, TP.HCM.\nGiờ mở cửa: 09:00 - 22:00 tất cả các ngày trong tuần (có bãi đỗ xe ô tô thuận tiện) ạ.',
    promo: 'Dạ ưu đãi tuần này tại Mercuri:\n• Tặng Voucher 200.000đ cho đơn hàng thời trang đầu tiên.\n• Nhân đôi điểm thưởng thành viên VIP cho mọi đơn hàng.\n• Tặng túi canvas thương hiệu cho hóa đơn từ 2.000.000đ ạ!',
    greeting: 'Dạ thời trang Mercuri xin chào quý khách! Shop có thể tư vấn mẫu trang phục hoặc hỗ trợ kiểm tra đơn hàng nào cho mình ạ?',
    stock: 'Dạ hiện tại các mẫu chủ đạo trong BST Fall/Winter và Holiday 2026 đều đang sẵn hàng tại kho trung tâm [WH-01]. Chị đang quan tâm đầm dạ hội, áo sơ mi hay chân váy lụa để shop kiểm tra size tức thì ạ?'
  };

  // MẪU TRẢ LỜI NHANH (CANNED TEMPLATES CHUẨN MERCURI)
  const CANNED_TEMPLATES = [
    {
      cmd: '/chao',
      title: 'Lời chào',
      category: 'Chào hỏi',
      text: 'Dạ Mercuri xin chào ạ! Em có thể tư vấn gì cho mình ạ?'
    },
    {
      cmd: '/cam-on',
      title: 'Cảm ơn',
      category: 'Kết thúc',
      text: 'Mercuri cảm ơn mình rất nhiều ạ! Mong sớm được phục vụ mình ở những đơn hàng tiếp theo.'
    },
    {
      cmd: '/chotdon',
      title: 'Chốt đơn',
      category: 'Bán hàng',
      text: 'Dạ em xin thông tin đơn hàng giúp shop ạ:\n• Họ tên:\n• SĐT:\n• Địa chỉ:\n• Sản phẩm + Size + Số lượng:'
    },
    {
      cmd: '/diachi',
      title: 'Địa chỉ shop',
      category: 'Thông tin',
      text: 'Dạ shop có Flagship Store [ST-01]: 123 Nguyễn Trãi Q1, TP.HCM / Kho Ecom [WH-02]. Mở cửa 9h–22h hằng ngày (có bãi đỗ xe ô tô) ạ.'
    },
    {
      cmd: '/doitra',
      title: 'Chính sách đổi trả',
      category: 'Chính sách',
      text: 'Dạ shop hỗ trợ đổi size trong 7 ngày kể từ ngày nhận hàng, sản phẩm còn nguyên tem mác ạ.'
    },
    {
      cmd: '/freeship',
      title: 'Chính sách ship',
      category: 'Chính sách',
      text: 'Dạ shop free ship cho đơn từ 500k toàn quốc; nội thành HCM phí 25k, tỉnh khác 35k ạ. Giao 1–3 ngày COD nha.'
    },
    {
      cmd: '/giathe',
      title: 'Báo giá đang nhắn',
      category: 'Bán hàng',
      text: 'Dạ shop em xin báo giá sản phẩm bên dưới ạ. Mình bên em có ưu đãi free ship cho đơn từ 500k nhé ạ.'
    },
    {
      cmd: '/size',
      title: 'Bảng size thời trang',
      category: 'Tư vấn',
      text: 'Dạ bảng size chuẩn Mercuri:\n• Size S: 43 - 48kg (eo 64-68cm)\n• Size M: 49 - 54kg (eo 69-73cm)\n• Size L: 55 - 60kg (eo 74-78cm)\nChị cho shop xin chiều cao và cân nặng để tư vấn size vừa vặn nhất cho mình nha!'
    }
  ];

  const SIMULATED_CUSTOMER_QUESTIONS = [
    'Mẫu đầm dạ hội Evening Gown còn size M không shop? Có giao kịp tối nay ở Q1 không?',
    'Shop tư vấn giúp mình bảng size và số đo chuẩn cho chiều cao 1m62 nặng 50kg nhé?',
    'Đơn hàng từ bao nhiêu thì bên Mercuri hỗ trợ freeship toàn quốc vậy shop?',
    'Mẫu áo sơ mi lụa trắng Cocoon có sẵn hàng tại Flagship Store Quận 1 không shop?',
    'Tuần này shop có voucher giảm giá hay ưu đãi cho thành viên VIP không ạ?',
    'Cho mình hỏi đầm lụa Pleated Silk có màu đen hoặc navy không shop?',
    'Mình muốn đặt giao hỏa tốc đến Landmark 81 chiều nay được không shop?'
  ];
  let simIndex = 0;

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
    if (text.includes('chào') || text.includes('hi') || text.includes('hello') || text.includes('alo') || text.includes('shop ơi')) {
      return FAQ_RESPONSES.greeting;
    }
    if (text.includes('còn không') || text.includes('còn hàng') || text.includes('mẫu gì') || text.includes('có sẵn')) {
      return FAQ_RESPONSES.stock;
    }

    return 'Dạ shop đã nhận được tin nhắn của quý khách. Chuyên viên tư vấn Mercuri đang kiểm tra và sẽ phản hồi chi tiết ngay cho mình ạ!';
  }

  function initInbox() {
    const store = window.mercuriosStore;
    const toast = window.MercuriosToast;

    // DOM Elements - Left Column
    const convListEl = document.getElementById('msg-conversations-list');
    const searchInput = document.getElementById('msg-search-input');
    const channelChips = document.querySelectorAll('.msg-channel-chip');

    // DOM Elements - Right Thread Column
    const headerRecipient = document.getElementById('msg-header-recipient');
    const headerAvatar = document.getElementById('msg-header-avatar');
    const headerName = document.getElementById('msg-header-name');
    const headerStatus = document.getElementById('msg-header-status');
    const profileTier = document.getElementById('msg-profile-tier');
    const profileChannel = document.getElementById('msg-profile-channel');
    const profilePhone = document.getElementById('msg-profile-phone');
    const profileOrders = document.getElementById('msg-profile-orders');
    const profileSpent = document.getElementById('msg-profile-spent');

    const messagesCanvas = document.getElementById('msg-messages-canvas');
    const composerInput = document.getElementById('msg-composer-input');
    const btnSend = document.getElementById('btn-msg-send');
    const btnAiToggle = document.getElementById('btn-msg-ai-toggle');

    // DOM Elements - Simulation Popover Box
    const simPopover = document.getElementById('inbox-sim-popover');
    const btnCloseSim = document.getElementById('btn-close-sim');
    const simTextarea = document.getElementById('sim-input-text');
    const btnSubmitSim = document.getElementById('btn-submit-sim');

    // DOM Elements - Quick Canned Templates Popover
    const templatesPopover = document.getElementById('inbox-templates-popover');
    const btnToggleTemplates = document.getElementById('btn-toggle-templates');
    const btnCloseTemplates = document.getElementById('btn-close-templates');
    const templatesSearchInput = document.getElementById('templates-search-input');
    const templatesListContainer = document.getElementById('templates-list-container');

    let selectedChannel = 'ALL';

    // -------------------------------------------------------------------------
    // 1. RENDER CONVERSATION DIRECTORY
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
          <div style="padding: 30px 16px; text-align: center; color: var(--text-muted); font-size: 13px; font-family: var(--font-mono);">
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
        const channelTag = `[${conv.channel}]`;

        item.innerHTML = `
          <div class="inbox-avatar">${initials}</div>
          <div class="msg-conv-info">
            <div class="msg-conv-top">
              <span class="msg-conv-name">${conv.name}</span>
              <span class="msg-conv-time">${conv.lastActivity}</span>
            </div>
            <div class="msg-conv-bottom">
              <span class="msg-conv-snippet">${lastText}</span>
              <span style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted);">${channelTag}</span>
              ${conv.unread ? '<span class="msg-unread-indicator">[NEW]</span>' : ''}
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
    // 2. RENDER ACTIVE CHAT THREAD (CLEAN TIMESTAMPS & ALIGNMENT)
    // -------------------------------------------------------------------------
    function renderActiveChat() {
      const inboxState = store.getState().inbox;
      const activeConv = (inboxState.conversations || []).find(c => c.id === inboxState.activeConversationId);

      if (!activeConv) return;

      const initials = activeConv.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
      const cust = (store.getState().crmCustomers || []).find(c => c.id === activeConv.customerId) || {
        tier: 'VIP',
        ordersCount: 8,
        totalSpent: '68,500,000 đ'
      };

      // Update Header & Meta
      if (headerAvatar) headerAvatar.textContent = initials;
      if (headerName) headerName.textContent = activeConv.name;
      if (profileTier) profileTier.textContent = `[${cust.tier.toUpperCase()}]`;
      if (profileChannel) profileChannel.textContent = `[${activeConv.channel}]`;
      if (profilePhone) profilePhone.textContent = activeConv.phone;
      if (profileOrders) profileOrders.textContent = `${cust.ordersCount} orders`;
      if (profileSpent) profileSpent.textContent = cust.totalSpent;
      if (headerStatus) headerStatus.textContent = 'Active';

      // Update Messages Canvas
      if (messagesCanvas) {
        messagesCanvas.innerHTML = `
          <div class="inbox-date-divider" style="margin-bottom: 12px;">HÔM NAY</div>
        `;

        activeConv.messages.forEach(msg => {
          const row = document.createElement('div');
          const isCustomer = (msg.sender === 'customer');
          row.className = `msg-row ${isCustomer ? 'customer' : 'shop'}`;

          let avatarHtml = '';
          if (isCustomer) {
            avatarHtml = `<div class="msg-row-avatar">${initials}</div>`;
          }

          let aiTagHtml = msg.isAi ? `<span class="msg-ai-tag">[AI]</span>` : '';

          row.innerHTML = `
            ${avatarHtml}
            <div class="msg-bubble-group">
              <div class="msg-bubble">${msg.text.replace(/\n/g, '<br>')}</div>
              <div class="msg-time-stamp">${msg.time} ${aiTagHtml}</div>
            </div>
          `;

          messagesCanvas.appendChild(row);
        });

        // Auto scroll smoothly to bottom
        setTimeout(() => {
          messagesCanvas.scrollTop = messagesCanvas.scrollHeight;
        }, 10);
      }

      // Update AI Toggle Button State
      if (btnAiToggle) {
        const isAutopilot = store.getState().inbox.aiAutoPilot;
        btnAiToggle.textContent = `AI Autopilot: ${isAutopilot ? 'ON' : 'OFF'}`;
        btnAiToggle.classList.toggle('btn-primary', isAutopilot);
        btnAiToggle.classList.toggle('btn-secondary', !isAutopilot);
      }
    }

    // -------------------------------------------------------------------------
    // 3. SMART CONTEXTUAL AI DISPATCHER
    // -------------------------------------------------------------------------
    function triggerSmartAiResponse(convId, userQuestion) {
      if (!store.getState().inbox.aiAutoPilot) return;

      const replyText = getContextualAiReply(userQuestion);

      setTimeout(() => {
        store.sendInboxMessage(convId, replyText, true, 'shop');
        toast.show('[Mercurix AI] Đã phản hồi tự động');
      }, 500);
    }

    // -------------------------------------------------------------------------
    // 4. SIMULATE INCOMING CUSTOMER MESSAGE (CUSTOM INPUT POPOVER)
    // -------------------------------------------------------------------------
    function toggleSimulationPopover(e) {
      if (e) e.stopPropagation();
      if (!simPopover) return;
      const isVisible = (simPopover.style.display === 'flex');
      simPopover.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible && simTextarea) {
        setTimeout(() => simTextarea.focus(), 50);
      }
    }

    function handleSendSimulatedCustomerMessage() {
      if (!simTextarea) return;
      const text = simTextarea.value.trim();
      if (!text) {
        toast.show('Vui lòng gõ tin giả lập khách hỏi');
        return;
      }
      const inboxState = store.getState().inbox;
      const activeConvId = inboxState.activeConversationId;
      if (!activeConvId) return;

      // 1. Send as Customer Message
      store.sendInboxMessage(activeConvId, text, false, 'customer');
      simTextarea.value = '';
      if (simPopover) simPopover.style.display = 'none';
      toast.show('[Giả lập] Đã gửi tin nhắn từ khách hàng');

      // 2. Trigger intelligent AI answer after 1s
      if (store.getState().inbox.aiAutoPilot) {
        triggerSmartAiResponse(activeConvId, text);
      }
    }

    // -------------------------------------------------------------------------
    // 5. QUICK CANNED REPLIES (MẪU TRẢ LỜI NHANH / SLASH COMMANDS)
    // -------------------------------------------------------------------------
    function renderCannedTemplates(filterQuery = '') {
      if (!templatesListContainer) return;
      const query = filterQuery.toLowerCase().trim().replace(/^\//, '');

      const filtered = CANNED_TEMPLATES.filter(item => {
        if (!query) return true;
        const cmdClean = item.cmd.replace(/^\//, '');
        return cmdClean.includes(query) ||
               item.title.toLowerCase().includes(query) ||
               item.category.toLowerCase().includes(query) ||
               item.text.toLowerCase().includes(query);
      });

      templatesListContainer.innerHTML = '';

      if (filtered.length === 0) {
        templatesListContainer.innerHTML = `
          <div style="padding: 24px; text-align: center; color: var(--text-muted); font-size: 13px;">
            Không tìm thấy mẫu trả lời phù hợp
          </div>
        `;
        return;
      }

      filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'canned-reply-card';
        card.innerHTML = `
          <div class="canned-card-top">
            <div class="canned-tag-group">
              <span class="canned-badge-cmd">${item.cmd}</span>
              <span class="canned-title">${item.title}</span>
            </div>
            <span class="canned-category">${item.category}</span>
          </div>
          <div class="canned-content">${item.text}</div>
        `;

        card.addEventListener('click', (e) => {
          e.stopPropagation();
          // Insert into composer input
          if (composerInput) {
            composerInput.value = item.text;
            autoResizeComposer();
            composerInput.focus();
          }
          if (templatesPopover) templatesPopover.style.display = 'none';
          toast.show(`Đã chèn mẫu: [${item.title}]`);
        });

        templatesListContainer.appendChild(card);
      });
    }

    function toggleTemplatesPopover(e) {
      if (e) e.stopPropagation();
      if (!templatesPopover) return;
      const isVisible = (templatesPopover.style.display === 'flex');
      templatesPopover.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        renderCannedTemplates();
        if (templatesSearchInput) {
          templatesSearchInput.value = '';
          setTimeout(() => templatesSearchInput.focus(), 50);
        }
      }
    }

    // -------------------------------------------------------------------------
    // 6. EVENT LISTENERS
    // -------------------------------------------------------------------------
    // Click on Customer Header / Avatar to open simulation box
    if (headerRecipient) {
      headerRecipient.addEventListener('click', toggleSimulationPopover);
    }

    if (btnCloseSim) {
      btnCloseSim.addEventListener('click', (e) => {
        e.stopPropagation();
        if (simPopover) simPopover.style.display = 'none';
      });
    }

    if (btnSubmitSim) {
      btnSubmitSim.addEventListener('click', (e) => {
        e.stopPropagation();
        handleSendSimulatedCustomerMessage();
      });
    }

    if (simTextarea) {
      simTextarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSendSimulatedCustomerMessage();
        }
      });
    }

    // Quick Canned Templates Events
    if (btnToggleTemplates) {
      btnToggleTemplates.addEventListener('click', toggleTemplatesPopover);
    }

    if (btnCloseTemplates) {
      btnCloseTemplates.addEventListener('click', (e) => {
        e.stopPropagation();
        if (templatesPopover) templatesPopover.style.display = 'none';
      });
    }

    if (templatesSearchInput) {
      templatesSearchInput.addEventListener('input', (e) => {
        renderCannedTemplates(e.target.value);
      });
    }

    // Channel filter tabs
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

    function autoResizeComposer() {
      if (!composerInput) return;
      composerInput.style.height = 'auto';
      const newHeight = Math.min(composerInput.scrollHeight, 120);
      composerInput.style.height = (newHeight > 38 ? newHeight : 38) + 'px';
    }

    // Send Message via Composer
    function handleSend() {
      if (!composerInput) return;
      const text = composerInput.value.trim();
      if (!text) return;

      const convId = store.getState().inbox.activeConversationId;
      store.sendInboxMessage(convId, text, false, 'shop');
      composerInput.value = '';
      composerInput.style.height = '38px';
    }

    if (btnSend) {
      btnSend.addEventListener('click', handleSend);
    }

    // Composer Input Events (Enter gửi, Shift+Space xuống dòng, tự ẩn mẫu khi xóa /)
    if (composerInput) {
      composerInput.addEventListener('keydown', (e) => {
        // Shift + Space để xuống dòng theo đúng yêu cầu
        if ((e.key === ' ' && e.shiftKey) || (e.key === 'Enter' && e.shiftKey)) {
          e.preventDefault();
          const start = composerInput.selectionStart;
          const end = composerInput.selectionEnd;
          composerInput.value = composerInput.value.substring(0, start) + '\n' + composerInput.value.substring(end);
          composerInput.selectionStart = composerInput.selectionEnd = start + 1;
          autoResizeComposer();
          return;
        }

        // Enter để gửi tin nhắn ngay
        if (e.key === 'Enter' && !e.shiftKey && !e.ctrlKey) {
          e.preventDefault();
          handleSend();
          return;
        }

        // Phím Escape để đóng nhanh bảng mẫu
        if (e.key === 'Escape') {
          if (templatesPopover && templatesPopover.style.display === 'flex') {
            templatesPopover.style.display = 'none';
          }
        }
      });

      // Khi xóa / thì tự đóng/xóa bảng mẫu trả lời luôn
      composerInput.addEventListener('input', () => {
        autoResizeComposer();
        const val = composerInput.value;
        if (val.startsWith('/')) {
          if (templatesPopover && templatesPopover.style.display !== 'flex') {
            templatesPopover.style.display = 'flex';
          }
          renderCannedTemplates(val);
        } else {
          // Tự động đóng popup khi không còn /
          if (templatesPopover && templatesPopover.style.display === 'flex') {
            templatesPopover.style.display = 'none';
          }
        }
      });
    }

    // Close simulation or templates popovers when clicking outside
    document.addEventListener('click', (e) => {
      if (simPopover && simPopover.style.display === 'flex') {
        if (!simPopover.contains(e.target) && !headerRecipient.contains(e.target)) {
          simPopover.style.display = 'none';
        }
      }
      if (templatesPopover && templatesPopover.style.display === 'flex') {
        if (!templatesPopover.contains(e.target) && !btnToggleTemplates.contains(e.target)) {
          templatesPopover.style.display = 'none';
        }
      }
    });

    // Toggle AI Autopilot
    if (btnAiToggle) {
      btnAiToggle.addEventListener('click', () => {
        store.toggleAiAutoPilot();
        const isOn = store.getState().inbox.aiAutoPilot;
        btnAiToggle.textContent = `AI Autopilot: ${isOn ? 'ON' : 'OFF'}`;
        btnAiToggle.classList.toggle('btn-primary', isOn);
        btnAiToggle.classList.toggle('btn-secondary', !isOn);
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
    renderCannedTemplates();
  }

  window.MercuriosInboxView = { init: initInbox };
})();
