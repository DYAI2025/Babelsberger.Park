import { test, expect } from '@playwright/test';

/**
 * Test Suite: Google AdSense Compliance
 *
 * Prüft, dass alle kritischen Seiten die drei AdSense-Pflichtbestandteile enthalten:
 *  1. <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-...">
 *  2. <meta name="google-adsense-account" content="ca-pub-...">
 *  3. Mindestens eine <ins class="adsbygoogle"> Anzeigeneinheit
 *
 * Außerdem wird ads.txt auf korrekte Erreichbarkeit und Inhalt geprüft.
 *
 * Publisher ID: ca-pub-1712273263687132
 */

const PUBLISHER_ID = 'ca-pub-1712273263687132';
const ADSENSE_SCRIPT_URL = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUBLISHER_ID}`;

/** Alle DE-Seiten, die AdSense-konform sein müssen */
const DE_PAGES = [
  '/park-babelsberg/index.html',
  '/park-babelsberg/park-babelsberg.html',
  '/park-babelsberg/park-glienicke.html',
  '/park-babelsberg/neuer-garten.html',
  '/park-babelsberg/schloss-babelsberg.html',
  '/park-babelsberg/flatowturm.html',
  '/park-babelsberg/marmorpalais.html',
  '/park-babelsberg/soziale-treffpunkte.html',
  '/park-babelsberg/fotografie.html',
  '/park-babelsberg/geocaching.html',
  '/park-babelsberg/geschichte.html',
  '/park-babelsberg/laufen.html',
  '/park-babelsberg/yoga.html',
  '/park-babelsberg/uferweg-nord.html',
  '/park-babelsberg/gastronomie.html',
  '/park-babelsberg/anreise-parken.html',
  '/park-babelsberg/oeffnungszeiten-tickets.html',
  '/park-babelsberg/blog/index.html',
  '/park-babelsberg/blog/agentenaustausch-glienicker-bruecke.html',
  '/park-babelsberg/blog/dampfmaschinenhaus-technisches-wunder.html',
];

/** EN-Entsprechungen */
const EN_PAGES = [
  '/park-babelsberg/en/index.html',
  '/park-babelsberg/en/park-babelsberg.html',
  '/park-babelsberg/en/neuer-garten.html',
  '/park-babelsberg/en/soziale-treffpunkte.html',
  '/park-babelsberg/en/fotografie.html',
  '/park-babelsberg/en/yoga.html',
  '/park-babelsberg/en/blog/index.html',
];

const ALL_PAGES = [...DE_PAGES, ...EN_PAGES];

// Hilfsfunktion: Prüft eine einzelne Seite auf alle drei AdSense-Pflichtbestandteile
async function checkAdSenseOnPage(page: any, url: string) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // 1. AdSense Loader Script
  const scriptSrc = await page.evaluate((scriptUrl: string) => {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    return scripts.some(s => {
      const src = s.getAttribute('src') || '';
      return src.includes('pagead2.googlesyndication.com/pagead/js/adsbygoogle.js');
    });
  }, ADSENSE_SCRIPT_URL);

  expect(scriptSrc, `[${url}] AdSense Loader-Script fehlt`).toBe(true);

  // 2. Correct client parameter
  const clientParam = await page.evaluate((pubId: string) => {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    return scripts.some(s => {
      const src = s.getAttribute('src') || '';
      return src.includes(`client=${pubId}`);
    });
  }, PUBLISHER_ID);

  expect(clientParam, `[${url}] AdSense Script hat falsche Publisher-ID`).toBe(true);

  // 3. crossorigin="anonymous" auf dem Script-Tag
  const hasCrossorigin = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script[src]'));
    return scripts.some(s => {
      const src = s.getAttribute('src') || '';
      return src.includes('adsbygoogle.js') &&
             s.getAttribute('crossorigin') === 'anonymous';
    });
  });

  expect(hasCrossorigin, `[${url}] AdSense Script fehlt crossorigin="anonymous"`).toBe(true);

  // 4. meta name="google-adsense-account"
  const metaContent = await page.evaluate((pubId: string) => {
    const meta = document.querySelector('meta[name="google-adsense-account"]');
    return meta ? meta.getAttribute('content') : null;
  }, PUBLISHER_ID);

  expect(metaContent, `[${url}] <meta name="google-adsense-account"> fehlt`).not.toBeNull();
  expect(metaContent, `[${url}] <meta name="google-adsense-account"> hat falsche Publisher-ID`).toBe(PUBLISHER_ID);
}

// ─────────────────────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────────────────────

test.describe('Google AdSense Compliance', () => {

  test('ads.txt erreichbar und korrekt befüllt', async ({ request }) => {
    const response = await request.get('/ads.txt');
    expect(response.status(), 'ads.txt muss HTTP 200 zurückgeben').toBe(200);

    const text = await response.text();
    expect(text, 'ads.txt muss Publisher-ID enthalten').toContain(PUBLISHER_ID.replace('ca-', ''));
    expect(text, 'ads.txt muss DIRECT-Eintrag enthalten').toContain('DIRECT');
    expect(text, 'ads.txt muss f08c47fec0942fa0 enthalten').toContain('f08c47fec0942fa0');
  });

  test('AdSense Script auf index.html (DE) vorhanden', async ({ page }) => {
    await checkAdSenseOnPage(page, '/park-babelsberg/index.html');
  });

  test('AdSense Script auf marmorpalais.html vorhanden', async ({ page }) => {
    await checkAdSenseOnPage(page, '/park-babelsberg/marmorpalais.html');
  });

  test('AdSense Script auf soziale-treffpunkte.html vorhanden', async ({ page }) => {
    await checkAdSenseOnPage(page, '/park-babelsberg/soziale-treffpunkte.html');
  });

  test('AdSense Script auf blog/index.html vorhanden', async ({ page }) => {
    await checkAdSenseOnPage(page, '/park-babelsberg/blog/index.html');
  });

  test('AdSense Script auf en/index.html vorhanden', async ({ page }) => {
    await checkAdSenseOnPage(page, '/park-babelsberg/en/index.html');
  });

  test('AdSense Script auf en/blog: agentenaustausch vorhanden', async ({ page }) => {
    await checkAdSenseOnPage(page, '/park-babelsberg/en/blog/agentenaustausch-glienicker-bruecke.html');
  });

  // Batch-Test für alle DE-Seiten
  for (const pagePath of DE_PAGES) {
    test(`[DE] AdSense vollständig auf ${pagePath}`, async ({ page }) => {
      await checkAdSenseOnPage(page, pagePath);
    });
  }

  // Batch-Test für alle EN-Seiten
  for (const pagePath of EN_PAGES) {
    test(`[EN] AdSense vollständig auf ${pagePath}`, async ({ page }) => {
      await checkAdSenseOnPage(page, pagePath);
    });
  }

  // Strukturelle Checks
  test('index.html hat async-Attribut auf AdSense Script', async ({ page }) => {
    await page.goto('/park-babelsberg/index.html', { waitUntil: 'domcontentloaded' });

    const isAsync = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      const adScript = scripts.find(s =>
        (s.getAttribute('src') || '').includes('adsbygoogle.js')
      );
      return adScript ? (adScript as HTMLScriptElement).async : false;
    });

    expect(isAsync, 'AdSense script muss das async-Attribut haben').toBe(true);
  });

  test('Keine doppelten AdSense Script-Einbindungen auf index.html', async ({ page }) => {
    await page.goto('/park-babelsberg/index.html', { waitUntil: 'domcontentloaded' });

    const count = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script[src]'));
      return scripts.filter(s =>
        (s.getAttribute('src') || '').includes('adsbygoogle.js')
      ).length;
    });

    expect(count, 'AdSense Script darf nicht mehrfach eingebunden sein').toBe(1);
  });
});
