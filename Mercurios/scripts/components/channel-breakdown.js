/**
 * MERCURIOS // CHANNEL BREAKDOWN MODULE
 * Modular plug-in component for Omnichannel Revenue (Shopee, TikTok Shop, Direct Outlets).
 * Designed to show how easily components can be mounted or swapped by Mercurix AI.
 */

(function () {
  'use strict';

  function renderChannelBreakdown(container, state) {
    container.innerHTML = `
      <div style="width: 100%; display: flex; flex-direction: column; gap: 14px; text-align: left;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px;">
          <span style="font-family: var(--font-mono); font-weight: 700; font-size: 11px;">REVENUE BY CHANNEL</span>
          <span class="kpi-tag">[MULTI-FEED]</span>
        </div>

        <!-- SHOPEE FEED -->
        <div>
          <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 11px; margin-bottom: 4px;">
            <span>[SHOPEE MALL]</span>
            <strong>108,200,000 đ (43.5%)</strong>
          </div>
          <div style="height: 6px; background: var(--bg-surface-subtle); border: 1px solid var(--border-subtle); width: 100%;">
            <div style="height: 100%; width: 43.5%; background: var(--accent-solid);"></div>
          </div>
        </div>

        <!-- TIKTOK SHOP -->
        <div>
          <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 11px; margin-bottom: 4px;">
            <span>[TIKTOK SHOP]</span>
            <strong>79,500,000 đ (32.0%)</strong>
          </div>
          <div style="height: 6px; background: var(--bg-surface-subtle); border: 1px solid var(--border-subtle); width: 100%;">
            <div style="height: 100%; width: 32.0%; background: var(--text-secondary);"></div>
          </div>
        </div>

        <!-- PHYSICAL RETAIL -->
        <div>
          <div style="display: flex; justify-content: space-between; font-family: var(--font-mono); font-size: 11px; margin-bottom: 4px;">
            <span>[RETAIL CHAIN (9)]</span>
            <strong>60,800,000 đ (24.5%)</strong>
          </div>
          <div style="height: 6px; background: var(--bg-surface-subtle); border: 1px solid var(--border-subtle); width: 100%;">
            <div style="height: 100%; width: 24.5%; background: var(--border-strong);"></div>
          </div>
        </div>

        <div style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); padding-top: 6px; border-top: 1px dashed var(--border-subtle); display: flex; justify-content: space-between;">
          <span>SYNC: REAL-TIME WEBHOOK</span>
          <span>CHANNEL HEALTH: 100%</span>
        </div>
      </div>
    `;
  }

  // Auto-mount into slot when DOM is ready
  window.addEventListener('DOMContentLoaded', () => {
    if (window.Mercurios) {
      window.Mercurios.registerModule('#slot-omnichannel-analytics', renderChannelBreakdown);
    }
  });
})();
