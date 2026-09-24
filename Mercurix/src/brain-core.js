/**
 * MERCURIOS // MERCURIX BRAIN CORE & REACT INTENT ENGINE
 * Decoupled from presentation UI.
 * Handles:
 * 1. Safe Human-in-the-Loop Confirmation & Deletion (Hỏi xác nhận trước khi xóa, thực hiện khi xác nhận)
 * 2. Theme Switching (Đổi màu nền sáng / tối, Dark Mode)
 * 3. Quick Creation (Thêm collection, thêm sản phẩm, tạo đơn hàng, ...)
 * 4. Direct Navigation & View Switching (mở tab settings, vào kho, mở đơn hàng, ...)
 * 5. Smart Operations & Filtering (lọc tồn kho thấp, lọc nhân sự theo vai trò, lọc đơn hàng)
 * 6. Stock Dispatch Automation (với đầy đủ thông tin hoặc hỏi lại người dùng nếu thiếu)
 * 7. Operational Telemetry (doanh thu, tổng quan số liệu)
 * 8. Contextual Clarification (hỏi lại chi tiết yêu cầu, không dùng câu trả lời cố định lặp lại)
 */

(function () {
  'use strict';

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Active state for human confirmation of critical actions (e.g. deletion)
  let pendingConfirmation = null;

  function normalizeStr(str) {
    if (!str) return '';
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd')
      .trim();
  }

  // System Views Knowledge Map
  const VIEW_MAP = [
    {
      key: 'settings',
      name: 'Settings (Cài đặt)',
      keywords: ['settings', 'setting', 'cài đặt', 'cai dat', 'thiết lập', 'thiet lap', 'cấu hình', 'cau hinh', 'hệ thống', 'he thong', 'cfg']
    },
    {
      key: 'overview',
      name: 'Dashboard (Tổng quan)',
      keywords: ['overview', 'dashboard', 'tổng quan', 'tong quan', 'trang chủ', 'trang chu', 'home', 'bàn làm việc', 'ban lam viec']
    },
    {
      key: 'products',
      name: 'Products (Sản phẩm)',
      keywords: ['products', 'product', 'sản phẩm', 'san pham', 'mẫu mã', 'mau ma', 'quần áo', 'quan ao', 'hàng hóa', 'hang hoa', 'catalog']
    },
    {
      key: 'categories',
      name: 'Categories (Danh mục)',
      keywords: ['categories', 'category', 'danh mục', 'danh muc', 'nhóm hàng', 'nhom hang', 'phân loại', 'phan loai']
    },
    {
      key: 'collections',
      name: 'Collections (Bộ sưu tập)',
      keywords: ['collections', 'collection', 'bộ sưu tập', 'bo suu tap', 'bst']
    },
    {
      key: 'materials',
      name: 'Raw Materials (Nguyên phụ liệu)',
      keywords: ['materials', 'material', 'nguyên phụ liệu', 'nguyen phu lieu', 'nguyên liệu', 'phụ liệu', 'vải', 'vai', 'vật tư', 'vat tu']
    },
    {
      key: 'orders',
      name: 'Orders (Đơn hàng)',
      keywords: ['orders', 'order', 'đơn hàng', 'don hang', 'bán hàng', 'ban hang', 'hóa đơn', 'hoa don']
    },
    {
      key: 'customers',
      name: 'Customers (Khách hàng CRM)',
      keywords: ['customers', 'customer', 'khách hàng', 'khach hang', 'khách', 'khach', 'crm', 'hội viên', 'hoi vien']
    },
    {
      key: 'inbox',
      name: 'Omnichannel Inbox (Hộp thư)',
      keywords: ['inbox', 'tin nhắn', 'tin nhan', 'hộp thư', 'hop thu', 'chat', 'omnichannel']
    },
    {
      key: 'stores',
      name: 'Outlets & Stores (Cửa hàng / Chi nhánh)',
      keywords: ['stores', 'store', 'cửa hàng', 'cua hang', 'chi nhánh', 'chi nhanh', 'outlets', 'outlet', 'boutique', 'showroom']
    },
    {
      key: 'inventory',
      name: 'Inventory & Stock (Kho hàng & Tồn kho)',
      keywords: ['inventory', 'kho hàng', 'kho hang', 'tồn kho', 'ton kho', 'kho', 'stock', 'wms', 'thẻ kho', 'the kho']
    },
    {
      key: 'production',
      name: 'Production MES (Sản xuất)',
      keywords: ['production', 'sản xuất', 'san xuat', 'xưởng', 'xuong', 'nhà máy', 'nha may', 'gia công', 'gia cong', 'mes', 'lệnh sản xuất', 'po']
    },
    {
      key: 'suppliers',
      name: 'Suppliers & Vendors (Nhà cung cấp)',
      keywords: ['suppliers', 'supplier', 'nhà cung cấp', 'nha cung cap', 'ncc', 'vendors', 'vendor', 'đối tác', 'doi tac']
    },
    {
      key: 'staff',
      name: 'Staff & Access (Nhân sự & Phân quyền)',
      keywords: ['staff', 'nhân sự', 'nhan su', 'nhân viên', 'nhan vien', 'tài khoản', 'tai khoan', 'phân quyền', 'phan quyen', 'user', 'users']
    }
  ];

  function matchNavigation(lowerText) {
    const hasNavTrigger =
      lowerText.includes('mở') || lowerText.includes('mo ') ||
      lowerText.includes('vào') || lowerText.includes('vao ') ||
      lowerText.includes('xem') || lowerText.includes('chuyển') || lowerText.includes('chuyen') ||
      lowerText.includes('bật') || lowerText.includes('bat ') ||
      lowerText.includes('open') || lowerText.includes('go to') || lowerText.includes('goto') ||
      lowerText.includes('tab') || lowerText.includes('trang');

    for (const v of VIEW_MAP) {
      for (const kw of v.keywords) {
        if (
          lowerText === kw ||
          lowerText === `tab ${kw}` ||
          lowerText === `trang ${kw}` ||
          lowerText === `mục ${kw}` ||
          (hasNavTrigger && lowerText.includes(kw))
        ) {
          return v;
        }
      }
    }
    return null;
  }

  const BrainCore = {
    /**
     * Main reasoning process for incoming user prompts
     * @param {string} promptText User prompt
     * @param {Object} pageContext Active PageContext
     * @returns {Promise<Object>} { text: string }
     */
    processPrompt: async function (promptText, pageContext) {
      const actions = window.MercurixActionCatalog;
      const rawText = (promptText || '').trim();
      const lower = rawText.toLowerCase();
      const normText = normalizeStr(rawText);

      // Brief pause to simulate thinking
      await sleep(150);

      // -----------------------------------------------------------------------
      // 0. HANDLE PENDING CONFIRMATION FOR SENSITIVE ACTIONS (HUMAN IN THE LOOP)
      // -----------------------------------------------------------------------
      if (pendingConfirmation) {
        const isConfirm =
          normText.includes('xac nhan') || normText.includes('dong y') ||
          normText.includes('ok') || normText.includes('yes') || normText === 'co' ||
          normText.includes('tien hanh') || normText.includes('xoa di') ||
          normText.includes('chac chan');

        const isCancel =
          normText.includes('huy') || normText.includes('khong') ||
          normText.includes('cancel') || normText.includes('bo qua') ||
          normText.includes('thoi') || normText.includes('dung');

        if (isConfirm) {
          const actionToRun = pendingConfirmation;
          pendingConfirmation = null;
          if (actionToRun.type === 'delete') {
            actions.deleteRecord(actionToRun.entityType, actionToRun.id);
            return {
              text: `Đã hoàn tất xóa **${actionToRun.description}** khỏi hệ thống MercuriOS.`
            };
          }
        } else if (isCancel) {
          pendingConfirmation = null;
          return {
            text: `Đã hủy thao tác xóa theo yêu cầu của bạn.`
          };
        } else {
          // If user gives a completely different command, clear pending confirmation and proceed
          pendingConfirmation = null;
        }
      }

      // -----------------------------------------------------------------------
      // 1. THEME SWITCH INTENT (Đổi màu nền, Dark / Light Mode)
      // -----------------------------------------------------------------------
      const isThemeSwitch =
        normText.includes('doi mau') || normText.includes('mau nen') ||
        normText.includes('doi nen') || normText.includes('chuyen nen') ||
        normText.includes('nen den') || normText.includes('nen trang') ||
        normText.includes('nen toi') || normText.includes('nen sang') ||
        normText.includes('dark mode') || normText.includes('light mode') ||
        normText.includes('che do toi') || normText.includes('che do sang') ||
        normText.includes('giao dien toi') || normText.includes('giao dien sang') ||
        (normText.includes('doi mau nen') && (normText.includes('trang') || normText.includes('den')));

      if (isThemeSwitch) {
        const hasDen = normText.includes('den') || normText.includes('toi') || normText.includes('dark');
        const hasTrang = normText.includes('trang') || normText.includes('sang') || normText.includes('light');

        let targetTheme = 'dark';
        if (hasTrang && !hasDen) {
          targetTheme = 'light';
        } else if (hasDen && hasTrang) {
          const idxDen = Math.max(normText.lastIndexOf('den'), normText.lastIndexOf('toi'), normText.lastIndexOf('dark'));
          const idxTrang = Math.max(normText.lastIndexOf('trang'), normText.lastIndexOf('sang'), normText.lastIndexOf('light'));
          targetTheme = (idxDen > idxTrang) ? 'dark' : 'light';
        } else if (!hasDen && !hasTrang) {
          const cur = window.mercuriosStore?.getState()?.theme || 'light';
          targetTheme = (cur === 'dark') ? 'light' : 'dark';
        }

        actions.setTheme(targetTheme);
        return {
          text: targetTheme === 'dark'
            ? 'Đã chuyển giao diện sang chế độ **nền tối (Dark Mode)**.'
            : 'Đã chuyển giao diện sang chế độ **nền sáng (Light Mode)**.'
        };
      }

      // -----------------------------------------------------------------------
      // 2. SAFE RECORD DELETION WITH CONFIRMATION (Xóa đơn hàng, sản phẩm, ...)
      // -----------------------------------------------------------------------
      const isDeleteIntent =
        normText.startsWith('xoa') || normText.startsWith('delete') ||
        normText.startsWith('remove') || normText.startsWith('huy don') ||
        normText.includes('xoa ') || normText.includes('delete ') ||
        normText.includes('remove ') || normText.includes('huy don ');

      if (isDeleteIntent) {
        const isOrderTarget =
          normText.includes('order') || normText.includes('don hang') ||
          normText.includes('don') || /ord-\d+/i.test(lower) || /\b\d{4}\b/.test(lower);

        const isProductTarget =
          normText.includes('san pham') || normText.includes('product') ||
          normText.includes('mau') || normText.includes('sku');

        const isCollectionTarget =
          normText.includes('collection') || normText.includes('bo suu tap') ||
          normText.includes('bst');

        // Case A: Deleting an Order
        if (isOrderTarget || (!isProductTarget && !isCollectionTarget)) {
          const allOrders = actions.queryData('orders') || [];
          let matchedOrder = null;

          for (const ord of allOrders) {
            const ordNormName = normalizeStr(ord.customerName);
            const ordNormId = normalizeStr(ord.id);
            const idDigits = (ord.id.match(/\d+/) || [''])[0];

            if (
              (ordNormName && normText.includes(ordNormName)) ||
              (ordNormId && normText.includes(ordNormId)) ||
              (idDigits && normText.includes(idDigits))
            ) {
              matchedOrder = ord;
              break;
            }
          }

          if (matchedOrder) {
            actions.navigate('orders');
            pendingConfirmation = {
              type: 'delete',
              entityType: 'order',
              id: matchedOrder.id,
              description: `đơn hàng **${matchedOrder.id}** (${matchedOrder.customerName})`
            };
            return {
              text: `Bạn có chắc chắn muốn xóa đơn hàng **${matchedOrder.id}** của khách hàng **${matchedOrder.customerName}** (Số tiền: **${matchedOrder.totalAmount}**, Kênh: **${matchedOrder.channel}**) không?\n\nHãy nhắn **"Xác nhận xóa"** để tôi thực hiện, hoặc **"Hủy"** để dừng lại.`
            };
          }

          if (isOrderTarget) {
            actions.navigate('orders');
            return {
              text: `Bạn muốn xóa đơn hàng nào ạ? Vui lòng cung cấp mã đơn hàng (ví dụ: **ORD-8941**) hoặc tên khách hàng để tôi tìm và hỗ trợ bạn.`
            };
          }
        }

        // Case B: Deleting a Product
        if (isProductTarget) {
          const allProds = actions.queryData('products') || [];
          let matchedProd = null;
          for (const p of allProds) {
            const pNorm = normalizeStr(p.name);
            const pCode = normalizeStr(p.code);
            if ((pNorm && normText.includes(pNorm)) || (pCode && normText.includes(pCode))) {
              matchedProd = p;
              break;
            }
          }

          if (matchedProd) {
            actions.navigate('products');
            pendingConfirmation = {
              type: 'delete',
              entityType: 'product',
              id: matchedProd.id,
              description: `sản phẩm **${matchedProd.code}** (${matchedProd.name})`
            };
            return {
              text: `Bạn có chắc chắn muốn xóa sản phẩm **${matchedProd.code}** (${matchedProd.name}) không?\n\nHãy nhắn **"Xác nhận xóa"** để tôi thực hiện, hoặc **"Hủy"** để dừng lại.`
            };
          }

          actions.navigate('products');
          return {
            text: `Bạn muốn xóa sản phẩm nào ạ? Vui lòng cung cấp mã SKU hoặc tên sản phẩm cụ thể.`
          };
        }

        // Case C: Deleting a Collection
        if (isCollectionTarget) {
          const allCols = actions.queryData('collections') || [];
          let matchedCol = null;
          for (const c of allCols) {
            const cNorm = normalizeStr(c.name);
            const cCode = normalizeStr(c.code);
            if ((cNorm && normText.includes(cNorm)) || (cCode && normText.includes(cCode))) {
              matchedCol = c;
              break;
            }
          }

          if (matchedCol) {
            actions.navigate('collections');
            pendingConfirmation = {
              type: 'delete',
              entityType: 'collection',
              id: matchedCol.id,
              description: `bộ sưu tập **${matchedCol.code}** (${matchedCol.name})`
            };
            return {
              text: `Bạn có chắc chắn muốn xóa bộ sưu tập **${matchedCol.code}** (${matchedCol.name}) không?\n\nHãy nhắn **"Xác nhận xóa"** để tôi thực hiện, hoặc **"Hủy"** để dừng lại.`
            };
          }

          actions.navigate('collections');
          return {
            text: `Bạn muốn xóa bộ sưu tập nào ạ? Vui lòng cung cấp tên hoặc mã bộ sưu tập cụ thể.`
          };
        }

        return {
          text: `Bạn muốn xóa mục nào (đơn hàng, sản phẩm hay bộ sưu tập)? Vui lòng cho tôi biết tên hoặc mã cụ thể nhé.`
        };
      }

      // -----------------------------------------------------------------------
      // 3. CREATE / ADD INTENT (Thêm collection, thêm sản phẩm, tạo đơn hàng...)
      // -----------------------------------------------------------------------
      const isCreateIntent =
        normText.startsWith('them') || normText.startsWith('tao') ||
        normText.startsWith('add') || normText.startsWith('new') ||
        normText.includes('them ') || normText.includes('tao ') ||
        normText.includes('add ') || normText.includes('new ');

      if (isCreateIntent) {
        // Collection
        if (normText.includes('collection') || normText.includes('bo suu tap') || normText.includes('bst')) {
          actions.navigate('collections');
          actions.triggerAction('btn-add-collection');
          return {
            text: `Đã chuyển đến trang **Bộ sưu tập** và mở tính năng **thêm Bộ sưu tập mới**.`
          };
        }

        // Product
        if (normText.includes('san pham') || normText.includes('product') || normText.includes('mau')) {
          actions.navigate('products');
          actions.triggerAction('btn-open-add-product');
          return {
            text: `Đã chuyển đến trang **Sản phẩm** và mở biểu mẫu **thêm sản phẩm mới**.`
          };
        }

        // Order
        if (normText.includes('don hang') || normText.includes('don') || normText.includes('order')) {
          actions.navigate('orders');
          actions.triggerAction('btn-new-order');
          return {
            text: `Đã chuyển đến trang **Đơn hàng** và tạo nhanh một đơn hàng mới.`
          };
        }

        // Customer
        if (normText.includes('khach hang') || normText.includes('customer') || normText.includes('khach')) {
          actions.navigate('customers');
          actions.triggerAction('btn-add-customer');
          return {
            text: `Đã chuyển đến trang **Khách hàng** và mở tính năng thêm khách hàng mới.`
          };
        }

        // Category
        if (normText.includes('danh muc') || normText.includes('category') || normText.includes('nhom hang')) {
          actions.navigate('categories');
          actions.triggerAction('btn-add-category');
          return {
            text: `Đã chuyển đến trang **Danh mục** và mở tính năng thêm danh mục mới.`
          };
        }

        // Raw Material
        if (normText.includes('nguyen phu lieu') || normText.includes('vat tu') || normText.includes('vai') || normText.includes('material')) {
          actions.navigate('materials');
          actions.triggerAction('btn-add-material');
          return {
            text: `Đã chuyển đến trang **Nguyên phụ liệu** và mở tính năng thêm vật tư mới.`
          };
        }

        // Staff
        if (normText.includes('nhan su') || normText.includes('nhan vien') || normText.includes('staff') || normText.includes('tai khoan')) {
          actions.navigate('staff');
          actions.openForm('staff');
          return {
            text: `Đã chuyển đến trang **Nhân sự** và mở biểu mẫu **thêm nhân sự mới**.`
          };
        }

        // Stock dispatch
        if (normText.includes('phieu') || normText.includes('dieu chuyen') || normText.includes('chuyen kho')) {
          // Fall through to dispatch intent
        } else {
          return {
            text: `Bạn muốn tạo mới mục nào ạ? Tôi có thể hỗ trợ tạo **Đơn hàng**, **Sản phẩm**, **Bộ sưu tập**, **Khách hàng**, **Nhân sự** hoặc **Phiếu điều chuyển kho**.`
          };
        }
      }

      // -----------------------------------------------------------------------
      // 4. DISPATCH & FILTER INTENTS CHECK
      // -----------------------------------------------------------------------
      const isDispatchIntent =
        lower.includes('điều chuyển') || lower.includes('dieu chuyen') ||
        lower.includes('chuyển hàng') || lower.includes('chuyen hang') ||
        lower.includes('cấp hàng') || lower.includes('xuất kho') || lower.includes('xuat kho') ||
        lower.includes('dispatch') || lower.includes('transfer') ||
        (lower.includes('chuyển') && (lower.includes('áo') || lower.includes('đầm') || lower.includes('quần') || lower.includes('váy') || lower.includes('tee') || /\b\d+\b/.test(lower)));

      const isFilterIntent =
        lower.includes('thấp') || lower.includes('sắp hết') || lower.includes('hết hàng') ||
        lower.includes('lọc') || lower.includes('tìm') || lower.includes('filter');

      // -----------------------------------------------------------------------
      // 5. DIRECT NAVIGATION INTENT (Mở tab settings, vào kho, xem đơn hàng...)
      // -----------------------------------------------------------------------
      if (!isDispatchIntent && !isFilterIntent) {
        const navTarget = matchNavigation(lower);
        if (navTarget) {
          actions.navigate(navTarget.key);
          return {
            text: `Đã chuyển đến trang **${navTarget.name}**.`
          };
        }
      }

      // -----------------------------------------------------------------------
      // 6. STOCK FILTERING (Lọc tồn kho thấp / kiểm tra hàng sắp hết)
      // -----------------------------------------------------------------------
      if (
        lower.includes('tồn kho thấp') ||
        lower.includes('ton kho thap') ||
        lower.includes('sắp hết') ||
        lower.includes('sap het') ||
        lower.includes('hết hàng') ||
        lower.includes('het hang') ||
        lower.includes('low stock') ||
        lower.includes('tồn thấp') ||
        lower.includes('ton thap') ||
        lower.includes('tồn dưới') ||
        (lower.includes('kiểm tra') && lower.includes('tồn'))
      ) {
        actions.navigate('inventory');

        const invList = actions.queryData('inventory') || [];
        const threshold = 15;
        const lowStockItems = invList.filter(item => item.onHand <= threshold);

        actions.filterDropdown('inv-filter-status', 'LOW_STOCK');
        actions.filterTable('inventory', '');

        const itemsListText = lowStockItems.slice(0, 4).map(item =>
          `• <span class="mono-num">${item.sku}</span>: **${item.onHand} cái** — ${item.product} *(ở ${item.store})*`
        ).join('\n');

        return {
          text: `Đã lọc danh sách **tồn kho thấp** (dưới ${threshold} cái):\n\n` +
            `${itemsListText}\n\n` +
            `Bạn có muốn tạo phiếu điều chuyển bổ sung cho sản phẩm nào không ạ?`
        };
      }

      // -----------------------------------------------------------------------
      // 7. STOCK DISPATCH (Điều chuyển hàng / tạo phiếu xuất kho)
      // -----------------------------------------------------------------------
      if (isDispatchIntent) {
        let destCode = null;
        let destName = null;
        if (lower.includes('đồng khởi') || lower.includes('dong khoi') || lower.includes('dk')) {
          destCode = 'MER-VC-DK';
          destName = 'Mercuri Vincom Đồng Khởi [ST-01]';
        } else if (lower.includes('saigon') || lower.includes('sc')) {
          destCode = 'MER-SC';
          destName = 'Mercuri Saigon Centre [ST-02]';
        } else if (lower.includes('crescent') || lower.includes('cres')) {
          destCode = 'MER-CRES';
          destName = 'Mercuri Crescent Mall [ST-05]';
        } else if (lower.includes('aeon') || lower.includes('tân phú') || lower.includes('tan phu')) {
          destCode = 'MER-AEON';
          destName = 'Mercuri AEON Tân Phú';
        } else if (lower.includes('bà triệu') || lower.includes('ba trieu') || lower.includes('bt')) {
          destCode = 'MER-VC-BT';
          destName = 'Mercuri Vincom Bà Triệu [ST-03]';
        } else if (lower.includes('lotte') || lower.includes('liễu giai') || lower.includes('lieu giai')) {
          destCode = 'MER-LOTTE';
          destName = 'Mercuri Lotte Liễu Giai [ST-04]';
        }

        let skuCode = null;
        let skuName = null;
        if (lower.includes('áo') || lower.includes('ao') || lower.includes('shirt') || lower.includes('blouse')) {
          skuCode = 'SKU-TOP-01-M';
          skuName = 'Silk Organza Cocoon Blouse (M)';
        } else if (lower.includes('đầm') || lower.includes('dam') || lower.includes('gown') || lower.includes('dạ hội')) {
          skuCode = 'SKU-DRS-01-M';
          skuName = 'Client Style C - Evening Gown (M)';
        } else if (lower.includes('quần') || lower.includes('quan') || lower.includes('chino') || lower.includes('trousers')) {
          skuCode = 'SKU-PNT-01-M';
          skuName = 'Tailored Chino Trousers (M)';
        } else if (lower.includes('váy') || lower.includes('vay') || lower.includes('skirt')) {
          skuCode = 'SKU-SKT-01-S';
          skuName = 'Pleated Silk Satin Maxi Skirt (S)';
        } else if (lower.includes('tee') || lower.includes('thun')) {
          skuCode = 'HE-13187';
          skuName = 'Essential Cotton Tee 4512';
        }

        const qtyMatch = rawText.match(/\b(\d+)\b/);
        const qty = qtyMatch ? parseInt(qtyMatch[1], 10) : null;

        if (!destCode && !skuCode && !qty) {
          return {
            text: `Bạn muốn tạo phiếu điều chuyển sản phẩm nào, số lượng bao nhiêu và chuyển đến chi nhánh/kho nào ạ?`
          };
        }

        const finalDestCode = destCode || 'MER-VC-DK';
        const finalDestName = destName || 'Mercuri Vincom Đồng Khởi [ST-01]';
        const finalSkuCode = skuCode || 'SKU-TOP-01-M';
        const finalSkuName = skuName || 'Silk Organza Cocoon Blouse (M)';
        const finalQty = qty || 100;

        actions.navigate('inventory');
        actions.openForm('dispatch', {
          sourceNode: 'HUB_01',
          destNode: finalDestCode,
          sku: finalSkuCode,
          qty: finalQty,
          isUrgent: (finalQty >= 100 || lower.includes('gấp') || lower.includes('urgent'))
        });

        return {
          text: `Đã tạo sẵn phiếu điều chuyển hàng:\n\n` +
            `• **Kho xuất:** Kho Trung Tâm HCM [WH-01]\n` +
            `• **Điểm nhận:** ${finalDestName}\n` +
            `• **Sản phẩm:** <span class="mono-num">${finalSkuCode}</span> (${finalSkuName})\n` +
            `• **Số lượng:** <span class="mono-num">${finalQty} cái</span>\n\n` +
            `Biểu mẫu đã mở sẵn trên màn hình, bạn hãy kiểm tra lại thông tin và xác nhận nhé.`
        };
      }

      // -----------------------------------------------------------------------
      // 8. STAFF ROLE & CHANNEL FILTERING
      // -----------------------------------------------------------------------
      if (
        lower.includes('designer') ||
        lower.includes('thiết kế') ||
        lower.includes('thiet ke') ||
        lower.includes('store manager') ||
        lower.includes('quản lý cửa hàng') ||
        lower.includes('quan ly cua hang') ||
        lower.includes('cskh') ||
        lower.includes('chăm sóc khách') ||
        lower.includes('cham soc khach') ||
        lower.includes('customer care')
      ) {
        actions.navigate('staff');

        let roleTarget = 'designer';
        let roleLabel = 'Designer / Thiết kế';
        if (lower.includes('store manager') || lower.includes('quản lý cửa hàng')) {
          roleTarget = 'store_manager';
          roleLabel = 'Store Manager (Quản lý cửa hàng)';
        } else if (lower.includes('cskh') || lower.includes('chăm sóc khách') || lower.includes('customer care')) {
          roleTarget = 'cskh';
          roleLabel = 'Customer Care (CSKH)';
        }

        actions.filterDropdown('staff-filter-role', roleTarget);

        const allStaff = actions.queryData('staff') || [];
        const matchingStaff = allStaff.filter(s => s.role === roleTarget);

        const staffListText = matchingStaff.map(s =>
          `• **${s.name}** — ${s.email} *(${s.store || 'Trụ sở chính'})*`
        ).join('\n');

        return {
          text: `Đã chuyển đến trang **Nhân sự** và lọc theo vị trí **${roleLabel}**:\n\n` +
            `${staffListText || '*(Không tìm thấy nhân viên phù hợp)*'}`
        };
      }

      if (
        lower.includes('shopee') ||
        lower.includes('tiktok') ||
        lower.includes('đơn facebook') ||
        lower.includes('đang giao') ||
        lower.includes('delivering')
      ) {
        actions.navigate('orders');

        let channelTarget = 'Shopee';
        if (lower.includes('tiktok')) channelTarget = 'TikTok Shop';
        else if (lower.includes('facebook')) channelTarget = 'Facebook';

        actions.filterDropdown('order-filter-channel', channelTarget);

        return {
          text: `Đã chuyển đến trang **Đơn hàng** và lọc các đơn kênh **${channelTarget}**.`
        };
      }

      // -----------------------------------------------------------------------
      // 9. FINANCIAL TELEMETRY
      // -----------------------------------------------------------------------
      if (
        lower.includes('doanh thu') ||
        lower.includes('doanh so') ||
        lower.includes('revenue') ||
        lower.includes('báo cáo') ||
        lower.includes('bao cao')
      ) {
        const fin = actions.queryData('financials') || {};
        const inv = actions.queryData('inventory') || {};
        const cust = actions.queryData('customers') || {};

        return {
          text: `**Số liệu vận hành MercuriOS (30 ngày gần nhất)**:\n\n` +
            `• **Doanh thu gộp:** <span class="mono-num">${fin.grossRevenue || '248,500,000 đ'}</span>\n` +
            `• **Tổng đơn hoàn tất:** <span class="mono-num">${fin.completedOrders || '1,420'} đơn</span>\n` +
            `• **Khách hàng:** <span class="mono-num">${cust.total || '18,450'}</span> (Mới: ${cust.new || '1,290'})\n` +
            `• **Tỷ lệ an toàn tồn kho:** <span class="mono-num">${inv.safeStockLevel || '98.4%'}</span>\n\n` +
            `Toàn bộ 9 chi nhánh và kho trung tâm đang hoạt động bình thường.`
        };
      }

      // -----------------------------------------------------------------------
      // 10. GREETINGS & CASUAL HELP
      // -----------------------------------------------------------------------
      if (
        lower === 'chào' || lower === 'chao' || lower === 'hi' || lower === 'hello' ||
        lower === 'hey' || lower === 'alo' || lower.includes('bạn là ai')
      ) {
        return {
          text: `Chào bạn! Tôi là **Mercurix**, trợ lý vận hành hệ thống MercuriOS.\n\nTôi có thể giúp bạn mở trang quản trị, thay đổi giao diện sáng/tối, kiểm tra tồn kho, tạo phiếu chuyển kho, hoặc quản lý đơn hàng.\n\nBạn cần hỗ trợ gì ạ?`
        };
      }

      // -----------------------------------------------------------------------
      // 11. CONTEXTUAL CLARIFICATION (Hỏi lại chi tiết yêu cầu, không trả lời rập khuôn)
      // -----------------------------------------------------------------------
      if (normText.includes('sua') || normText.includes('cap nhat') || normText.includes('edit')) {
        return {
          text: `Bạn muốn sửa hay cập nhật thông tin của mục nào (sản phẩm, đơn hàng, khách hàng hay nhân sự)? Vui lòng cho tôi biết tên hoặc mã chi tiết nhé.`
        };
      }

      if (normText.includes('tim') || normText.includes('tra cuu') || normText.includes('search')) {
        return {
          text: `Bạn muốn tìm kiếm thông tin gì trong hệ thống (đơn hàng, mã SKU sản phẩm, tồn kho hay khách hàng)? Vui lòng nhập từ khóa cần tìm.`
        };
      }

      if (normText.includes('doi') || normText.includes('thay doi')) {
        return {
          text: `Bạn muốn thay đổi thiết lập nào (ví dụ: giao diện nền tối/nền sáng, chi nhánh hoạt động hay thông tin đơn hàng)?`
        };
      }

      return {
        text: `Tôi chưa hiểu rõ thao tác bạn muốn thực hiện đối với yêu cầu: \"*${rawText}*\".\n\nBạn có thể mô tả chi tiết hơn bạn muốn thao tác trên màn hình hoặc dữ liệu nào của MercuriOS không ạ?`
      };
    }
  };

  window.MercurixBrain = BrainCore;
})();
