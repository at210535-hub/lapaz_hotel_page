// Shared DOM helpers for classic scripts.
window.LaPaz = window.LaPaz || {};
window.LaPaz.qs = function qs(sel, root) { return (root || document).querySelector(sel); };
window.LaPaz.qsa = function qsa(sel, root) { return [...(root || document).querySelectorAll(sel)]; };
window.LaPaz.ready = function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
};
