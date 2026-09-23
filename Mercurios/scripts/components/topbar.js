/**
 * MERCURIOS // TOPBAR COMPONENT CONTROLLER
 * Controls Operational Hub dropdown, LIVE/OFF status badge, and Sign Out action.
 */

(function () {
  'use strict';

  function initTopbar() {
    const store = window.mercuriosStore;
    const toast = window.MercuriosToast;

    const nodeSelector = document.getElementById('node-selector');
    const livePill = document.getElementById('live-indicator-pill');
    const btnSignOut = document.getElementById('btn-sign-out');

    // Operational Node Hub Selection
    if (nodeSelector) {
      nodeSelector.addEventListener('change', (e) => {
        store.setNode(e.target.value);
        toast.show(`Switched operational hub: ${e.target.value}`);
      });

      // Sync with store state
      store.subscribe((state) => {
        if (nodeSelector.value !== state.currentNode) {
          nodeSelector.value = state.currentNode;
        }
      });
    }

    // Toggle LIVE / OFF
    if (livePill) {
      livePill.addEventListener('click', () => {
        store.toggleLive();
        const state = store.getState();
        if (state.isLive) {
          livePill.classList.remove('off');
          livePill.innerHTML = '<span class="live-dot"></span>LIVE';
          toast.show('System Link: LIVE');
        } else {
          livePill.classList.add('off');
          livePill.innerHTML = '<span class="live-dot"></span>OFF';
          toast.show('System Link: STANDBY / OFF');
        }
      });
    }

    // Sign Out Link
    if (btnSignOut) {
      btnSignOut.addEventListener('click', () => {
        toast.show('[AUTH] Session terminated for Hoang Huu Nguyen (Admin)');
      });
    }
  }

  window.MercuriosTopbar = { init: initTopbar };
})();
