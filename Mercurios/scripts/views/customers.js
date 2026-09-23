/**
 * MERCURIOS // CUSTOMERS CRM 360 VIEW CONTROLLER
 * Handles customer profile directory, tier segmentation, spending habits, and CRM data.
 */

(function () {
  'use strict';

  function initCustomers() {
    const store = window.mercuriosStore;
    const toast = window.MercuriosToast;

    const searchInput = document.getElementById('cust-search-input');
    const filterTier = document.getElementById('cust-filter-tier');
    const filterSource = document.getElementById('cust-filter-source');
    const tableBody = document.getElementById('customers-table-body');
    const btnAddCustomer = document.getElementById('btn-add-customer');

    function renderCustomersTable() {
      if (!tableBody) return;
      const list = store.getState().crmCustomers || [];
      const query = (searchInput?.value || '').toLowerCase().trim();
      const tierVal = filterTier?.value || 'ALL';
      const sourceVal = filterSource?.value || 'ALL';

      const filtered = list.filter(cust => {
        const matchesQuery = !query ||
          cust.id.toLowerCase().includes(query) ||
          cust.name.toLowerCase().includes(query) ||
          cust.phone.includes(query) ||
          cust.email.toLowerCase().includes(query);

        const matchesTier = tierVal === 'ALL' || cust.tier.toLowerCase() === tierVal.toLowerCase();
        const matchesSource = sourceVal === 'ALL' || cust.source.toLowerCase() === sourceVal.toLowerCase();

        return matchesQuery && matchesTier && matchesSource;
      });

      tableBody.innerHTML = '';

      if (filtered.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="9" style="text-align: center; padding: 36px; color: var(--text-muted); font-family: var(--font-mono);">
              NO CUSTOMERS MATCHING FILTER CRITERIA
            </td>
          </tr>
        `;
        return;
      }

      filtered.forEach(cust => {
        const tr = document.createElement('tr');
        const tierLower = cust.tier.toLowerCase();
        let tierClass = 'tier-silver';
        if (tierLower === 'vip') tierClass = 'tier-vip';
        else if (tierLower === 'diamond') tierClass = 'tier-diamond';
        else if (tierLower === 'gold') tierClass = 'tier-gold';

        tr.innerHTML = `
          <td><span class="table-sku-tag">${cust.id}</span></td>
          <td>
            <strong>${cust.name}</strong>
            <div style="font-size: 12px; color: var(--text-muted); font-family: var(--font-mono);">${cust.email}</div>
          </td>
          <td><span style="font-family: var(--font-mono); font-weight: 600;">${cust.phone}</span></td>
          <td><span class="crm-tier-tag ${tierClass}">[${cust.tier.toUpperCase()}]</span></td>
          <td><strong style="font-family: var(--font-mono);">${cust.ordersCount}</strong></td>
          <td><strong style="font-family: var(--font-mono);">${cust.totalSpent}</strong></td>
          <td><span style="font-family: var(--font-mono); color: var(--text-muted);">${cust.points.toLocaleString()} pts</span></td>
          <td><span class="order-channel-tag">[${cust.source.toUpperCase()}]</span></td>
          <td><span style="font-family: var(--font-mono); font-size: 12px; color: var(--text-muted);">${cust.joinedDate}</span></td>
          <td>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-sm" data-action="view-cust" data-id="${cust.id}">PROFILE</button>
              <button class="btn btn-sm btn-danger" data-action="delete-cust" data-id="${cust.id}">DELETE</button>
            </div>
          </td>
        `;
        tableBody.appendChild(tr);
      });
    }

    if (searchInput) searchInput.addEventListener('input', renderCustomersTable);
    if (filterTier) filterTier.addEventListener('change', renderCustomersTable);
    if (filterSource) filterSource.addEventListener('change', renderCustomersTable);

    if (tableBody) {
      tableBody.addEventListener('click', (e) => {
        const btnDelete = e.target.closest('button[data-action="delete-cust"]');
        if (btnDelete) {
          const id = btnDelete.dataset.id;
          store.deleteCustomer(id);
          toast.show(`Customer [${id}] removed`);
          return;
        }

        const btnView = e.target.closest('button[data-action="view-cust"]');
        if (btnView) {
          const id = btnView.dataset.id;
          const cust = (store.getState().crmCustomers || []).find(c => c.id === id);
          if (cust) {
            toast.show(`[${cust.id}] ${cust.name} — Tier: ${cust.tier} (Spent: ${cust.totalSpent})`);
          }
        }
      });
    }

    if (btnAddCustomer) {
      btnAddCustomer.addEventListener('click', () => {
        const nextId = `CUST-${Math.floor(1006 + Math.random() * 50)}`;
        const newCust = {
          id: nextId,
          name: 'Khach Hang Mới',
          phone: '0938889999',
          email: 'newcustomer@mercuri.vn',
          tier: 'Silver',
          ordersCount: 1,
          totalSpent: '1,000,000 đ',
          points: 100,
          source: 'Store',
          joinedDate: '23/09/2026'
        };
        store.addCustomer(newCust);
        toast.show(`Customer [${newCust.id}] created successfully`);
      });
    }

    store.subscribe(() => renderCustomersTable());
    renderCustomersTable();
  }

  window.MercuriosCustomersView = { init: initCustomers };
})();
