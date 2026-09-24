/**
 * MERCURIX // FASHION OPERATIONS ASSISTANT
 * Unifies Context Engine, Action Catalog, and Brain Core into window.Mercurix.
 * Serves as the independent AI brain module for MercuriOS.
 */

(function () {
  'use strict';

  const Mercurix = {
    version: '2.0.0-alpha',
    name: 'Mercurix',
    title: 'Fashion Operations Assistant',
    status: 'ONLINE',

    /**
     * Connection and health check
     */
    isReady: function () {
      return !!(window.MercurixBrain && window.MercurixActionCatalog && window.MercurixContextEngine);
    },

    /**
     * Process an operational prompt through the ReAct Brain
     * @param {string} prompt User prompt
     * @param {Object} [context] Optional explicit context
     * @returns {Promise<Object>} { thinking: string[], actions: Object[], text: string }
     */
    processCommand: async function (prompt, context) {
      const pageContext = context || (window.MercurixContextEngine ? window.MercurixContextEngine.getPageContext() : {});
      if (window.MercurixBrain && window.MercurixBrain.processPrompt) {
        return await window.MercurixBrain.processPrompt(prompt, pageContext);
      }
      return {
        thinking: ['Connecting to Mercurix Brain Core...'],
        actions: [],
        text: 'Mercurix Brain Core is initializing. Please retry in a moment.'
      };
    },

    /**
     * Get suggested chips based on current view (chips removed per user request)
     */
    getContextChips: function (view) {
      return [];
    },

    /**
     * Direct access to Action Catalog
     */
    tools: window.MercurixActionCatalog || null
  };

  window.Mercurix = Mercurix;
  console.log('[Mercurix] Fashion Operations Assistant loaded and mounted on window.Mercurix');
})();
