/**
 * MERCURIOS // OPERATIONS VIEWS CONTROLLER
 * Handles Outlets & Stores, Inventory & Stock, Production (PO), and Suppliers.
 * Minimalist, functional, zero-icon, high readability.
 */

(function () {
  'use strict';

  function initOperations() {
    const store = window.mercuriosStore;
    const toast = window.MercuriosToast;

    // -------------------------------------------------------------------------
    // 1. OUTLETS & STORES (CỬA HÀNG)
    // -------------------------------------------------------------------------
    const storeSearch = document.getElementById('store-search-input');
    const storeFilterType = document.getElementById('store-filter-type');
    const storeFilterStatus = document.getElementById('store-filter-status');
    const storeTableBody = document.getElementById('stores-table-body');
    const btnAddStore = document.getElementById('btn-add-store');

    function renderStoresTable() {
      if (!storeTableBody) return;
      const list = store.getState().outlets || [];
      const query = (storeSearch?.value || '').toLowerCase().trim();
      const typeVal = storeFilterType?.value || 'ALL';
      const statusVal = storeFilterStatus?.value || 'ALL';

      const filtered = list.filter(item => {
        const matchesQuery = !query ||
          item.id.toLowerCase().includes(query) ||
          item.name.toLowerCase().includes(query) ||
          item.city.toLowerCase().includes(query) ||
          item.phone.includes(query);
        const matchesType = (typeVal === 'ALL' || item.type.toLowerCase() === typeVal.toLowerCase());
        const matchesStatus = (statusVal === 'ALL' || item.status.toLowerCase() === statusVal.toLowerCase());
        return matchesQuery && matchesType && matchesStatus;
      });

      storeTableBody.innerHTML = '';
      if (filtered.length === 0) {
        storeTableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 32px; color: var(--text-muted); font-family: var(--font-mono);">Không có dữ liệu</td></tr>`;
        return;
      }

      filtered.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><span class="mono-badge">${item.id}</span></td>
          <td style="font-weight: 600; color: var(--text-main);">${item.name}</td>
          <td><span class="badge-tag">${item.type}</span></td>
          <td>${item.city}</td>
          <td style="color: var(--text-muted);">${item.manager}</td>
          <td class="cell-mono">${item.phone}</td>
          <td><span class="badge-tag tag-active">Đang Hoạt Động</span></td>
          <td>
            <div class="row-actions">
              <button class="action-btn" data-action="edit-store" title="Edit">[EDIT]</button>
              <button class="action-btn text-danger" data-action="del-store" title="Delete">[DEL]</button>
            </div>
          </td>
        `;
        tr.querySelector('[data-action="edit-store"]')?.addEventListener('click', () => toast.show(`Edit cửa hàng [${item.id}]`));
        tr.querySelector('[data-action="del-store"]')?.addEventListener('click', () => toast.show(`Xóa cửa hàng [${item.id}]`));
        storeTableBody.appendChild(tr);
      });
    }

    if (storeSearch) storeSearch.addEventListener('input', renderStoresTable);
    if (storeFilterType) storeFilterType.addEventListener('change', renderStoresTable);
    if (storeFilterStatus) storeFilterStatus.addEventListener('change', renderStoresTable);
    if (btnAddStore) btnAddStore.addEventListener('click', () => toast.show('+ Thêm cửa hàng mới'));

    // -------------------------------------------------------------------------
    // 2. INVENTORY & STOCK (TỒN KHO)
    // -------------------------------------------------------------------------
    const invSearch = document.getElementById('inv-search-input');
    const invFilterHub = document.getElementById('inv-filter-hub');
    const invFilterStatus = document.getElementById('inv-filter-status');
    const invTableBody = document.getElementById('inventory-table-body');

    function renderInventoryTable() {
      if (!invTableBody) return;
      const list = store.getState().inventory || [];
      const query = (invSearch?.value || '').toLowerCase().trim();
      const hubVal = invFilterHub?.value || 'ALL';
      const statusVal = invFilterStatus?.value || 'ALL';

      const filtered = list.filter(item => {
        const matchesQuery = !query ||
          item.sku.toLowerCase().includes(query) ||
          item.product.toLowerCase().includes(query) ||
          item.color.toLowerCase().includes(query);
        const matchesHub = (hubVal === 'ALL' || item.store.toLowerCase().includes(hubVal.toLowerCase()));
        let matchesStatus = true;
        if (statusVal === 'IN_STOCK') matchesStatus = (item.onHand > 10);
        else if (statusVal === 'LOW_STOCK') matchesStatus = (item.onHand <= 10 && item.onHand > 0);
        else if (statusVal === 'OUT_OF_STOCK') matchesStatus = (item.onHand === 0);
        return matchesQuery && matchesHub && matchesStatus;
      });

      invTableBody.innerHTML = '';
      if (filtered.length === 0) {
        invTableBody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 32px; color: var(--text-muted); font-family: var(--font-mono);">Không có dữ liệu</td></tr>`;
        return;
      }

      filtered.forEach(item => {
        const tr = document.createElement('tr');
        const isLow = item.onHand <= 5;
        tr.innerHTML = `
          <td><span class="mono-badge">${item.sku}</span></td>
          <td style="font-weight: 600; color: var(--text-main);">${item.product}</td>
          <td><span class="badge-tag">${item.size}</span></td>
          <td>${item.color}</td>
          <td>${item.store}</td>
          <td class="cell-mono" style="font-weight: 700; ${isLow ? 'color: #DC2626;' : ''}">${item.onHand}</td>
          <td class="cell-mono" style="color: var(--text-muted);">${item.reserved}</td>
          <td class="cell-mono" style="color: var(--text-muted);">${item.lastCount}</td>
        `;
        invTableBody.appendChild(tr);
      });
    }

    if (invSearch) invSearch.addEventListener('input', renderInventoryTable);
    if (invFilterHub) invFilterHub.addEventListener('change', renderInventoryTable);
    if (invFilterStatus) invFilterStatus.addEventListener('change', renderInventoryTable);

    // -------------------------------------------------------------------------
    // 3. PRODUCTION MES (LỆNH SẢN XUẤT)
    // -------------------------------------------------------------------------
    const poSearch = document.getElementById('po-search-input');
    const poFilterStatus = document.getElementById('po-filter-status');
    const poTableBody = document.getElementById('production-table-body');
    const btnAddPo = document.getElementById('btn-add-po');

    function renderProductionTable() {
      if (!poTableBody) return;
      const list = store.getState().production || [];
      const query = (poSearch?.value || '').toLowerCase().trim();
      const statusVal = poFilterStatus?.value || 'ALL';

      const filtered = list.filter(item => {
        const matchesQuery = !query ||
          item.id.toLowerCase().includes(query) ||
          item.product.toLowerCase().includes(query) ||
          item.line.toLowerCase().includes(query);
        const matchesStatus = (statusVal === 'ALL' || item.status.toLowerCase() === statusVal.toLowerCase());
        return matchesQuery && matchesStatus;
      });

      poTableBody.innerHTML = '';
      if (filtered.length === 0) {
        poTableBody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 32px; color: var(--text-muted); font-family: var(--font-mono);">Không có dữ liệu</td></tr>`;
        return;
      }

      filtered.forEach(item => {
        const tr = document.createElement('tr');
        let statusTag = `<span class="badge-tag">${item.status}</span>`;
        if (item.status === 'COMPLETED') statusTag = `<span class="badge-tag tag-active">Hoàn Tất</span>`;
        else if (item.status === 'IN_PROGRESS') statusTag = `<span class="badge-tag tag-amber">Đang Sản Xuất</span>`;
        else if (item.status === 'QC') statusTag = `<span class="badge-tag tag-active">QC</span>`;
        else if (item.status === 'PAUSED') statusTag = `<span class="badge-tag tag-pending">Tạm Dừng</span>`;
        else if (item.status === 'PENDING') statusTag = `<span class="badge-tag">Chờ Xử Lý</span>`;

        tr.innerHTML = `
          <td><span class="mono-badge">${item.id}</span></td>
          <td style="font-weight: 600; color: var(--text-main);">${item.product || '—'}</td>
          <td class="cell-mono">${item.progress}</td>
          <td class="cell-mono" style="${item.errors > 0 ? 'color: #DC2626; font-weight: 700;' : 'color: var(--text-muted);'}">${item.errors}</td>
          <td>${item.line}</td>
          <td class="cell-mono" style="color: var(--text-muted);">${item.deadline}</td>
          <td class="cell-mono" style="font-weight: 600;">${item.cost}</td>
          <td>${statusTag}</td>
          <td>
            <div class="row-actions">
              <button class="action-btn" data-action="edit-po" title="Edit">[EDIT]</button>
              <button class="action-btn text-danger" data-action="del-po" title="Delete">[DEL]</button>
            </div>
          </td>
        `;
        tr.querySelector('[data-action="edit-po"]')?.addEventListener('click', () => toast.show(`Edit PO [${item.id}]`));
        tr.querySelector('[data-action="del-po"]')?.addEventListener('click', () => toast.show(`Xóa PO [${item.id}]`));
        poTableBody.appendChild(tr);
      });
    }

    if (poSearch) poSearch.addEventListener('input', renderProductionTable);
    if (poFilterStatus) poFilterStatus.addEventListener('change', renderProductionTable);
    if (btnAddPo) btnAddPo.addEventListener('click', () => toast.show('+ Tạo Lệnh Sản Xuất (PO)'));

    // -------------------------------------------------------------------------
    // 4. SUPPLIERS (NHÀ CUNG CẤP)
    // -------------------------------------------------------------------------
    const supSearch = document.getElementById('sup-search-input');
    const supFilterType = document.getElementById('sup-filter-type');
    const supFilterStatus = document.getElementById('sup-filter-status');
    const supTableBody = document.getElementById('suppliers-table-body');
    const btnAddSup = document.getElementById('btn-add-sup');

    function renderSuppliersTable() {
      if (!supTableBody) return;
      const list = store.getState().suppliers || [];
      const query = (supSearch?.value || '').toLowerCase().trim();
      const typeVal = supFilterType?.value || 'ALL';
      const statusVal = supFilterStatus?.value || 'ALL';

      const filtered = list.filter(item => {
        const matchesQuery = !query ||
          item.id.toLowerCase().includes(query) ||
          item.name.toLowerCase().includes(query) ||
          item.contact.toLowerCase().includes(query) ||
          item.phone.includes(query);
        const matchesType = (typeVal === 'ALL' || item.type.toLowerCase() === typeVal.toLowerCase());
        const matchesStatus = (statusVal === 'ALL' || item.status.toLowerCase() === statusVal.toLowerCase());
        return matchesQuery && matchesType && matchesStatus;
      });

      supTableBody.innerHTML = '';
      if (filtered.length === 0) {
        supTableBody.innerHTML = `<tr><td colspan="9" style="text-align: center; padding: 32px; color: var(--text-muted); font-family: var(--font-mono);">Không có dữ liệu</td></tr>`;
        return;
      }

      filtered.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><span class="mono-badge">${item.id}</span></td>
          <td style="font-weight: 600; color: var(--text-main);">${item.name}</td>
          <td><span class="badge-tag">${item.type}</span></td>
          <td>${item.contact}</td>
          <td class="cell-mono">${item.phone}</td>
          <td class="cell-mono" style="color: var(--text-muted);">${item.leadTime}</td>
          <td class="cell-mono" style="font-weight: 700; color: #D97706;">★ ${item.rating}</td>
          <td><span class="badge-tag tag-active">Đang Hoạt Động</span></td>
          <td>
            <div class="row-actions">
              <button class="action-btn" data-action="edit-sup" title="Edit">[EDIT]</button>
              <button class="action-btn text-danger" data-action="del-sup" title="Delete">[DEL]</button>
            </div>
          </td>
        `;
        tr.querySelector('[data-action="edit-sup"]')?.addEventListener('click', () => toast.show(`Edit NCC [${item.id}]`));
        tr.querySelector('[data-action="del-sup"]')?.addEventListener('click', () => toast.show(`Xóa NCC [${item.id}]`));
        supTableBody.appendChild(tr);
      });
    }

    if (supSearch) supSearch.addEventListener('input', renderSuppliersTable);
    if (supFilterType) supFilterType.addEventListener('change', renderSuppliersTable);
    if (supFilterStatus) supFilterStatus.addEventListener('change', renderSuppliersTable);
    if (btnAddSup) btnAddSup.addEventListener('click', () => toast.show('+ Thêm Nhà Cung Cấp'));

    // Re-render when store updates
    store.subscribe(() => {
      renderStoresTable();
      renderInventoryTable();
      renderProductionTable();
      renderSuppliersTable();
    });

    renderStoresTable();
    renderInventoryTable();
    renderProductionTable();
    renderSuppliersTable();
  }

  window.MercuriosOperationsView = { init: initOperations };
})();
