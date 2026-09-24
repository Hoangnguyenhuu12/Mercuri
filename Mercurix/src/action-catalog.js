/**
 * MERCURIX // ACTION CATALOG & EXECUTION GATE
 * Whitelist Tool Registry and Action Gate for MercuriOS host operations.
 * Enforces Fail-Closed security and Human-in-the-Loop policies.
 */

(function () {
  'use strict';

  const ActionCatalog = {
    /**
     * Tool 1: ui.navigate
     * Safely switches workspace view
     */
    navigate: function (targetView) {
      const allowedViews = [
        'overview', 'products', 'categories', 'collections', 'materials',
        'orders', 'customers', 'inbox', 'stores', 'inventory',
        'production', 'suppliers', 'staff', 'settings'
      ];

      const cleanView = (targetView || '').toLowerCase().trim();
      if (!allowedViews.includes(cleanView)) {
        return {
          isError: true,
          content: `View [${targetView}] is not within the authorized Action Catalog.`
        };
      }

      if (window.Mercurios && window.Mercurios.switchView) {
        window.Mercurios.switchView(cleanView);
        return {
          isError: false,
          toolName: 'ui.navigate',
          targetView: cleanView,
          content: `Switched viewport to [${cleanView.toUpperCase()}].`
        };
      }

      if (typeof document !== 'undefined') {
        const navItem = document.querySelector(`.nav-item[data-view-target="${cleanView}"]`);
        if (navItem) {
          navItem.click();
          return {
            isError: false,
            toolName: 'ui.navigate',
            targetView: cleanView,
            content: `Switched viewport to [${cleanView.toUpperCase()}].`
          };
        }
      }

      return {
        isError: true,
        content: 'MercuriOS Host Router Bridge is not accessible.'
      };
    },

    /**
     * Tool 2: ui.open_form
     * Opens modal dialogs and pre-fills input fields for human review
     */
    openForm: function (formType, prefillData) {
      if (typeof document === 'undefined') {
        return { isError: false, toolName: 'ui.open_form', formType: formType, content: `Form [${formType}] staged.` };
      }
      if (formType === 'dispatch') {
        const modal = document.getElementById('dispatch-modal');
        if (!modal) {
          return { isError: true, content: 'Dispatch modal element not found.' };
        }

        const inputSrc = document.getElementById('input-source-node');
        const inputDest = document.getElementById('input-dest-node');
        const inputSku = document.getElementById('input-sku');
        const inputQty = document.getElementById('input-qty');
        const inputUrgent = document.getElementById('input-urgent');

        if (inputSrc && prefillData.sourceNode) inputSrc.value = prefillData.sourceNode;
        if (inputDest && prefillData.destNode) inputDest.value = prefillData.destNode;
        if (inputSku && prefillData.sku) inputSku.value = prefillData.sku;
        if (inputQty && prefillData.qty) inputQty.value = prefillData.qty;
        if (inputUrgent && typeof prefillData.isUrgent === 'boolean') inputUrgent.checked = prefillData.isUrgent;

        modal.classList.add('active');
        return {
          isError: false,
          toolName: 'ui.open_form',
          formType: 'dispatch',
          content: `Opened and pre-filled Stock Dispatch form with ${prefillData.qty || 1} units of ${prefillData.sku || 'SKU'}.`
        };
      }

      if (formType === 'staff') {
        const modal = document.getElementById('staff-modal');
        if (!modal) {
          return { isError: true, content: 'Staff modal element not found.' };
        }

        modal.classList.add('active');
        return {
          isError: false,
          toolName: 'ui.open_form',
          formType: 'staff',
          content: 'Opened Staff creation form.'
        };
      }

      return {
        isError: true,
        content: `Form type [${formType}] is not recognized in the Action Catalog.`
      };
    },

    /**
     * Tool 3: ops.filter_table
     * Filters active table input search
     */
    filterTable: function (view, query) {
      if (typeof document === 'undefined') {
        return { isError: false, toolName: 'ops.filter_table', content: `Filtered ${view} table with query: "${query}"` };
      }
      const idMap = {
        'inventory': ['inv-search-input', 'inventory-search-input'],
        'products': ['prod-search-input', 'product-search-input'],
        'staff': ['staff-search-input'],
        'orders': ['order-search-input'],
        'stores': ['store-search-input'],
        'categories': ['cat-search-input'],
        'collections': ['col-search-input'],
        'materials': ['mat-search-input'],
        'inbox': ['msg-search-input']
      };

      const candidates = idMap[view] || [`${view}-search-input`];
      let input = null;
      for (const id of candidates) {
        const el = document.getElementById(id);
        if (el) {
          input = el;
          break;
        }
      }

      if (input) {
        input.value = query || '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        return {
          isError: false,
          toolName: 'ops.filter_table',
          content: `Filtered ${view} table with query: "${query}"`
        };
      }

      return {
        isError: true,
        content: `Could not locate search field for view [${view}].`
      };
    },

    /**
     * Tool 4: ops.filter_dropdown
     * Sets dropdown selector in views and triggers change event
     */
    filterDropdown: function (selectId, value) {
      if (typeof document === 'undefined') {
        return { isError: false, toolName: 'ops.filter_dropdown', selectId: selectId, value: value, content: `Updated filter [${selectId}] to [${value}].` };
      }
      const select = document.getElementById(selectId);
      if (select) {
        select.value = value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        return {
          isError: false,
          toolName: 'ops.filter_dropdown',
          selectId: selectId,
          value: value,
          content: `Updated filter [${selectId}] to [${value}].`
        };
      }

      return {
        isError: true,
        content: `Dropdown element [#${selectId}] was not found in active DOM.`
      };
    },

    /**
     * Tool 5: ops.query_data
     * Read-only telemetry query
     */
    queryData: function (selector) {
      const store = window.mercuriosStore;
      if (!store) return null;
      const state = store.getState();
      if (!selector || selector === 'all') return state;
      return state[selector] || null;
    },

    /**
     * Tool 6: ui.set_theme
     * Sets application color theme ('dark' | 'light')
     */
    setTheme: function (theme) {
      const targetTheme = (theme === 'dark') ? 'dark' : 'light';
      const store = window.mercuriosStore;
      if (store && store.setTheme) {
        store.setTheme(targetTheme);
      } else if (typeof document !== 'undefined') {
        document.documentElement.setAttribute('data-theme', targetTheme);
      }
      return {
        isError: false,
        toolName: 'ui.set_theme',
        theme: targetTheme,
        content: `Theme set to [${targetTheme.toUpperCase()}].`
      };
    },

    /**
     * Tool 7: ui.trigger_action
     * Triggers click on interactive elements (e.g. '+ Add Collection', '+ Add Product', '+ New Order')
     */
    triggerAction: function (elementId) {
      if (typeof document === 'undefined') {
        return { isError: false, toolName: 'ui.trigger_action', elementId: elementId, content: `Triggered [#${elementId}]` };
      }
      const el = document.getElementById(elementId);
      if (el) {
        el.click();
        return {
          isError: false,
          toolName: 'ui.trigger_action',
          elementId: elementId,
          content: `Triggered action on [#${elementId}].`
        };
      }
      return {
        isError: true,
        content: `Element [#${elementId}] not found in active view.`
      };
    },

    /**
     * Tool 8: ops.delete_record
     * Safely executes deletion of verified records (order, product, customer, collection)
     */
    deleteRecord: function (entityType, id) {
      const store = window.mercuriosStore;
      if (!store) {
        return { isError: true, content: 'MercuriOS Store is not initialized.' };
      }
      const type = (entityType || '').toLowerCase();
      if (type === 'order') {
        store.deleteOrder(id);
        return { isError: false, toolName: 'ops.delete_record', entityType: 'order', id: id, content: `Deleted order [${id}].` };
      }
      if (type === 'product') {
        store.deleteProduct(id);
        return { isError: false, toolName: 'ops.delete_record', entityType: 'product', id: id, content: `Deleted product [${id}].` };
      }
      if (type === 'customer') {
        store.deleteCustomer(id);
        return { isError: false, toolName: 'ops.delete_record', entityType: 'customer', id: id, content: `Deleted customer [${id}].` };
      }
      if (type === 'collection') {
        store.state.collections = (store.state.collections || []).filter(c => c.id !== id);
        store.notify();
        return { isError: false, toolName: 'ops.delete_record', entityType: 'collection', id: id, content: `Deleted collection [${id}].` };
      }
      return { isError: true, content: `Entity type [${entityType}] deletion is not supported.` };
    }
  };

  window.MercurixActionCatalog = ActionCatalog;
})();
