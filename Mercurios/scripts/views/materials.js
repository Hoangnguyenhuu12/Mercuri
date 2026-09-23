/**
 * MERCURIOS // RAW MATERIALS & FABRICS VIEW CONTROLLER
 * Renders Trims, Fabrics, Thread, Zippers and Packaging stock ledger.
 */

(function () {
  'use strict';

  function initMaterials() {
    const store = window.mercuriosStore;
    const toast = window.MercuriosToast;

    const searchInput = document.getElementById('mat-search-input');
    const typeFilter = document.getElementById('mat-filter-type');
    const supplierFilter = document.getElementById('mat-filter-supplier');
    const tableBody = document.getElementById('materials-table-body');
    const btnAdd = document.getElementById('btn-add-material');

    function renderMaterialsTable(list) {
      if (!tableBody) return;
      const query = (searchInput?.value || '').toLowerCase().trim();
      const typeVal = typeFilter?.value || 'ALL';
      const supplierVal = supplierFilter?.value || 'ALL';

      const filtered = list.filter(item => {
        const matchQuery = !query || item.code.toLowerCase().includes(query) || item.name.toLowerCase().includes(query) || item.color.toLowerCase().includes(query);
        const matchType = typeVal === 'ALL' || item.type === typeVal;
        const matchSupplier = supplierVal === 'ALL' || item.supplier.includes(supplierVal);
        return matchQuery && matchType && matchSupplier;
      });

      tableBody.innerHTML = '';

      if (filtered.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="9" style="text-align: center; padding: 32px; color: var(--text-muted); font-family: var(--font-mono);">
              NO RAW MATERIALS MATCHING FILTER
            </td>
          </tr>
        `;
        return;
      }

      filtered.forEach(mat => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><span class="table-sku-tag">${mat.code}</span></td>
          <td><strong>${mat.name}</strong></td>
          <td><span class="badge-tag">${mat.type}</span></td>
          <td><span style="color: var(--text-muted); font-size: 12px;">${mat.color}</span></td>
          <td><span style="color: var(--text-subtle);">${mat.uom}</span></td>
          <td><strong>${mat.price}</strong></td>
          <td><strong>${mat.onHand}</strong></td>
          <td><span style="color: var(--text-muted);">${mat.supplier}</span></td>
          <td>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-sm" data-action="edit-mat" data-id="${mat.id}">EDIT</button>
              <button class="btn btn-sm btn-danger" data-action="delete-mat" data-id="${mat.id}">DELETE</button>
            </div>
          </td>
        `;
        tableBody.appendChild(tr);
      });
    }

    [searchInput, typeFilter, supplierFilter].forEach(el => {
      if (el) {
        el.addEventListener('input', () => renderMaterialsTable(store.getState().materials || []));
        el.addEventListener('change', () => renderMaterialsTable(store.getState().materials || []));
      }
    });

    if (tableBody) {
      tableBody.addEventListener('click', (e) => {
        const btnDel = e.target.closest('button[data-action="delete-mat"]');
        if (btnDel) {
          const id = btnDel.dataset.id;
          store.state.materials = (store.state.materials || []).filter(m => m.id !== id);
          store.notify();
          toast.show(`Raw Material [${id}] removed`);
          return;
        }
        const btnEdit = e.target.closest('button[data-action="edit-mat"]');
        if (btnEdit) {
          toast.show(`Raw Material [${btnEdit.dataset.id}] edit mode ready`);
        }
      });
    }

    if (btnAdd) {
      btnAdd.addEventListener('click', () => {
        toast.show('Add Material modal triggered');
      });
    }

    store.subscribe((state) => renderMaterialsTable(state.materials || []));
    renderMaterialsTable(store.getState().materials || []);
  }

  window.MercuriosMaterialsView = { init: initMaterials };
})();
