/**
 * MERCURIOS // SIDEBAR & ROUTING CONTROLLER
 * Handles sidebar item selection and seamless view switching across all operational screens.
 */

(function () {
  'use strict';

  const VIEWS = ['overview', 'products', 'categories', 'collections', 'materials', 'settings'];

  function initSidebar() {
    const store = window.mercuriosStore;
    const toast = window.MercuriosToast;

    const navItems = document.querySelectorAll('.nav-item[data-view-target]');

    function switchView(targetView) {
      navItems.forEach(item => {
        if (item.dataset.viewTarget === targetView) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });

      VIEWS.forEach(v => {
        const el = document.getElementById(`view-${v}`);
        if (el) {
          el.classList.toggle('active', v === targetView);
        }
      });

      store.setView(targetView);
    }

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const target = item.dataset.viewTarget;
        // If already on this view, do not show duplicate toast or re-render
        if (store.getState().currentView === target) {
          return;
        }
        switchView(target);
        toast.show(`Navigated to ${target.toUpperCase()}`);
      });
    });

    // Handle deferred/stub navigation links
    document.querySelectorAll('[data-action="stub-nav"]').forEach(item => {
      item.addEventListener('click', () => {
        const label = item.querySelector('span:first-child')?.textContent || 'Module';
        toast.show(`Module [${label}] is ready for extension`);
      });
    });

    // Expose switchView to global Mercurios API for AI bridge
    window.Mercurios = window.Mercurios || {};
    window.Mercurios.switchView = switchView;
  }

  window.MercuriosSidebar = { init: initSidebar };
})();
