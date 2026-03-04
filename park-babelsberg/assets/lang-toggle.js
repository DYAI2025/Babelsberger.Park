/**
 * Language Pill Toggle – Park Babelsberg
 * Self-contained. Works on index.html (client-side) and all subpages (navigation).
 * DACH detection: de / de-AT / de-CH → German, rest → English.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'preferred-language';

  /* ─── Language detection ─── */
  function getSaved() {
    var v = localStorage.getItem(STORAGE_KEY);
    return v === 'de' || v === 'en' ? v : null;
  }

  function detectDACH() {
    var langs = Array.from(navigator.languages || [navigator.language || 'de']);
    return langs.some(function (l) { return l.toLowerCase().startsWith('de'); }) ? 'de' : 'en';
  }

  function getCurrentLang() {
    var h = document.documentElement.lang;
    if (h) return h.split('-')[0] === 'en' ? 'en' : 'de';
    return window.location.pathname.includes('/en/') ? 'en' : 'de';
  }

  /* ─── URL helpers ─── */
  function getEquivalentURL(targetLang) {
    var path = window.location.pathname;
    // Normalise: extract everything after /park-babelsberg/
    var match = path.match(/\/park-babelsberg\/(.*)/);
    if (!match) return null;
    var rel = match[1]; // e.g. "flatowturm.html" or "en/flatowturm.html"

    if (targetLang === 'en') {
      if (rel.startsWith('en/')) return null; // already EN
      return '/park-babelsberg/en/' + rel;
    } else {
      if (!rel.startsWith('en/')) return null; // already DE
      return '/park-babelsberg/' + rel.replace(/^en\//, '');
    }
  }

  /* ─── DOM helpers ─── */
  function updatePillState(lang) {
    var deBtn = document.querySelector('.lpb-de');
    var enBtn = document.querySelector('.lpb-en');
    if (!deBtn || !enBtn) return;

    if (lang === 'de') {
      deBtn.classList.add('lpb-active');
      deBtn.setAttribute('aria-pressed', 'true');
      enBtn.classList.remove('lpb-active');
      enBtn.setAttribute('aria-pressed', 'false');
    } else {
      enBtn.classList.add('lpb-active');
      enBtn.setAttribute('aria-pressed', 'true');
      deBtn.classList.remove('lpb-active');
      deBtn.setAttribute('aria-pressed', 'false');
    }
  }

  function switchLang(targetLang) {
    var current = getCurrentLang();
    if (current === targetLang) return;

    localStorage.setItem(STORAGE_KEY, targetLang);

    // Index.html has client-side i18n.js → switch without navigation
    if (window.i18n && typeof window.i18n.setLanguage === 'function') {
      window.i18n.setLanguage(targetLang);
      updatePillState(targetLang);
      return;
    }

    // Subpage → navigate to static EN/DE equivalent
    var url = getEquivalentURL(targetLang);
    if (url) {
      window.location.href = url;
    }
  }

  /* ─── Inline styles (self-contained) ─── */
  function injectStyles() {
    if (document.getElementById('lpb-styles')) return;
    var s = document.createElement('style');
    s.id = 'lpb-styles';
    s.textContent = '\
.lpb-pill{\
  position:fixed;\
  bottom:92px;\
  right:24px;\
  display:flex;\
  align-items:stretch;\
  border-radius:9999px;\
  overflow:hidden;\
  box-shadow:0 4px 16px rgba(15,23,42,.18);\
  border:2px solid var(--border-light,#e2e8f0);\
  z-index:1050;\
  background:var(--bg-primary,#fff);\
  font-family:var(--font-sans,-apple-system,BlinkMacSystemFont,sans-serif);\
}\
.lpb-btn{\
  padding:10px 18px;\
  border:none;\
  cursor:pointer;\
  font-size:13px;\
  font-weight:700;\
  letter-spacing:.6px;\
  background:transparent;\
  color:var(--text-muted,#64748b);\
  transition:background 150ms,color 150ms;\
  line-height:1;\
}\
.lpb-btn:hover:not(.lpb-active){\
  background:var(--bg-secondary,#f8fafc);\
  color:var(--text-primary,#0f172a);\
}\
.lpb-btn.lpb-active{\
  background:var(--accent-primary,#0284c7);\
  color:#fff;\
}\
.lpb-sep{\
  width:1px;\
  background:var(--border-light,#e2e8f0);\
  flex-shrink:0;\
}\
[data-theme="dark"] .lpb-pill{\
  background:var(--bg-secondary,#1e293b);\
  border-color:var(--border-light,#334155);\
}\
[data-theme="dark"] .lpb-sep{\
  background:var(--border-light,#334155);\
}\
[data-theme="dark"] .lpb-btn.lpb-active{\
  background:var(--accent-primary,#38bdf8);\
  color:#0f172a;\
}\
@media(max-width:480px){\
  .lpb-pill{bottom:80px;right:16px;}\
  .lpb-btn{padding:8px 14px;font-size:12px;}\
}\
';
    document.head.appendChild(s);
  }

  /* ─── Toggle injection ─── */
  function injectToggle() {
    if (document.getElementById('lpb-pill')) return;

    // Hide old circular lang-toggle if present (index.html)
    var old = document.getElementById('lang-toggle');
    if (old) old.style.display = 'none';

    var pill = document.createElement('div');
    pill.id = 'lpb-pill';
    pill.className = 'lpb-pill';
    pill.setAttribute('role', 'group');
    pill.setAttribute('aria-label', 'Sprache / Language');

    var deBtn = document.createElement('button');
    deBtn.className = 'lpb-btn lpb-de';
    deBtn.textContent = 'DE';
    deBtn.setAttribute('title', 'Auf Deutsch anzeigen');
    deBtn.setAttribute('aria-pressed', 'false');
    deBtn.addEventListener('click', function () { switchLang('de'); });

    var sep = document.createElement('div');
    sep.className = 'lpb-sep';
    sep.setAttribute('aria-hidden', 'true');

    var enBtn = document.createElement('button');
    enBtn.className = 'lpb-btn lpb-en';
    enBtn.textContent = 'EN';
    enBtn.setAttribute('title', 'Show in English');
    enBtn.setAttribute('aria-pressed', 'false');
    enBtn.addEventListener('click', function () { switchLang('en'); });

    pill.appendChild(deBtn);
    pill.appendChild(sep);
    pill.appendChild(enBtn);
    document.body.appendChild(pill);

    // Reflect current lang on pill
    updatePillState(getCurrentLang());
  }

  /* ─── Expose for i18n.js sync ─── */
  window.langPill = { update: updatePillState };

  /* ─── Init ─── */
  function init() {
    injectStyles();
    injectToggle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
