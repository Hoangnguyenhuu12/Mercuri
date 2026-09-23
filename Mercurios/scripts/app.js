/**
 * MERCURIOS // APPLICATION ENTRY POINT & BOOTSTRAPPER
 * Clean modular architecture. Initializes components and views sequentially.
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('[MERCURIOS] Initializing modular subsystems...');

  // 1. Initialize UI Shell & Components
  if (window.MercuriosTopbar) window.MercuriosTopbar.init();
  if (window.MercuriosSidebar) window.MercuriosSidebar.init();
  if (window.MercuriosModals) window.MercuriosModals.init();

  // 2. Initialize Views
  if (window.MercuriosOverviewView) window.MercuriosOverviewView.init();
  if (window.MercuriosProductsView) window.MercuriosProductsView.init();
  if (window.MercuriosCategoriesView) window.MercuriosCategoriesView.init();
  if (window.MercuriosCollectionsView) window.MercuriosCollectionsView.init();
  if (window.MercuriosMaterialsView) window.MercuriosMaterialsView.init();
  if (window.MercuriosSettingsView) window.MercuriosSettingsView.init();

  console.log('[MERCURIOS] All modules initialized and ready.');
});
