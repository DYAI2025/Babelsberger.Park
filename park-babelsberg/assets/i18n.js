/**
 * i18n System for Park Babelsberg Website
 * Handles language switching between German (de) and English (en)
 * DACH-aware: de / de-AT / de-CH → German, everything else → English
 */

(function() {
  'use strict';

  // Capture base path at script evaluation time so fetch calls work correctly
  // from any subdirectory (e.g. /en/).  We try document.currentScript first
  // (available for synchronous non-defer/async scripts) and fall back to a
  // DOM query for the <script src="…i18n…"> tag, which is always in the DOM
  // by the time this IIFE executes.
  const _BASE_PATH = (function() {
    var s = document.currentScript || document.querySelector('script[src*="i18n"]');
    if (!s || !s.src) return '';
    // Strip everything from /assets/i18n… onwards
    return s.src.replace(/\/assets\/i18n[^/]*$/, '');
  })();

  const i18n = {
    currentLang: 'de',
    translations: {},
    fallbackLang: 'de',

    /**
     * Initialize i18n system
     */
    async init() {
      await this.loadTranslations();

      const savedLang = localStorage.getItem('preferred-language');
      const detectedLang = savedLang || this.detectBrowserLang();

      await this.setLanguage(detectedLang);
      this.setupLanguageToggle();

      console.log('✅ i18n initialized:', this.currentLang);
    },

    /**
     * DACH-aware language detection.
     * de / de-AT / de-CH / de-LI / de-LU → 'de'
     * Everything else → 'en'
     */
    detectBrowserLang() {
      const langs = Array.from(navigator.languages || [navigator.language || 'de']);
      const isDACH = langs.some(l => l.toLowerCase().startsWith('de'));
      return isDACH ? 'de' : 'en';
    },

    /**
     * Load translation files
     */
    async loadTranslations() {
      try {
        const [de, en] = await Promise.all([
          fetch(_BASE_PATH + '/assets/translations/de.json').then(r => r.json()),
          fetch(_BASE_PATH + '/assets/translations/en.json').then(r => r.json())
        ]);
        this.translations = { de, en };
        console.log('✅ Translations loaded');
      } catch (error) {
        console.error('❌ Failed to load translations:', error);
      }
    },

    /**
     * Get translation by key path (e.g., 'hero.title')
     */
    t(keyPath) {
      const keys = keyPath.split('.');
      let value = this.translations[this.currentLang];

      if (!value) return null; // Safe guard for failed fetches

      for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
          value = value[key];
        } else {
          // Fallback to German if key not found
          value = this.translations[this.fallbackLang];
          if (!value) return null;
          
          for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
              value = value[k];
            } else {
              return null; // Key missing in both languages
            }
          }
          break;
        }
      }

      return value;
    },

    /**
     * Set language and update DOM
     */
    async setLanguage(lang) {
      if (!['de', 'en'].includes(lang)) lang = this.fallbackLang;

      this.currentLang = lang;
      localStorage.setItem('preferred-language', lang);

      document.documentElement.lang = lang;
      this.updateDOM();
      this.updateMetaTags();
      this.updateLanguageToggle();

      // Sync pill toggle if lang-toggle.js is loaded
      if (window.langPill && typeof window.langPill.update === 'function') {
        window.langPill.update(lang);
      }

      console.log('🌍 Language set to:', lang);
    },

    /**
     * Update all DOM elements with translations
     */
    updateDOM() {
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = this.t(key);

        if (translation) {
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            if (el.placeholder) el.placeholder = translation;
          } else {
            el.textContent = translation;
          }
        }
      });

      document.querySelectorAll('[data-i18n-html]').forEach(el => {
        const key = el.getAttribute('data-i18n-html');
        const translation = this.t(key);
        if (translation) el.innerHTML = translation;
      });

      document.querySelectorAll('[data-i18n-aria]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria');
        const translation = this.t(key);
        if (translation) el.setAttribute('aria-label', translation);
      });

      document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        const translation = this.t(key);
        if (translation) el.setAttribute('title', translation);
      });
    },

    /**
     * Update meta tags
     */
    updateMetaTags() {
      const title = this.t('meta.title');
      const description = this.t('meta.description');

      if (title && title !== 'meta.title') document.title = title;

      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && description && description !== 'meta.description') metaDesc.content = description;

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle && title) ogTitle.content = title;

      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc && description) ogDesc.content = description;

      const ogLocale = document.querySelector('meta[property="og:locale"]');
      if (ogLocale) ogLocale.content = this.currentLang === 'de' ? 'de_DE' : 'en_US';
    },

    /**
     * Setup language toggle button (legacy circular button on index.html)
     */
    setupLanguageToggle() {
      const toggle = document.getElementById('lang-toggle');
      if (!toggle) return;

      toggle.addEventListener('click', () => {
        const newLang = this.currentLang === 'de' ? 'en' : 'de';
        this.setLanguage(newLang);
      });
    },

    /**
     * Update legacy language toggle button state
     */
    updateLanguageToggle() {
      const toggle = document.getElementById('lang-toggle');
      if (!toggle) return;

      const deText = toggle.querySelector('.lang-text-de');
      const enText = toggle.querySelector('.lang-text-en');

      if (this.currentLang === 'de') {
        if (deText) deText.style.display = 'none';
        if (enText) enText.style.display = 'block';
        toggle.setAttribute('aria-label', 'Switch to English');
        toggle.setAttribute('title', 'Switch to English');
      } else {
        if (deText) deText.style.display = 'block';
        if (enText) enText.style.display = 'none';
        toggle.setAttribute('aria-label', 'Auf Deutsch umschalten');
        toggle.setAttribute('title', 'Auf Deutsch umschalten');
      }
    }
  };

  window.i18n = i18n;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => i18n.init());
  } else {
    i18n.init();
  }
})();
