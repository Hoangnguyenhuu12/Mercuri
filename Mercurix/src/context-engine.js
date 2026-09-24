/**
 * MERCURIX // CONTEXT ENGINE
 * Extracts active PageContext, observes workspace telemetry, and yields context-aware action chips.
 * Part of Mercurix AI Brain Architecture.
 */

(function () {
  'use strict';

  const ContextEngine = {
    /**
     * Read current PageContext from MercuriOS host
     */
    getPageContext: function () {
      const store = window.mercuriosStore;
      if (!store) {
        return {
          view: 'overview',
          node: 'ALL_NODES',
          user: 'Admin'
        };
      }
      const state = store.getState();
      return {
        view: state.currentView || 'overview',
        node: state.currentNode || 'ALL_NODES',
        activeOutletsCount: (state.outlets || []).length,
        pendingOrdersCount: (state.financials?.pendingOrders || '0'),
        lowStockSkusCount: (state.inventory?.lowStockSkus || '0'),
        timestamp: Date.now()
      };
    },

    /**
     * Yield suggested quick action prompts based on current view
     */
    getContextChips: function (view) {
      const currentView = (view || this.getPageContext().view || 'overview').toLowerCase();

      switch (currentView) {
        case 'inventory':
          return [
            'Filter Low Stock (<= 15)',
            'Transfer 100 Shirts to Dong Khoi',
            'Show All Stock',
            'Transfer 50 Silk Gowns to Saigon Centre'
          ];
        case 'stores':
          return [
            'Filter Flagship Boutiques',
            'Show Central Warehouse Info',
            'Dispatch 50 Units to Crescent Mall'
          ];
        case 'staff':
          return [
            'Filter Designers',
            'Filter Store Managers',
            'Filter CSKH (Customer Care)',
            'Filter HR Staff'
          ];
        case 'orders':
          return [
            'Filter Shopee Orders',
            'Filter Delivering Orders',
            'Show Paid Orders',
            'Show High Value Orders (> 5M)'
          ];
        case 'products':
          return [
            'Filter Tops (Áo)',
            'Show Styles under 5M',
            'Catalog Summary'
          ];
        case 'inbox':
          return [
            'Summarize Customer Inquiries',
            'Check Urgent Messages',
            'Suggest Reply for Active Chat'
          ];
        default:
          return [
            'Filter Low Stock (<= 15)',
            'Transfer 100 Shirts to Dong Khoi',
            'Filter Designers',
            'Today Sales Summary'
          ];
      }
    }
  };

  window.MercurixContextEngine = ContextEngine;
})();
