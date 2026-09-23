/**
 * MERCURIOS // ORDERS VIEW CONTROLLER
 * Handles order table rendering, multi-channel filters, payment tracking, and actions.
 */

(function () {
  'use strict';

  function initOrders() {
    const store = window.mercuriosStore;
    const toast = window.MercuriosToast;

    const searchInput = document.getElementById('order-search-input');
    const filterStatus = document.getElementById('order-filter-status');
    const filterPayment = document.getElementById('order-filter-payment');
    const filterChannel = document.getElementById('order-filter-channel');
    const tableBody = document.getElementById('orders-table-body');
    const btnNewOrder = document.getElementById('btn-new-order');

    function renderOrdersTable() {
      if (!tableBody) return;
      const list = store.getState().orders || [];
      const query = (searchInput?.value || '').toLowerCase().trim();
      const statusVal = filterStatus?.value || 'ALL';
      const paymentVal = filterPayment?.value || 'ALL';
      const channelVal = filterChannel?.value || 'ALL';

      const filtered = list.filter(order => {
        const matchesQuery = !query ||
          order.id.toLowerCase().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.phone.includes(query) ||
          (order.items && order.items.toLowerCase().includes(query));

        const matchesStatus = statusVal === 'ALL' || order.status === statusVal;
        const matchesPayment = paymentVal === 'ALL' || order.paymentStatus === paymentVal;
        const matchesChannel = channelVal === 'ALL' || order.channel.toLowerCase() === channelVal.toLowerCase();

        return matchesQuery && matchesStatus && matchesPayment && matchesChannel;
      });

      tableBody.innerHTML = '';

      if (filtered.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="9" style="text-align: center; padding: 36px; color: var(--text-muted); font-family: var(--font-mono);">
              NO ORDERS FOUND MATCHING CURRENT FILTERS
            </td>
          </tr>
        `;
        return;
      }

      filtered.forEach(order => {
        const tr = document.createElement('tr');

        let payBadgeClass = 'tag-unpaid';
        if (order.paymentStatus === 'PAID') payBadgeClass = 'tag-paid';
        else if (order.paymentStatus === 'REFUNDED') payBadgeClass = 'tag-refunded';

        let statusBadgeClass = 'tag-active';
        if (order.status === 'PENDING') statusBadgeClass = 'tag-draft';
        else if (order.status === 'CANCELLED') statusBadgeClass = 'tag-urgent';

        tr.innerHTML = `
          <td><span class="table-sku-tag">${order.id}</span></td>
          <td>
            <strong>${order.customerName}</strong>
            <div class="order-phone-sub">${order.phone}</div>
          </td>
          <td><span class="order-channel-tag">[${order.channel.toUpperCase()}]</span></td>
          <td><span style="font-size: 12px; color: var(--text-muted);">${order.hub}</span></td>
          <td><strong style="font-family: var(--font-mono);">${order.totalAmount}</strong></td>
          <td><span class="badge-tag ${payBadgeClass}">[${order.paymentStatus}]</span></td>
          <td><span class="badge-tag ${statusBadgeClass}">[${order.status}]</span></td>
          <td><span style="font-family: var(--font-mono); font-size: 12px; color: var(--text-muted);">${order.createdAt}</span></td>
          <td>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-sm" data-action="view-order" data-id="${order.id}">VIEW</button>
              <button class="btn btn-sm btn-danger" data-action="delete-order" data-id="${order.id}">DELETE</button>
            </div>
          </td>
        `;
        tableBody.appendChild(tr);
      });
    }

    if (searchInput) searchInput.addEventListener('input', renderOrdersTable);
    if (filterStatus) filterStatus.addEventListener('change', renderOrdersTable);
    if (filterPayment) filterPayment.addEventListener('change', renderOrdersTable);
    if (filterChannel) filterChannel.addEventListener('change', renderOrdersTable);

    if (tableBody) {
      tableBody.addEventListener('click', (e) => {
        const btnDelete = e.target.closest('button[data-action="delete-order"]');
        if (btnDelete) {
          const id = btnDelete.dataset.id;
          store.deleteOrder(id);
          toast.show(`Order [${id}] removed from database`);
          return;
        }

        const btnView = e.target.closest('button[data-action="view-order"]');
        if (btnView) {
          const id = btnView.dataset.id;
          const order = (store.getState().orders || []).find(o => o.id === id);
          if (order) {
            toast.show(`[${order.id}] ${order.customerName} (${order.totalAmount}) - ${order.items}`);
          }
        }
      });
    }

    if (btnNewOrder) {
      btnNewOrder.addEventListener('click', () => {
        const nextNum = Math.floor(8950 + Math.random() * 50);
        const newOrd = {
          id: `ORD-${nextNum}`,
          customerName: 'Khach Hang Mua Tai Quay',
          phone: '0901234888',
          channel: 'Store',
          hub: 'Flagship Store [ST-01]',
          totalAmount: '1,000,000 đ',
          paymentStatus: 'PAID',
          status: 'COMPLETED',
          createdAt: 'Just now',
          items: 'Essential Cotton Tee 4512 x1'
        };
        store.addOrder(newOrd);
        toast.show(`Created POS Order [${newOrd.id}]`);
      });
    }

    store.subscribe(() => renderOrdersTable());
    renderOrdersTable();
  }

  window.MercuriosOrdersView = { init: initOrders };
})();
