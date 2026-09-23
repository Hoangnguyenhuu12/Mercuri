/**
 * MERCURIOS // CATEGORIES VIEW CONTROLLER
 * Renders Category taxonomy table, search filter, and category actions.
 */

(function () {
  'use strict';

  function initCategories() {
    const store = window.mercuriosStore;
    const toast = window.MercuriosToast;

    const searchInput = document.getElementById('cat-search-input');
    const tableBody = document.getElementById('categories-table-body');
    const btnAdd = document.getElementById('btn-add-category');

    function renderCategoriesTable(list) {
      if (!tableBody) return;
      const query = (searchInput?.value || '').toLowerCase().trim();

      const filtered = list.filter(item => {
        return !query || item.code.toLowerCase().includes(query) || item.name.toLowerCase().includes(query) || item.slug.toLowerCase().includes(query);
      });

      tableBody.innerHTML = '';

      if (filtered.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="7" style="text-align: center; padding: 32px; color: var(--text-muted); font-family: var(--font-mono);">
              NO CATEGORIES FOUND
            </td>
          </tr>
        `;
        return;
      }

      filtered.forEach(cat => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><span class="table-sku-tag">${cat.code}</span></td>
          <td><strong>${cat.name}</strong></td>
          <td><code style="color: var(--text-muted); font-size: 12px;">${cat.slug}</code></td>
          <td><span style="color: var(--text-muted);">${cat.parent}</span></td>
          <td><span class="badge-tag">${cat.sort}</span></td>
          <td><span class="badge-tag tag-active">[${cat.status.toUpperCase()}]</span></td>
          <td>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-sm" data-action="edit-cat" data-id="${cat.id}">EDIT</button>
              <button class="btn btn-sm btn-danger" data-action="delete-cat" data-id="${cat.id}">DELETE</button>
            </div>
          </td>
        `;
        tableBody.appendChild(tr);
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', () => renderCategoriesTable(store.getState().categories || []));
    }

    if (tableBody) {
      tableBody.addEventListener('click', (e) => {
        const btnDel = e.target.closest('button[data-action="delete-cat"]');
        if (btnDel) {
          const id = btnDel.dataset.id;
          store.state.categories = (store.state.categories || []).filter(c => c.id !== id);
          store.notify();
          toast.show(`Category [${id}] removed`);
          return;
        }
        const btnEdit = e.target.closest('button[data-action="edit-cat"]');
        if (btnEdit) {
          toast.show(`Category [${btnEdit.dataset.id}] edit mode ready`);
        }
      });
    }

    if (btnAdd) {
      btnAdd.addEventListener('click', () => {
        toast.show('Add Category modal triggered');
      });
    }

    store.subscribe((state) => renderCategoriesTable(state.categories || []));
    renderCategoriesTable(store.getState().categories || []);
  }

  window.MercuriosCategoriesView = { init: initCategories };
})();
