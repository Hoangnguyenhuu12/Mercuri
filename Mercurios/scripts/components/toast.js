/**
 * MERCURIOS // TOAST NOTIFICATION COMPONENT
 * Self-contained, lightweight toast notification controller with deduplication,
 * max-stack capping, and adaptive duration for rapid clicking.
 */

(function () {
  'use strict';

  let lastToastTime = 0;
  const MAX_TOASTS = 3;

  function show(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    // 1. DEDUPLICATION: Ignore if identical message is already visible
    const existing = Array.from(container.children).find(el => el.textContent === message);
    if (existing) {
      // Briefly highlight existing toast and return
      existing.style.transform = 'scale(1.04)';
      setTimeout(() => { existing.style.transform = 'scale(1)'; }, 100);
      return;
    }

    // 2. STACK LIMIT: Keep maximum 3 toasts, remove oldest immediately
    while (container.children.length >= MAX_TOASTS) {
      container.removeChild(container.firstChild);
    }

    // 3. ADAPTIVE TIMEOUT: Reduce display time if user clicks rapidly
    const now = Date.now();
    const isRapid = (now - lastToastTime) < 1200;
    lastToastTime = now;
    const duration = isRapid ? 1400 : 2400;

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(6px)';
      setTimeout(() => toast.remove(), 200);
    }, duration);
  }

  window.MercuriosToast = { show };
  window.MercuriosUI = window.MercuriosUI || {};
  window.MercuriosUI.showToast = show;
})();
