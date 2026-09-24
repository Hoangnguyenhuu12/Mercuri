/**
 * MERCURIOS // STAFF & ACCESS VIEW CONTROLLER
 * Manages 14 roles: Designer, Production, Sales, CSKH, Marketing, Finance, HR...
 * Zero-Icon / Minimalist / High-Readability / Fully English Localized
 */

(function () {
  'use strict';

  function initStaffView() {
    const store = window.mercuriosStore;
    const toast = window.MercuriosToast;

    // DOM Elements
    const searchInput = document.getElementById('staff-search-input');
    const roleFilter = document.getElementById('staff-filter-role');
    const storeFilter = document.getElementById('staff-filter-store');
    const tableBody = document.getElementById('staff-table-body');
    const btnAddStaff = document.getElementById('btn-add-staff');

    // Modal Elements
    const staffModal = document.getElementById('staff-modal');
    const staffForm = document.getElementById('form-staff');
    const modalTitle = document.getElementById('staff-modal-title');
    const btnCloseModal = document.getElementById('btn-close-staff-modal');
    const btnCancelModal = document.getElementById('btn-cancel-staff-modal');

    // Modal Form Inputs
    const inputId = document.getElementById('staff-input-id');
    const inputName = document.getElementById('staff-input-name');
    const inputEmail = document.getElementById('staff-input-email');
    const inputPhone = document.getElementById('staff-input-phone');
    const inputRole = document.getElementById('staff-input-role');
    const inputStore = document.getElementById('staff-input-store');
    const inputStatus = document.getElementById('staff-input-status');

    let editingStaffId = null;

    // Render Table
    function renderStaffTable() {
      if (!tableBody) return;
      const list = store.getState().staff || [];
      const query = (searchInput?.value || '').toLowerCase().trim();
      const roleVal = roleFilter?.value || 'ALL';
      const storeVal = storeFilter?.value || 'ALL';

      const filtered = list.filter(item => {
        const matchesQuery = !query ||
          item.name.toLowerCase().includes(query) ||
          item.email.toLowerCase().includes(query) ||
          item.phone.includes(query) ||
          item.role.toLowerCase().includes(query);
        const matchesRole = (roleVal === 'ALL' || item.role === roleVal);
        const matchesStore = (storeVal === 'ALL' || item.store === storeVal || (storeVal === '—' && (!item.store || item.store === '—')));
        return matchesQuery && matchesRole && matchesStore;
      });

      tableBody.innerHTML = '';

      if (filtered.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="8" style="text-align: center; padding: 36px; color: var(--text-muted); font-family: var(--font-mono);">
              NO STAFF MEMBERS MATCHING FILTER
            </td>
          </tr>
        `;
        return;
      }

      filtered.forEach(item => {
        const tr = document.createElement('tr');

        // Monogram Avatar
        const initials = item.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();

        const isActive = (item.status === 'ACTIVE' || item.status === 'Đang Hoạt Động');
        const statusHtml = isActive
          ? `<span class="badge-tag tag-active">[ACTIVE]</span>`
          : `<span class="badge-tag tag-pending">[INACTIVE]</span>`;

        tr.innerHTML = `
          <td>
            <div class="staff-user-cell">
              <div class="staff-avatar">${initials}</div>
              <span class="staff-name-text">${item.name}</span>
            </div>
          </td>
          <td class="cell-mono" style="color: var(--text-muted);">${item.email}</td>
          <td class="cell-mono">${item.phone}</td>
          <td><span class="role-badge">${item.role}</span></td>
          <td style="color: var(--text-muted);">${item.store || '—'}</td>
          <td>${statusHtml}</td>
          <td class="cell-mono" style="color: var(--text-muted); font-size: 11.5px;">${item.lastLogin || '—'}</td>
          <td>
            <div style="display: flex; gap: 6px;">
              <button class="btn btn-sm" data-action="edit">EDIT</button>
              <button class="btn btn-sm btn-danger" data-action="delete">DELETE</button>
            </div>
          </td>
        `;

        // Bind Edit
        tr.querySelector('[data-action="edit"]')?.addEventListener('click', () => {
          openEditModal(item);
        });

        // Bind Delete
        tr.querySelector('[data-action="delete"]')?.addEventListener('click', () => {
          handleDeleteStaff(item);
        });

        tableBody.appendChild(tr);
      });
    }

    // Modal Control
    function openAddModal() {
      editingStaffId = null;
      if (modalTitle) modalTitle.textContent = 'ADD NEW STAFF MEMBER';
      if (staffForm) staffForm.reset();
      if (inputId) inputId.value = '';
      if (staffModal) staffModal.classList.add('active');
      if (inputName) setTimeout(() => inputName.focus(), 50);
    }

    function openEditModal(item) {
      editingStaffId = item.id;
      if (modalTitle) modalTitle.textContent = `UPDATE STAFF [${item.id}]`;
      if (inputId) inputId.value = item.id;
      if (inputName) inputName.value = item.name;
      if (inputEmail) inputEmail.value = item.email;
      if (inputPhone) inputPhone.value = item.phone;
      if (inputRole) inputRole.value = item.role;
      if (inputStore) inputStore.value = item.store || '—';
      if (inputStatus) inputStatus.value = item.status || 'ACTIVE';
      if (staffModal) staffModal.classList.add('active');
    }

    function closeModal() {
      if (staffModal) staffModal.classList.remove('active');
      editingStaffId = null;
    }

    function handleDeleteStaff(item) {
      if (confirm(`Are you sure you want to remove staff member "${item.name}" (${item.email})?`)) {
        store.deleteStaff(item.id);
        renderStaffTable();
        toast.show(`Staff member [${item.name}] removed`);
      }
    }

    // Form Submit
    if (staffForm) {
      staffForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameVal = inputName?.value.trim();
        const emailVal = inputEmail?.value.trim();
        const phoneVal = inputPhone?.value.trim();
        const roleVal = inputRole?.value;
        const storeVal = inputStore?.value;
        const statusVal = inputStatus?.value;

        if (!nameVal || !emailVal || !phoneVal) {
          toast.show('Please fill in all required fields');
          return;
        }

        if (editingStaffId) {
          // Update
          store.updateStaff(editingStaffId, {
            name: nameVal,
            email: emailVal,
            phone: phoneVal,
            role: roleVal,
            store: storeVal,
            status: statusVal
          });
          toast.show(`Updated staff member: [${nameVal}]`);
        } else {
          // Add new
          const newMember = {
            id: `USR-${Date.now().toString().slice(-4)}`,
            name: nameVal,
            email: emailVal,
            phone: phoneVal,
            role: roleVal,
            store: storeVal,
            status: statusVal,
            lastLogin: '—'
          };
          store.addStaff(newMember);
          toast.show(`+ Added staff member: [${nameVal}]`);
        }

        closeModal();
        renderStaffTable();
      });
    }

    // Filter Listeners
    if (searchInput) searchInput.addEventListener('input', renderStaffTable);
    if (roleFilter) roleFilter.addEventListener('change', renderStaffTable);
    if (storeFilter) storeFilter.addEventListener('change', renderStaffTable);

    // Modal Listeners
    if (btnAddStaff) btnAddStaff.addEventListener('click', openAddModal);
    if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
    if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

    // Close on backdrop click
    if (staffModal) {
      staffModal.addEventListener('click', (e) => {
        if (e.target === staffModal) closeModal();
      });
    }

    // Initial render & Subscribe
    renderStaffTable();
    store.subscribe(() => {
      if (store.getState().currentView === 'staff') {
        renderStaffTable();
      }
    });
  }

  window.MercuriosStaffView = { init: initStaffView };
})();
