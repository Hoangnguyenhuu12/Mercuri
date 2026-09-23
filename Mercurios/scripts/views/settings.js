/**
 * MERCURIOS // SETTINGS VIEW CONTROLLER
 * Controls Account Profile, Operational Hub Selection, Theme Toggle and Subsystems Telemetry.
 */

(function () {
  'use strict';

  function initSettingsView() {
    const store = window.mercuriosStore;
    const toast = window.MercuriosToast;

    const nodeSelector = document.getElementById('settings-node-selector');
    const themeSelector = document.getElementById('settings-theme-selector');

    // Operational Node Hub Selection (Moved inside Settings per user request)
    if (nodeSelector) {
      nodeSelector.addEventListener('change', (e) => {
        store.setNode(e.target.value);
        toast.show(`Operational Hub updated: ${e.target.value}`);
      });

      // Sync with store
      store.subscribe((state) => {
        if (nodeSelector.value !== state.currentNode) {
          nodeSelector.value = state.currentNode;
        }
      });
    }

    // Theme Switch Selector inside Settings View
    if (themeSelector) {
      themeSelector.addEventListener('change', (e) => {
        store.setTheme(e.target.value);
        toast.show(`Visual Theme: ${e.target.value.toUpperCase()}`);
      });

      store.subscribe((state) => {
        if (themeSelector.value !== state.theme) {
          themeSelector.value = state.theme;
        }
      });
    }
  }

  window.MercuriosSettingsView = { init: initSettingsView };
})();
