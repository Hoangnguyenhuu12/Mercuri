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
      ]
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
}

// Global Store Instance
window.mercuriosStore = new MercuriosStore();
