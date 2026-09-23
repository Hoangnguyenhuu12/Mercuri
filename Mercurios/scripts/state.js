/**
 * MERCURIOS // CENTRAL STATE STORE
 * Supports Dashboard Overview and Products Catalog.
 */

class MercuriosStore {
  constructor() {
    this.subscribers = [];
    
    // Core Initial State
    this.state = {
      theme: 'light',
      currentView: 'overview', // 'overview' or 'products'
      isLive: true,
      currentNode: 'ALL_NODES',
      nodes: [
        { id: 'ALL_NODES', name: 'ALL NODES // CONSOLIDATED' },
        { id: 'HUB_01', name: 'CENTRAL HUB [WH-01]' },
        { id: 'ECOM_01', name: 'ECOM FULFILLMENT [WH-02]' },
        { id: 'OUTLET_FLAGSHIP', name: 'FLAGSHIP STORE [ST-01]' },
        { id: 'OUTLETS_CHAIN', name: 'RETAIL OUTLETS (9 UNITS)' }
      ],
      financials: {
        grossRevenue: '248,500,000 đ',
        netRevenue: '219,800,000 đ',
        completedOrders: '1,420',
        pendingOrders: '38'
      },
      customers: {
        total: '18,450',
        new: '1,290'
      },
      inventory: {
        totalSkus: '4,850',
        lowStockSkus: '12',
        safeStockLevel: '98.4%',
        inTransitUnits: '3,200'
      },
      omnichannel: {
        activeOutlets: '9',
        ordersPacking: '84',
        returnRate: '0.8%',
        runningPos: '10'
      },
      executionQueue: [
        {
          id: 'DISP-8902',
          node: 'HUB_01',
          sku: 'DENIM-JKT-L',
          destination: 'OUTLET-01',
          qty: 120,
          status: 'URGENT'
        },
        {
          id: 'DISP-8903',
          node: 'ECOM_01',
          sku: 'LINEN-SHIRT-M',
          destination: 'SHOPEE-FULFILL',
          qty: 45,
          status: 'PENDING'
        },
        {
          id: 'DISP-8904',
          node: 'HUB_01',
          sku: 'COTTON-TEE-BLK',
          destination: 'OUTLET-04',
          qty: 200,
          status: 'URGENT'
        },
        {
          id: 'DISP-8905',
          node: 'ECOM_01',
          sku: 'CHINO-PNT-32',
          destination: 'TIKTOK-EXPRESS',
          qty: 30,
          status: 'PENDING'
        }
      ],
      // PRODUCTS CATALOG (EXACT MATCH TO REFERENCE SAMPLE)
      productMetrics: {
        total: 5,
        activeForSale: 5,
        avgPrice: '25,220,000 đ',
        featured: 0
      },
      products: [
        {
          id: 'prod-1',
          sku: 'HE-88889',
          name: 'Client Style C - Evening Gown',
          category: 'Dress',
          collection: '—',
          price: '60,000,000 đ',
          priceNum: 60000000,
          status: 'Active'
        },
        {
          id: 'prod-2',
          sku: 'HE-66550',
          name: 'Linen Overshirt B - Cocoon',
          category: 'Top',
          collection: 'Fall/Winter 2026 — Cocoon',
          price: '60,000,000 đ',
          priceNum: 60000000,
          status: 'Active'
        },
        {
          id: 'prod-3',
          sku: 'HE-35680',
          name: 'Pleated Silk Skirt A',
          category: 'Skirt',
          collection: 'Holiday Sparkle 2026',
          price: '5,000,000 đ',
          priceNum: 5000000,
          status: 'Active'
        },
        {
          id: 'prod-4',
          sku: 'HE-13187',
          name: 'Essential Cotton Tee 4512',
          category: 'Tee',
          collection: '—',
          price: '1,000,000 đ',
          priceNum: 1000000,
          status: 'Active'
        },
        {
          id: 'prod-5',
          sku: 'HE-68809',
          name: 'Tailored Chino Trousers 123',
          category: 'Pants',
          collection: 'Fall/Winter 2026 — Cocoon',
          price: '100,000 đ',
          priceNum: 100000,
          status: 'Active'
        }
      ],
      // CATEGORIES (EXACT MATCH TO REFERENCE SAMPLE)
      categories: [
        { id: 'cat-1', code: 'CAT-AO', name: 'Tops (Áo)', slug: 'ao', parent: '—', sort: 1, status: 'Active' },
        { id: 'cat-2', code: 'CAT-QUAN', name: 'Bottoms (Quần)', slug: 'quan', parent: '—', sort: 2, status: 'Active' },
        { id: 'cat-3', code: 'CAT-VAY', name: 'Skirts (Váy)', slug: 'vay', parent: '—', sort: 3, status: 'Active' },
        { id: 'cat-4', code: 'CAT-DAM', name: 'Dresses (Đầm)', slug: 'dam', parent: '—', sort: 4, status: 'Active' },
        { id: 'cat-5', code: 'CAT-SET', name: 'Sets (Set bộ)', slug: 'set-bo', parent: '—', sort: 5, status: 'Active' },
        { id: 'cat-6', code: 'CAT-OUTER', name: 'Outerwear (Áo khoác)', slug: 'ao-khoac', parent: '—', sort: 6, status: 'Active' },
        { id: 'cat-7', code: 'CAT-PK', name: 'Accessories (Phụ kiện)', slug: 'phu-kien', parent: '—', sort: 7, status: 'Active' },
        { id: 'cat-8', code: 'CAT-DOLOT', name: 'Underwear (Đồ lót)', slug: 'do-lot', parent: '—', sort: 8, status: 'Active' }
      ],
      // COLLECTIONS (EXACT MATCH TO REFERENCE SAMPLE)
      collections: [
        { id: 'col-1', code: 'HOL-26', name: 'Holiday Sparkle 2026', season: 'holiday 2026', theme: 'Sequins, gold, party', launch: '01 Dec', targetSkus: 30, budget: '700,000,000 đ', status: 'Planning' },
        { id: 'col-2', code: 'FW26', name: 'Fall/Winter 2026 — Cocoon', season: 'fall 2026', theme: 'Earth tones, oversize, cozy knit', launch: '20 Aug', targetSkus: 70, budget: '1,800,000,000 đ', status: 'Design' },
        { id: 'col-3', code: 'CAP-LUX', name: 'Capsule Luxe', season: 'capsule 2026', theme: 'Black-tie, satin, evening', launch: '10 Apr', targetSkus: 22, budget: '500,000,000 đ', status: 'Sample' },
        { id: 'col-4', code: 'SS26', name: 'Spring/Summer 2026 — Bloom', season: 'spring 2026', theme: 'Floral pastel, linen, romantic', launch: '15 Feb', targetSkus: 60, budget: '1,500,000,000 đ', status: 'Active' },
        { id: 'col-5', code: 'CAP-VAL', name: 'Capsule Valentine 2026', season: 'capsule 2026', theme: 'Red & lace, party night', launch: '01 Feb', targetSkus: 18, budget: '400,000,000 đ', status: 'Active' }
      ],
      // RAW MATERIALS & FABRICS (EXACT MATCH TO REFERENCE SAMPLE)
      materials: [
        { id: 'mat-1', code: 'MAT-1015', name: 'Hein Medium Packaging Box', type: 'packaging', color: '—', uom: 'piece', price: '4,500 đ', onHand: '1,468.3', supplier: 'Bao bi Tan Phu' },
        { id: 'mat-2', code: 'MAT-1014', name: 'OPP Bag 25x35cm', type: 'packaging', color: '—', uom: 'piece', price: '600 đ', onHand: '508.8', supplier: 'Bao bi Tan Phu' },
        { id: 'mat-3', code: 'MAT-1013', name: 'Care Label Tag', type: 'label', color: '—', uom: 'piece', price: '400 đ', onHand: '529.2', supplier: 'YKK Vietnam' },
        { id: 'mat-4', code: 'MAT-1012', name: 'Woven Neck Label Hein', type: 'label', color: '—', uom: 'piece', price: '900 đ', onHand: '1,115.8', supplier: 'YKK Vietnam' },
        { id: 'mat-5', code: 'MAT-1011', name: 'Polyester Thread 5000m White', type: 'thread', color: 'White', uom: 'piece', price: '35,000 đ', onHand: '829.5', supplier: 'YKK Vietnam' },
        { id: 'mat-6', code: 'MAT-1010', name: 'Pearl Button 14mm White', type: 'button', color: 'White Pearl', uom: 'piece', price: '2,500 đ', onHand: '830.4', supplier: 'YKK Vietnam' },
        { id: 'mat-7', code: 'MAT-1009', name: 'Metal Snap Button 12mm', type: 'button', color: '—', uom: 'piece', price: '1,500 đ', onHand: '865.9', supplier: 'YKK Vietnam' },
        { id: 'mat-8', code: 'MAT-1008', name: 'Invisible Zipper 60cm', type: 'zipper', color: '—', uom: 'piece', price: '8,000 đ', onHand: '449.5', supplier: 'YKK Vietnam' },
        { id: 'mat-9', code: 'MAT-1007', name: 'Brass Zipper 18cm Gold', type: 'zipper', color: 'Gold', uom: 'piece', price: '4,500 đ', onHand: '648.4', supplier: 'YKK Vietnam' }
      ],

      // ORDERS (BÁN HÀNG - ĐƠN HÀNG)
      orders: [
        {
          id: 'ORD-8941',
          customerName: 'Tran Thanh Ha',
          phone: '0912345678',
          channel: 'Shopee',
          hub: 'Central Hub [WH-01]',
          totalAmount: '2,450,000 đ',
          paymentStatus: 'PAID',
          status: 'DELIVERING',
          createdAt: '23/09/2026 14:20',
          items: 'Pleated Silk Skirt A x1, Essential Cotton Tee x2'
        },
        {
          id: 'ORD-8940',
          customerName: 'Le Thi Mai',
          phone: '0988776655',
          channel: 'TikTok Shop',
          hub: 'Ecom Hub [WH-02]',
          totalAmount: '1,200,000 đ',
          paymentStatus: 'PAID',
          status: 'PROCESSING',
          createdAt: '23/09/2026 13:50',
          items: 'Essential Cotton Tee 4512 x1'
        },
        {
          id: 'ORD-8939',
          customerName: 'Toan Duc',
          phone: '0933221100',
          channel: 'Facebook',
          hub: 'Flagship Store [ST-01]',
          totalAmount: '60,000,000 đ',
          paymentStatus: 'UNPAID',
          status: 'PENDING',
          createdAt: '23/09/2026 13:15',
          items: 'Client Style C - Evening Gown x1'
        },
        {
          id: 'ORD-8938',
          customerName: 'Nguyen Van Nam',
          phone: '0909112233',
          channel: 'Store',
          hub: 'Flagship Store [ST-01]',
          totalAmount: '60,100,000 đ',
          paymentStatus: 'PAID',
          status: 'COMPLETED',
          createdAt: '23/09/2026 11:30',
          items: 'Linen Overshirt B x1, Tailored Chino Trousers x1'
        },
        {
          id: 'ORD-8937',
          customerName: 'Pham Quynh Anh',
          phone: '0945667788',
          channel: 'Website',
          hub: 'Central Hub [WH-01]',
          totalAmount: '5,000,000 đ',
          paymentStatus: 'PAID',
          status: 'COMPLETED',
          createdAt: '22/09/2026 19:40',
          items: 'Pleated Silk Skirt A x1'
        },
        {
          id: 'ORD-8936',
          customerName: 'Do Minh Tuan',
          phone: '0977112244',
          channel: 'Lazada',
          hub: 'Ecom Hub [WH-02]',
          totalAmount: '890,000 đ',
          paymentStatus: 'REFUNDED',
          status: 'CANCELLED',
          createdAt: '22/09/2026 16:15',
          items: 'Tailored Chino Trousers x1'
        }
      ],

      // CUSTOMERS CRM 360 (BÁN HÀNG - KHÁCH HÀNG)
      crmCustomers: [
        {
          id: 'CUST-1001',
          name: 'Toan Duc',
          phone: '0933221100',
          email: 'toanduc@gmail.com',
          tier: 'VIP',
          ordersCount: 8,
          totalSpent: '68,500,000 đ',
          points: 6850,
          source: 'Facebook',
          joinedDate: '15/01/2026'
        },
        {
          id: 'CUST-1002',
          name: 'Tran Thanh Ha',
          phone: '0912345678',
          email: 'hathanhtran@gmail.com',
          tier: 'Gold',
          ordersCount: 5,
          totalSpent: '18,200,000 đ',
          points: 1820,
          source: 'Shopee',
          joinedDate: '02/03/2026'
        },
        {
          id: 'CUST-1003',
          name: 'Le Thi Mai',
          phone: '0988776655',
          email: 'maile.fashion@gmail.com',
          tier: 'Silver',
          ordersCount: 3,
          totalSpent: '6,400,000 đ',
          points: 640,
          source: 'TikTok Shop',
          joinedDate: '10/05/2026'
        },
        {
          id: 'CUST-1004',
          name: 'Nguyen Van Nam',
          phone: '0909112233',
          email: 'nam.nguyen@vcorp.vn',
          tier: 'Diamond',
          ordersCount: 14,
          totalSpent: '162,000,000 đ',
          points: 16200,
          source: 'Store',
          joinedDate: '08/11/2025'
        },
        {
          id: 'CUST-1005',
          name: 'Pham Quynh Anh',
          phone: '0945667788',
          email: 'quynhanh.p@outlook.com',
          tier: 'Gold',
          ordersCount: 6,
          totalSpent: '24,800,000 đ',
          points: 2480,
          source: 'Website',
          joinedDate: '20/04/2026'
        }
      ],

      // OMNICHANNEL INBOX // HỘP THƯ ĐA KÊNH & MERCURIX AI COPILOT
      inbox: {
        activeConversationId: 'conv-1',
        filterChannel: 'ALL',
        filterStatus: 'ALL',
        aiAutoPilot: true,
        showSideDrawer: false, // Mặc định ẩn để giao diện thoáng mắt, mở qua nút toggle
        activeDrawerTab: 'crm', // 'crm' | 'ai-sim' | 'metrics'
        conversations: [
          {
            id: 'conv-1',
            customerId: 'CUST-1001',
            name: 'Toan Duc',
            phone: '0933221100',
            channel: 'FB',
            page: 'HEIN ONE Fashion - Fanpage',
            unread: false,
            starred: true,
            status: 'OPEN',
            priority: 'NORMAL',
            aiHandling: true,
            lastActivity: '14:22',
            messages: [
              { id: 'm1', sender: 'shop', time: '14:10', text: 'Dạ HEIN ONE xin chào anh Toàn Đức! Em có thể tư vấn gì cho mình ạ?' },
              { id: 'm2', sender: 'customer', time: '14:12', text: 'Dạ shop em xin báo giá sản phẩm bên dưới ạ. Mình bên em có ưu đãi free ship cho đơn từ 500k nhé ạ?' },
              { id: 'm3', sender: 'shop', isAi: true, time: '14:13', text: 'Dạ vâng đúng rồi ạ! Đơn hàng trên 500.000đ shop hỗ trợ freeship toàn quốc. Anh Toàn Đức đang quan tâm mẫu Evening Gown hay đầm lụa Pleated Silk ạ?' },
              { id: 'm4', sender: 'customer', time: '14:20', text: 'Mẫu đầm dạ hội Evening Gown còn size M không shop? Có giao kịp tối nay ở Q1 không?' },
              { id: 'm5', sender: 'shop', isAi: true, time: '14:22', text: 'Dạ mẫu Client Style C - Evening Gown size M hiện đang có sẵn 2 chiếc tại Flagship Store [ST-01] (123 Nguyễn Trãi, Q1). Shop có thể book shipper giao hỏa tốc đến ngay cho anh trong vòng 45 phút ạ!' }
            ],
            aiSuggestion: 'Dạ anh Toàn Đức gửi giúp em Số điện thoại & Địa chỉ cụ thể để em lên đơn hỏa tốc gửi ngay từ Flagship Store [ST-01] anh nhé!'
          },
          {
            id: 'conv-2',
            customerId: 'CUST-1002',
            name: 'Tran Thanh Ha',
            phone: '0912345678',
            channel: 'SP',
            page: 'Hein Fashion Official',
            unread: true,
            starred: false,
            status: 'OPEN',
            priority: 'HIGH',
            aiHandling: true,
            lastActivity: '13:58',
            messages: [
              { id: 'm21', sender: 'customer', time: '13:55', text: 'Đơn HE-88889 mình đặt hôm qua đã bàn giao cho bên vận chuyển chưa shop ơi?' },
              { id: 'm22', sender: 'shop', isAi: true, time: '13:58', text: 'Dạ kiện hàng của chị Hà đã được xuất kho Ecom [WH-02] và đang trên đường chuyển sang SPX Express, dự kiến sáng mai giao đến chị ạ.' }
            ],
            aiSuggestion: 'Dạ mã vận đơn của chị là SPX883902, chị có thể theo dõi trực tiếp lộ trình trên app Shopee ạ!'
          },
          {
            id: 'conv-3',
            customerId: 'CUST-1003',
            name: 'Le Thi Mai',
            phone: '0988776655',
            channel: 'TT',
            page: 'Hein Fashion TikTok Shop',
            unread: true,
            starred: false,
            status: 'OPEN',
            priority: 'NORMAL',
            aiHandling: false,
            lastActivity: '13:30',
            messages: [
              { id: 'm31', sender: 'customer', time: '13:30', text: 'Shop ơi áo sơ mi lụa trắng Cocoon có quần phối cùng set không ạ?' }
            ],
            aiSuggestion: 'Dạ áo sơ mi Cocoon phối cùng quần Tailored Chino Trousers (HE-68809) là chuẩn set lookbook Fall/Winter bên em ạ!'
          },
          {
            id: 'conv-4',
            customerId: 'CUST-1005',
            name: 'Pham Quynh Anh',
            phone: '0945667788',
            channel: 'IG',
            page: '@heinfashion.studio',
            unread: false,
            starred: true,
            status: 'RESOLVED',
            priority: 'NORMAL',
            aiHandling: true,
            lastActivity: '11:15',
            messages: [
              { id: 'm41', sender: 'customer', time: '11:00', text: 'Mình nhận được đầm rồi nhé, chất vải lụa đẹp lắm, cảm ơn shop!' },
              { id: 'm42', sender: 'shop', isAi: true, time: '11:15', text: 'Dạ shop cảm ơn chị Quỳnh Anh đã tin chọn HEIN ONE! Hẹn gặp lại chị trong BST Holiday Sparkle sắp tới ạ.' }
            ],
            aiSuggestion: ''
          },
          {
            id: 'conv-5',
            customerId: 'CUST-1004',
            name: 'Nguyen Van Nam',
            phone: '0909112233',
            channel: 'ZALO',
            page: 'Hein Fashion Zalo OA VIP',
            unread: false,
            starred: false,
            status: 'OPEN',
            priority: 'VIP',
            aiHandling: false,
            lastActivity: '09:40',
            messages: [
              { id: 'm51', sender: 'customer', time: '09:35', text: 'Chào shop, chiều nay khoảng 16h mình ghé Flagship Store xem mấy mẫu vest mới nhé.' },
              { id: 'm52', sender: 'shop', time: '09:40', text: 'Dạ vâng anh Nam! Em đã báo các bạn tư vấn viên tại Flagship Store [ST-01] chuẩn bị sẵn phòng VIP và các mẫu vest mới nhất đón anh ạ.' }
            ],
            aiSuggestion: ''
          }
        ]
      }
    };
  }

  getState() {
    return { ...this.state };
  }

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(fn => fn !== callback);
    };
  }

  notify() {
    for (const callback of this.subscribers) {
      try {
        callback(this.state);
      } catch (err) {
        console.error('[MercuriosStore] Subscriber error:', err);
      }
    }
  }

  setView(viewName) {
    this.state.currentView = viewName;
    this.notify();
  }

  toggleLive() {
    this.state.isLive = !this.state.isLive;
    this.notify();
  }

  setTheme(theme) {
    this.state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    this.notify();
  }

  setNode(nodeId) {
    this.state.currentNode = nodeId;
    this.notify();
  }

  addExecutionItem(item) {
    this.state.executionQueue.unshift(item);
    this.notify();
  }

  resolveExecutionItem(id) {
    this.state.executionQueue = this.state.executionQueue.filter(item => item.id !== id);
    this.notify();
  }

  addProduct(product) {
    this.state.products.unshift(product);
    this.recalcProductMetrics();
    this.notify();
  }

  deleteProduct(productId) {
    this.state.products = this.state.products.filter(p => p.id !== productId);
    this.recalcProductMetrics();
    this.notify();
  }

  recalcProductMetrics() {
    const list = this.state.products;
    this.state.productMetrics.total = list.length;
    this.state.productMetrics.activeForSale = list.filter(p => p.status === 'Active').length;
    if (list.length > 0) {
      const sum = list.reduce((acc, p) => acc + (p.priceNum || 0), 0);
      const avg = Math.round(sum / list.length);
      this.state.productMetrics.avgPrice = avg.toLocaleString('vi-VN') + ' đ';
    } else {
      this.state.productMetrics.avgPrice = '0 đ';
    }
  }

  // ORDERS METHODS
  addOrder(order) {
    this.state.orders.unshift(order);
    this.notify();
  }

  deleteOrder(orderId) {
    this.state.orders = this.state.orders.filter(o => o.id !== orderId);
    this.notify();
  }

  // CUSTOMERS METHODS
  addCustomer(customer) {
    this.state.crmCustomers.unshift(customer);
    this.notify();
  }

  deleteCustomer(customerId) {
    this.state.crmCustomers = this.state.crmCustomers.filter(c => c.id !== customerId);
    this.notify();
  }

  // INBOX & MERCURIX AI METHODS
  selectConversation(convId) {
    this.state.inbox.activeConversationId = convId;
    const conv = this.state.inbox.conversations.find(c => c.id === convId);
    if (conv) {
      conv.unread = false;
    }
    this.notify();
  }

  toggleInboxDrawer(forceState) {
    if (typeof forceState === 'boolean') {
      this.state.inbox.showSideDrawer = forceState;
    } else {
      this.state.inbox.showSideDrawer = !this.state.inbox.showSideDrawer;
    }
    this.notify();
  }

  setInboxDrawerTab(tab) {
    this.state.inbox.activeDrawerTab = tab;
    this.notify();
  }

  toggleAiAutoPilot() {
    this.state.inbox.aiAutoPilot = !this.state.inbox.aiAutoPilot;
    this.notify();
  }

  sendInboxMessage(convId, text, isAi = false, sender = 'shop') {
    const conv = this.state.inbox.conversations.find(c => c.id === convId);
    if (!conv || !text) return null;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const msg = {
      id: `msg-${Date.now()}`,
      sender: sender,
      isAi: isAi,
      time: timeStr,
      text: text
    };
    conv.messages.push(msg);
    conv.lastActivity = timeStr;
    if (sender === 'customer') {
      conv.unread = (this.state.inbox.activeConversationId !== convId);
    }
    this.notify();
    return msg;
  }

  applyAiSuggestion(convId) {
    const conv = this.state.inbox.conversations.find(c => c.id === convId);
    if (!conv || !conv.aiSuggestion) return;
    const text = conv.aiSuggestion;
    conv.aiSuggestion = '';
    this.sendInboxMessage(convId, text, true, 'shop');
  }
}

// Global Store Instance
window.mercuriosStore = new MercuriosStore();

