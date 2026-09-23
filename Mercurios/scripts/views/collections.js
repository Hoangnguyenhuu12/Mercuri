/**
 * MERCURIOS // COLLECTIONS VIEW CONTROLLER
 * Renders Seasonal Campaigns & Capsule Collections with budget and launch tracking.
 */

(function () {
  'use strict';

  function initCollections() {
    const store = window.mercuriosStore;
    const toast = window.MercuriosToast;

    const searchInput = document.getElementById('col-search-input');
    const seasonFilter = document.getElementById('col-filter-season');
    const statusFilter = document.getElementById('col-filter-status');
    const tableBody = document.getElementById('collections-table-body');
    const btnAdd = document.getElementById('btn-add-collection');

    function renderCollectionsTable(list) {
      if (!tableBody) return;
      const query = (searchInput?.value || '').toLowerCase().trim();
      const seasonVal = seasonFilter?.value || 'ALL';
      const statusVal = statusFilter?.value || 'ALL';

      const filtered = list.filter(item => {
        const matchQuery = !query || item.code.toLowerCase().includes(query) || item.name.toLowerCase().includes(query) || item.theme.toLowerCase().includes(query);
        const matchSeason = seasonVal === 'ALL' || item.season.includes(seasonVal);
        const matchStatus = statusVal === 'ALL' || item.status === statusVal;
        return matchQuery && matchSeason && matchStatus;
      });

      tableBody.innerHTML = '';

      if (filtered.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="9" style="text-align: center; padding: 32px; color: var(--text-muted); font-family: var(--font-mono);">
              NO COLLECTIONS MATCHING FILTER
            </td>
          </tr>
        `;
        return;
      }

      filtered.forEach(col => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><span class="table-sku-tag">${col.code}</span></td>
          <td><strong>${col.name}</strong></td>
          <td><span class="badge-tag">${col.season}</span></td>
          <td><span style="color: var(--text-muted); font-size: 12px;">${col.theme}</span></td>
          <td><span class="info-value-mono">${col.launch}</span></td>
          <td><strong>${col.targetSkus}</strong></td>
          <td><strong>${col.budget}</strong></td>
          <td><span class="badge-tag tag-active">[${col.status.toUpperCase()}]</span></td>
          <td>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-sm" data-action="edit-col" data-id="${col.id}">EDIT</button>
              <button class="btn btn-sm btn-danger" data-action="delete-col" data-id="${col.id}">DELETE</button>
            </div>
          </td>
        `;
        tableBody.appendChild(tr);
      });
    }

    [searchInput, seasonFilter, statusFilter].forEach(el => {
      if (el) {
        el.addEventListener('input', () => renderCollectionsTable(store.getState().collections || []));
        el.addEventListener('change', () => renderCollectionsTable(store.getState().collections || []));
      }
    });

    if (tableBody) {
      tableBody.addEventListener('click', (e) => {
        const btnDel = e.target.closest('button[data-action="delete-col"]');
        if (btnDel) {
          const id = btnDel.dataset.id;
          store.state.collections = (store.state.collections || []).filter(c => c.id !== id);
          store.notify();
          toast.show(`Collection [${id}] removed`);
          return;
        }
        const btnEdit = e.target.closest('button[data-action="edit-col"]');
        if (btnEdit) {
          toast.show(`Collection [${btnEdit.dataset.id}] edit mode ready`);
        }
      });
    }

    if (btnAdd) {
      btnAdd.addEventListener('click', () => {
        toast.show('Add Collection modal triggered');
      });
    }

    store.subscribe((state) => renderCollectionsTable(state.collections || []));
    renderCollectionsTable(store.getState().collections || []);
  }

  window.MercuriosCollectionsView = { init: initCollections };
})();
