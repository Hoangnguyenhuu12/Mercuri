/**
 * MERCURIOS // PRODUCTS CATALOG VIEW CONTROLLER
 * Renders Product Summary Cards, Data Table, Search, and Filtering.
 */

(function () {
  'use strict';

  function initProducts() {
    const store = window.mercuriosStore;
    const toast = window.MercuriosToast;

    // Cache elements
    const elements = {
      prodValTotal: document.getElementById('prod-val-total'),
      prodValActive: document.getElementById('prod-val-active'),
      prodValAvgPrice: document.getElementById('prod-val-avg-price'),
      prodValFeatured: document.getElementById('prod-val-featured'),
      prodSearchInput: document.getElementById('prod-search-input'),
      prodFilterStatus: document.getElementById('prod-filter-status'),
      prodFilterCategory: document.getElementById('prod-filter-category'),
      prodFilterCollection: document.getElementById('prod-filter-collection'),
      productsTableBody: document.getElementById('products-table-body')
    };

    function renderProductsView(state) {
      if (elements.prodValTotal) elements.prodValTotal.textContent = state.productMetrics.total;
      if (elements.prodValActive) elements.prodValActive.textContent = state.productMetrics.activeForSale;
      if (elements.prodValAvgPrice) elements.prodValAvgPrice.textContent = state.productMetrics.avgPrice;
      if (elements.prodValFeatured) elements.prodValFeatured.textContent = state.productMetrics.featured;

      renderTable(state.products);
    }

    function renderTable(productsList) {
      if (!elements.productsTableBody) return;

      const query = (elements.prodSearchInput?.value || '').toLowerCase().trim();
      const statusFilter = elements.prodFilterStatus?.value || 'ALL';
      const catFilter = elements.prodFilterCategory?.value || 'ALL';
      const colFilter = elements.prodFilterCollection?.value || 'ALL';

      const filtered = productsList.filter(p => {
        const matchQuery = !query || p.sku.toLowerCase().includes(query) || p.name.toLowerCase().includes(query);
        const matchStatus = statusFilter === 'ALL' || p.status === statusFilter;
        const matchCat = catFilter === 'ALL' || p.category === catFilter;
        const matchCol = colFilter === 'ALL' || p.collection.includes(colFilter);
        return matchQuery && matchStatus && matchCat && matchCol;
      });

      elements.productsTableBody.innerHTML = '';

      if (filtered.length === 0) {
        elements.productsTableBody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center; padding: 32px; color: var(--text-muted); font-family: var(--font-mono);">
              NO PRODUCTS MATCHING FILTER CRITERIA
            </td>
          </tr>
        `;
        return;
      }

      filtered.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><span class="table-sku-tag">${p.sku}</span></td>
          <td><strong>${p.name}</strong></td>
          <td><span class="badge-tag">${p.category}</span></td>
          <td><span style="color: var(--text-muted); font-size: 12px;">${p.collection}</span></td>
          <td><strong>${p.price}</strong></td>
          <td><span class="badge-tag tag-active">[${p.status.toUpperCase()}]</span></td>
          <td>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-sm" data-action="edit-product" data-id="${p.id}">EDIT</button>
              <button class="btn btn-sm btn-danger" data-action="delete-product" data-id="${p.id}">DELETE</button>
            </div>
          </td>
        `;
        elements.productsTableBody.appendChild(tr);
      });
    }

    // Filter Input Event Listeners
    [elements.prodSearchInput, elements.prodFilterStatus, elements.prodFilterCategory, elements.prodFilterCollection].forEach(input => {
      if (input) {
        input.addEventListener('input', () => renderTable(store.getState().products));
        input.addEventListener('change', () => renderTable(store.getState().products));
      }
    });

    // Table Actions (Delete / Edit)
    if (elements.productsTableBody) {
      elements.productsTableBody.addEventListener('click', (e) => {
        const btnDel = e.target.closest('button[data-action="delete-product"]');
        if (btnDel) {
          const id = btnDel.dataset.id;
          store.deleteProduct(id);
          toast.show(`Product [${id}] removed from catalog`);
          return;
        }

        const btnEdit = e.target.closest('button[data-action="edit-product"]');
        if (btnEdit) {
          const id = btnEdit.dataset.id;
          toast.show(`Product [${id}] editing ready`);
        }
      });
    }

    // Subscribe to central store
    store.subscribe(renderProductsView);
    renderProductsView(store.getState());
  }

  window.MercuriosProductsView = { init: initProducts };
})();
