/**
 * MERCURIOS // MERCURIX AI BRIDGE
 * Official programmatic API surface for Mercurix AI Agents and automation workers.
 * Exposes headless control, state listeners, and modular widget mounting.
 */

(function () {
  'use strict';

  const bridge = {
    version: '1.0.0-alpha',
    system: 'mercurios',
    targetAgent: 'mercurix',

    /**
     * Get snapshot of entire operations state
     */
    getState: function () {
      return window.mercuriosStore ? window.mercuriosStore.getState() : null;
    },

    /**
     * Change operational node (central hub, ecom fulfillment, retail stores)
     */
    switchNode: function (nodeId) {
      if (window.mercuriosStore) {
        window.mercuriosStore.setNode(nodeId);
        this.notifyUI(`[AI/MERCURIX] Switched Node to ${nodeId}`);
      }
    },

    /**
     * Programmatically trigger an automated stock dispatch
     */
    dispatchStock: function (dispatchData) {
      if (!window.mercuriosStore) return;
      const newItem = {
        id: `DISP-${Math.floor(1000 + Math.random() * 9000)}`,
        node: dispatchData.node || 'HUB_01',
        sku: dispatchData.sku || 'AUTO-SKU',
        destination: dispatchData.destination || 'OUTLET-AUTO',
        qty: dispatchData.qty || 10,
        status: dispatchData.status || 'PENDING'
      };
      window.mercuriosStore.addExecutionItem(newItem);
      this.notifyUI(`[AI/MERCURIX] Order ${newItem.id} created`);
      return newItem;
    },

    /**
     * Update any metric directly
     */
    setMetric: function (category, key, value) {
      if (window.mercuriosStore) {
        window.mercuriosStore.updateMetric(category, key, value);
        this.notifyUI(`[AI/MERCURIX] Updated ${category}.${key}`);
      }
    },

    /**
     * Register dynamic widget/component (e.g. AI Shopee / TikTok Charts)
     */
    registerModule: function (containerSelector, renderCallback) {
      const container = document.querySelector(containerSelector);
      if (!container) {
        console.warn(`[MercurixBridge] Container ${containerSelector} not found.`);
        return false;
      }
      try {
        container.innerHTML = '';
        renderCallback(container, this.getState());
        console.log(`[MercurixBridge] Module mounted successfully into ${containerSelector}`);
        return true;
      } catch (err) {
        console.error(`[MercurixBridge] Module mounting failed:`, err);
        return false;
      }
    },

    /**
     * Listen to state changes
     */
    onStateChange: function (callback) {
      if (window.mercuriosStore) {
        return window.mercuriosStore.subscribe(callback);
      }
    },

    /**
     * Trigger system toast notification
     */
    notifyUI: function (msg) {
      if (window.MercuriosUI && window.MercuriosUI.showToast) {
        window.MercuriosUI.showToast(msg);
      } else {
        console.log(`[Mercurios UI Notice] ${msg}`);
      }
    }
  };

  // Expose global bridge
  window.Mercurios = bridge;
  console.log('[MercurixBridge] Initialized and listening on window.Mercurios');
})();
