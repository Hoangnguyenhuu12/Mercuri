/**
 * MERCURIOS // OVERVIEW DASHBOARD VIEW CONTROLLER
 * Renders Financials, Customers, Operations KPIs, and Execution Queue table.
 */

(function () {
  'use strict';

  function initOverview() {
    const store = window.mercuriosStore;
    const toast = window.MercuriosToast;

    // Cache elements
    const elements = {
      grossRevenue: document.getElementById('val-gross-revenue'),
      completedOrders: document.getElementById('val-completed-orders'),
      pendingOrders: document.getElementById('val-pending-orders'),
      totalCustomers: document.getElementById('val-total-customers'),
      newCustomers: document.getElementById('val-new-customers'),
      totalSkus: document.getElementById('val-total-skus'),
      activeOutlets: document.getElementById('val-active-outlets'),
      runningPos: document.getElementById('val-running-pos'),
      completionRate: document.getElementById('val-completion-rate'),
      queueTableBody: document.getElementById('queue-table-body')
    };

    function renderOverview(state) {
      if (elements.grossRevenue) elements.grossRevenue.textContent = state.financials.grossRevenue;
      if (elements.completedOrders) elements.completedOrders.textContent = state.financials.completedOrders;
      if (elements.pendingOrders) elements.pendingOrders.textContent = state.financials.pendingOrders;

      if (elements.totalCustomers) elements.totalCustomers.textContent = state.customers.total;
      if (elements.newCustomers) elements.newCustomers.textContent = state.customers.new;
      if (elements.totalSkus) elements.totalSkus.textContent = state.inventory.totalSkus;

      if (elements.activeOutlets) elements.activeOutlets.textContent = state.omnichannel.activeOutlets;
      if (elements.runningPos) elements.runningPos.textContent = state.omnichannel.runningPos;
      if (elements.completionRate) elements.completionRate.textContent = state.inventory.safeStockLevel;

      renderQueueTable(state.executionQueue);
    }

    function renderQueueTable(queueList) {
      if (!elements.queueTableBody) return;
      elements.queueTableBody.innerHTML = '';

      queueList.forEach(item => {
        const tr = document.createElement('tr');
        const isUrgent = item.status === 'URGENT';
        const badgeClass = isUrgent ? 'badge-tag badge-urgent' : 'badge-tag badge-pending';

        tr.innerHTML = `
          <td><strong>${item.id}</strong></td>
          <td>${item.node}</td>
          <td><code>${item.sku}</code></td>
          <td>${item.destination}</td>
          <td><strong>${item.qty}</strong></td>
          <td><span class="${badgeClass}">[${item.status}]</span></td>
          <td>
            <button class="btn btn-sm" data-action="dispatch-now" data-id="${item.id}">EXECUTE</button>
          </td>
        `;
        elements.queueTableBody.appendChild(tr);
      });
    }

    // Table Execute Action
    if (elements.queueTableBody) {
      elements.queueTableBody.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action="dispatch-now"]');
        if (btn) {
          const id = btn.dataset.id;
          store.resolveExecutionItem(id);
          toast.show(`Order [${id}] dispatched successfully`);
        }
      });
    }

    // Subscribe to central store
    store.subscribe(renderOverview);
    renderOverview(store.getState());
  }

  window.MercuriosOverviewView = { init: initOverview };
})();
