/**
 * MERCURIOS // MODAL DIALOGS CONTROLLER
 * Controls Settings modal, New Dispatch modal, and Add Product modal.
 */

(function () {
  'use strict';

  function initModals() {
    const store = window.mercuriosStore;
    const toast = window.MercuriosToast;

    // Modals
    const settingsModal = document.getElementById('settings-modal');
    const dispatchModal = document.getElementById('dispatch-modal');
    const addProductModal = document.getElementById('add-product-modal');

    // Triggers
    const btnSidebarSettings = document.getElementById('sidebar-btn-settings');
    const btnOpenDispatch = document.getElementById('btn-open-dispatch');
    const btnOpenAddProduct = document.getElementById('btn-open-add-product');

    // Close buttons
    const btnCloseSettings = document.getElementById('btn-close-settings');
    const btnCloseDispatch = document.getElementById('btn-close-dispatch');
    const btnCloseAddProduct = document.getElementById('btn-close-add-product');

    // Forms
    const themeSelect = document.getElementById('setting-theme-select');
    const formDispatch = document.getElementById('form-dispatch');
    const formAddProduct = document.getElementById('form-add-product');

    // Open Settings
    if (btnSidebarSettings) {
      btnSidebarSettings.addEventListener('click', () => {
        settingsModal?.classList.add('active');
      });
    }
    if (btnCloseSettings) {
      btnCloseSettings.addEventListener('click', () => {
        settingsModal?.classList.remove('active');
      });
    }

    // Theme Switch
    if (themeSelect) {
      themeSelect.addEventListener('change', (e) => {
        store.setTheme(e.target.value);
        toast.show(`Visual Mode: ${e.target.value.toUpperCase()}`);
      });
    }

    // Open Dispatch
    if (btnOpenDispatch) {
      btnOpenDispatch.addEventListener('click', () => {
        dispatchModal?.classList.add('active');
      });
    }
    if (btnCloseDispatch) {
      btnCloseDispatch.addEventListener('click', () => {
        dispatchModal?.classList.remove('active');
      });
    }

    // Open Add Product
    if (btnOpenAddProduct) {
      btnOpenAddProduct.addEventListener('click', () => {
        addProductModal?.classList.add('active');
      });
    }
    if (btnCloseAddProduct) {
      btnCloseAddProduct.addEventListener('click', () => {
        addProductModal?.classList.remove('active');
      });
    }

    // Form: Submit New Dispatch
    if (formDispatch) {
      formDispatch.addEventListener('submit', (e) => {
        e.preventDefault();
        const node = document.getElementById('input-source-node')?.value;
        const sku = document.getElementById('input-sku')?.value;
        const destination = document.getElementById('input-dest-node')?.value;
        const qty = parseInt(document.getElementById('input-qty')?.value, 10);
        const isUrgent = document.getElementById('input-urgent')?.checked;

        const newItem = {
          id: `DISP-${Math.floor(2000 + Math.random() * 8000)}`,
          node,
          sku: (sku || '').toUpperCase(),
          destination,
          qty: qty || 1,
          status: isUrgent ? 'URGENT' : 'PENDING'
        };

        store.addExecutionItem(newItem);
        dispatchModal?.classList.remove('active');
        formDispatch.reset();
        toast.show(`Created dispatch task [${newItem.id}]`);
      });
    }

    // Form: Submit Add Product
    if (formAddProduct) {
      formAddProduct.addEventListener('submit', (e) => {
        e.preventDefault();
        const sku = document.getElementById('new-prod-sku')?.value.trim();
        const name = document.getElementById('new-prod-name')?.value.trim();
        const category = document.getElementById('new-prod-category')?.value;
        const collection = document.getElementById('new-prod-collection')?.value;
        const priceNum = parseInt(document.getElementById('new-prod-price')?.value, 10) || 0;

        const newProd = {
          id: `prod-${Date.now()}`,
          sku: sku.toUpperCase(),
          name,
          category,
          collection,
          priceNum,
          price: priceNum.toLocaleString('vi-VN') + ' đ',
          status: 'Active'
        };

        store.addProduct(newProd);
        addProductModal?.classList.remove('active');
        formAddProduct.reset();
        toast.show(`Product [${newProd.sku}] added to catalog`);
      });
    }

    // Backdrop Click to Close
    window.addEventListener('click', (e) => {
      if (e.target === settingsModal) settingsModal.classList.remove('active');
      if (e.target === dispatchModal) dispatchModal.classList.remove('active');
      if (e.target === addProductModal) addProductModal.classList.remove('active');
    });

    // Escape Key to Close
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        settingsModal?.classList.remove('active');
        dispatchModal?.classList.remove('active');
        addProductModal?.classList.remove('active');
      }
    });
  }

  window.MercuriosModals = { init: initModals };
})();
