import { test, expect } from '@playwright/test';

/**
 * Test Suite: Internal Links & Navigation
 * Testet alle internen Verlinkungen und Navigation
 */

test.describe('Internal Links & Navigation', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/park-babelsberg/index.html');
  });

  test('should have working navigation badges', async ({ page }) => {
    // Teste alle Badge-Links im Header
    const badges = [
      { selector: 'a[href="#areale"]', text: 'Die 4 Areale' },
      { selector: 'a[href="#location-finder"]', text: 'Location-Finder' },
      { selector: 'a[href="#kategorien"]', text: 'Kategorien' },
      { selector: 'a[href="#enthusiasts"]', text: 'Für Enthusiasten' },
      { selector: 'a[href="#anreise"]', text: 'Anreise' },
      { selector: 'a[href="#faq"]', text: 'FAQ' },
    ];

    for (const badge of badges) {
      const link = page.locator(badge.selector);
      await expect(link).toBeVisible();
      
      // Klicke auf den Link
      await link.click();
      
      // Warte kurz für Scroll-Animation
      await page.waitForTimeout(500);
      
      // Prüfe ob die Sektion sichtbar ist
      const sectionId = badge.selector.match(/#([^"]+)/)?.[1];
      if (sectionId) {
        const section = page.locator(`#${sectionId}`);
        await expect(section).toBeInViewport();
      }
    }
  });

  test('should have working detail page links', async ({ page }) => {
    // Teste Links zu Detailseiten
    const detailPages = [
      { text: 'Fotografie', href: 'fotografie.html' },
      { text: 'Geocaching', href: 'geocaching.html' },
      { text: 'Geschichte', href: 'geschichte.html' },
      { text: 'Laufen', href: 'laufen.html' },
      { text: 'Yoga', href: 'yoga.html' },
    ];

    for (const page_link of detailPages) {
      const link = page.locator(`a[href="${page_link.href}"]`).first();
      
      if (await link.count() > 0) {
        await expect(link).toBeVisible();
        
        // Prüfe dass der Link korrekt ist
        const href = await link.getAttribute('href');
        expect(href).toBe(page_link.href);
      }
    }
  });

  test('should navigate to detail pages and back', async ({ page }) => {
    // Teste Navigation zu Fotografie-Seite
    const fotografieLink = page.locator('a[href="fotografie.html"]').first();
    
    if (await fotografieLink.count() > 0) {
      await fotografieLink.click();
      await page.waitForLoadState('networkidle');
      
      // Prüfe URL
      expect(page.url()).toContain('fotografie.html');
      
      // Prüfe Breadcrumb
      const breadcrumb = page.locator('.breadcrumb');
      await expect(breadcrumb).toBeVisible();
      
      // Zurück zur Startseite
      const homeLink = page.locator('a[href="index.html"]');
      await homeLink.click();
      await page.waitForLoadState('networkidle');
      
      expect(page.url()).toContain('index.html');
    }
  });

  test('should have all critical pages accessible', async ({ page }) => {
    const criticalPages = [
      'index.html',
      'fotografie.html',
      'geocaching.html',
      'geschichte.html',
      'laufen.html',
      'yoga.html',
      'soziale-treffpunkte.html',
    ];

    for (const pagePath of criticalPages) {
      const response = await page.goto(`/park-babelsberg/${pagePath}`);
      expect(response?.status()).toBe(200);
      
      // Prüfe dass die Seite Inhalt hat
      const body = page.locator('body');
      await expect(body).not.toBeEmpty();
    }
  });

  test('should have no broken internal links', async ({ page }) => {
    // Sammle alle internen Links
    const links = await page.locator('a[href^="index.html"], a[href^="fotografie"], a[href^="geocaching"], a[href^="geschichte"], a[href^="laufen"], a[href^="yoga"], a[href^="soziale"]').all();
    
    const brokenLinks: string[] = [];
    
    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('http')) {
        const response = await page.goto(`/park-babelsberg/${href}`);
        if (response?.status() !== 200) {
          brokenLinks.push(href);
        }
      }
    }
    
    expect(brokenLinks).toHaveLength(0);
  });

  test('should have working anchor links within sections', async ({ page }) => {
    // Teste Sprungmarken innerhalb der Seite
    const anchors = ['#areale', '#location-finder', '#kategorien', '#enthusiasts', '#anreise', '#faq'];
    
    for (const anchor of anchors) {
      await page.goto(`/park-babelsberg/index.html${anchor}`);
      await page.waitForTimeout(300);
      
      const section = page.locator(anchor);
      await expect(section).toBeInViewport();
    }
  });

  test('should have external links with proper attributes', async ({ page }) => {
    // Prüfe externe Links (sollten target="_blank" und rel="noopener" haben)
    const externalLinks = await page.locator('a[href^="http"]').all();
    
    for (const link of externalLinks) {
      const href = await link.getAttribute('href');
      
      // Skip Google Analytics und AdSense Links
      if (href?.includes('google') || href?.includes('doubleclick')) {
        continue;
      }
      
      const target = await link.getAttribute('target');
      const rel = await link.getAttribute('rel');
      
      // Externe Links sollten in neuem Tab öffnen
      if (target === '_blank') {
        expect(rel).toContain('noopener');
      }
    }
  });

  test('should have working theme toggle', async ({ page }) => {
    const themeToggle = page.locator('#theme-toggle');
    await expect(themeToggle).toBeVisible();
    
    // Initial theme (sollte light sein oder system preference)
    const initialTheme = await page.evaluate(() => 
      document.documentElement.getAttribute('data-theme')
    );
    
    // Toggle theme
    await themeToggle.click();
    await page.waitForTimeout(200);
    
    const newTheme = await page.evaluate(() => 
      document.documentElement.getAttribute('data-theme')
    );
    
    expect(newTheme).not.toBe(initialTheme);
    
    // Toggle zurück
    await themeToggle.click();
    await page.waitForTimeout(200);
    
    const finalTheme = await page.evaluate(() => 
      document.documentElement.getAttribute('data-theme')
    );
    
    expect(finalTheme).toBe(initialTheme);
  });

  test('should have working language toggle', async ({ page }) => {
    const langToggle = page.locator('#lang-toggle');
    
    if (await langToggle.count() > 0) {
      await expect(langToggle).toBeVisible();
      
      // Klicke auf Language Toggle
      await langToggle.click();
      await page.waitForTimeout(300);
      
      // Prüfe dass sich die Sprache geändert hat
      const htmlLang = await page.evaluate(() => 
        document.documentElement.getAttribute('lang')
      );
      
      expect(['de', 'en']).toContain(htmlLang);
    }
  });
});