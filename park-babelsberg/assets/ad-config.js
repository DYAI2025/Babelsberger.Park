/**
 * AdSense Ad Configuration – Park Babelsberg
 * Publisher-ID: ca-pub-1712273263687132
 *
 * ═══════════════════════════════════════════════════════════════════
 * HOW TO ACTIVATE ADS (3 Schritte)
 * ═══════════════════════════════════════════════════════════════════
 * 1. Öffnen Sie https://adsense.google.com → Anzeigen → Nach Anzeigenblock
 * 2. Erstellen Sie für jeden Slot unten einen Anzeigenblock (falls noch nicht
 *    vorhanden) und notieren Sie die NUMERISCHE Slot-ID (z. B. "1234567890")
 * 3. Tragen Sie die Slot-IDs unten in AD_SLOTS ein und deployen Sie
 * ═══════════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  /* ──────────────────────────────────────────────────────────────────
   * SLOT-ID KONFIGURATION  ← Numerische Slot-IDs hier eintragen
   * ────────────────────────────────────────────────────────────────── */
  var AD_SLOTS = {
    TOP_HORIZONTAL:    '7082205943',  // BB_desktop – responsive (breit)
    MIDDLE_HORIZONTAL: '9200627461',  // bb_hoch1 – responsive (hoch)
    PARKS_AUTO:        '8290870475',  // bb_quadrat1 – responsive (quadrat)
    PLANEN_AUTO:       '7082205943',  // BB_desktop – responsive (breit)
    FAQ_AUTO:          '9200627461',  // bb_hoch1 – responsive (hoch)
    STICKY_MOBILE:     '8290870475',  // bb_quadrat1 – responsive (quadrat)
    IN_ARTICLE:        '9200627461',  // bb_hoch1 – responsive (hoch, Subpages)
    INFEED:            '8290870475',  // bb_quadrat1 – responsive (quadrat, Listing)
  };

  /* ──────────────────────────────────────────────────────────────────
   * SLOT-NAME-MAPPING für Legacy-Platzhalter in den HTML-Templates
   * ────────────────────────────────────────────────────────────────── */
  var SLOT_MAP = {
    'BABELSB_TOP_1':         AD_SLOTS.TOP_HORIZONTAL,
    'BABELSB_MIDDLE_2':      AD_SLOTS.MIDDLE_HORIZONTAL,
    'BABELSB_PARKS_3':       AD_SLOTS.PARKS_AUTO,
    'BABELSB_PLANEN_4':      AD_SLOTS.PLANEN_AUTO,
    'BABELSB_FAQ_5':         AD_SLOTS.FAQ_AUTO,
    'BABELSB_STICKY_MOBILE': AD_SLOTS.STICKY_MOBILE,
    'BABELSB_IN_ARTICLE':    AD_SLOTS.IN_ARTICLE,
    'BABELSB_INFEED':        AD_SLOTS.INFEED,
    // Blog-specific mappings
    'BLOG_CONTENT_1':        AD_SLOTS.INFEED,
    'BLOG_CONTENT_2':        AD_SLOTS.IN_ARTICLE,
    'BLOG_INDEX_1':          AD_SLOTS.INFEED,
    'BLOG_INDEX_2':          AD_SLOTS.INFEED,
  };

  /* ──────────────────────────────────────────────────────────────────
   * Slot-IDs injizieren und alle Ad-Units auf der Seite initialisieren
   * ────────────────────────────────────────────────────────────────── */
  function initAds() {
    var units = document.querySelectorAll('ins.adsbygoogle');
    var pushed = 0;
    var skipped = 0;

    units.forEach(function (ins) {
      // Legacy-Platzhalter → numerische ID auflösen
      var currentSlot = ins.getAttribute('data-ad-slot') || '';
      if (Object.prototype.hasOwnProperty.call(SLOT_MAP, currentSlot)) {
        var resolved = SLOT_MAP[currentSlot];
        if (resolved) {
          ins.setAttribute('data-ad-slot', resolved);
        }
      }

      // Nur Units mit gültiger (nicht-leerer) Slot-ID und ohne vorherige
      // Initialisierung pushen (AdSense markiert initialisierte Units)
      var slotId = ins.getAttribute('data-ad-slot') || '';
      if (slotId && !ins.dataset.adsbygoogleStatus) {
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          pushed++;
        } catch (e) {
          // AdSense noch nicht geladen – sicher ignorierbar
        }
      } else {
        skipped++;
      }
    });

    if (pushed > 0) {
      console.log('[AdConfig] ' + pushed + ' Anzeigeneinheit(en) initialisiert.');
    }
    if (skipped > 0 && pushed === 0) {
      console.warn(
        '[AdConfig] ' + units.length + ' Anzeigeneinheit(en) gefunden, aber keine numerischen ' +
        'Slot-IDs konfiguriert.\n' +
        '→ Bitte AD_SLOTS in park-babelsberg/assets/ad-config.js ausfüllen.'
      );
    }
  }

  // Nach vollständigem Seitenladung ausführen
  if (document.readyState === 'complete') {
    initAds();
  } else {
    window.addEventListener('load', initAds);
  }

})();
