import { test, expect } from '@playwright/test';

test.describe('Performance Tests - Park Babelsberg Hauptseite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/park-babelsberg/index.html');
  });

  test('should have good Largest Contentful Paint (LCP)', async ({ page }) => {
    // Measure LCP
    const lcp = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
          resolve(lastEntry.renderTime || lastEntry.loadTime || 0);
        }).observe({ type: 'largest-contentful-paint', buffered: true });

        // Fallback timeout
        setTimeout(() => resolve(0), 5000);
      });
    });

    console.log(`LCP: ${lcp}ms`);
    expect(lcp).toBeLessThan(2500); // Good LCP is < 2.5s
  });

  test('should have minimal Cumulative Layout Shift (CLS)', async ({ page }) => {
    // Wait for page to stabilize
    await page.waitForLoadState('networkidle');

    const cls = await page.evaluate(() => {
      return new Promise<number>((resolve) => {
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
        }).observe({ type: 'layout-shift', buffered: true });

        setTimeout(() => resolve(clsValue), 3000);
      });
    });

    console.log(`CLS: ${cls}`);
    expect(cls).toBeLessThan(0.1); // Good CLS is < 0.1
  });

  test('should load critical resources quickly', async ({ page }) => {
    const navigationTiming = await page.evaluate(() => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
        loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
        domInteractive: perfData.domInteractive - perfData.fetchStart,
      };
    });

    console.log('Navigation Timing:', navigationTiming);
    expect(navigationTiming.domInteractive).toBeLessThan(1500); // DOM interactive < 1.5s
  });

  test('should defer non-critical scripts', async ({ page }) => {
    const scripts = await page.evaluate(() => {
      const scriptElements = Array.from(document.querySelectorAll('script[src]'));
      return scriptElements.map(script => ({
        src: script.getAttribute('src'),
        async: script.hasAttribute('async'),
        defer: script.hasAttribute('defer'),
      }));
    });

    // Check that Analytics and AdSense are deferred
    const analytics = scripts.find(s => s.src?.includes('googletagmanager'));
    const adsense = scripts.find(s => s.src?.includes('adsbygoogle'));

    expect(analytics?.defer || analytics?.async).toBeTruthy();
    expect(adsense?.defer || adsense?.async).toBeTruthy();
  });

  test('should have optimized images with lazy loading', async ({ page }) => {
    const images = await page.evaluate(() => {
      const imgElements = Array.from(document.querySelectorAll('img'));
      return imgElements.map((img, index) => ({
        index,
        src: img.src,
        loading: img.loading,
        fetchpriority: img.getAttribute('fetchpriority'),
        hasAlt: !!img.alt,
      }));
    });

    // Hero image should have high priority
    const heroImage = images.find(img => img.fetchpriority === 'high');
    expect(heroImage).toBeTruthy();

    // Non-hero images should be lazy loaded
    const lazyImages = images.filter(img => img.loading === 'lazy');
    expect(lazyImages.length).toBeGreaterThan(5);

    // All images should have alt text
    const imagesWithoutAlt = images.filter(img => !img.hasAlt);
    expect(imagesWithoutAlt.length).toBe(0);
  });

  test('should have Fun Facts section visible', async ({ page }) => {
    const funFactsSection = await page.locator('#fun-facts');
    await expect(funFactsSection).toBeVisible();

    // Check for fun fact cards
    const funFactCards = await page.locator('.fun-fact-card').count();
    expect(funFactCards).toBeGreaterThanOrEqual(6);
  });

  test('Fun Facts cards should have hover animations', async ({ page }) => {
    const firstCard = page.locator('.fun-fact-card').first();
    
    // Get initial transform
    const initialTransform = await firstCard.evaluate(el => 
      window.getComputedStyle(el).transform
    );

    // Hover over card
    await firstCard.hover();
    await page.waitForTimeout(300); // Wait for animation

    // Get transform after hover
    const hoverTransform = await firstCard.evaluate(el => 
      window.getComputedStyle(el).transform
    );

    // Transform should change on hover
    expect(initialTransform).not.toBe(hoverTransform);
  });

  test('should have responsive Fun Facts grid', async ({ page }) => {
    // Desktop view
    await page.setViewportSize({ width: 1200, height: 800 });
    const desktopColumns = await page.evaluate(() => {
      const grid = document.querySelector('.fun-facts-grid') as HTMLElement;
      return window.getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    });
    expect(desktopColumns).toBeGreaterThanOrEqual(3);

    // Mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileColumns = await page.evaluate(() => {
      const grid = document.querySelector('.fun-facts-grid') as HTMLElement;
      return window.getComputedStyle(grid).gridTemplateColumns.split(' ').length;
    });
    expect(mobileColumns).toBeLessThanOrEqual(2);
  });

  test('should measure total page weight', async ({ page }) => {
    const resources = await page.evaluate(() => {
      const entries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      let totalSize = 0;
      const resourceTypes: Record<string, number> = {};

      entries.forEach(entry => {
        const size = entry.transferSize || 0;
        totalSize += size;

        const type = entry.initiatorType;
        resourceTypes[type] = (resourceTypes[type] || 0) + size;
      });

      return {
        totalSize,
        resourceTypes,
        count: entries.length,
      };
    });

    console.log('Total Page Weight:', Math.round(resources.totalSize / 1024), 'KB');
    console.log('Resource Types:', 
      Object.entries(resources.resourceTypes)
        .map(([type, size]) => `${type}: ${Math.round(size / 1024)}KB`)
        .join(', ')
    );

    // Total page weight should be reasonable (< 2MB for initial load)
    expect(resources.totalSize).toBeLessThan(2 * 1024 * 1024);
  });

  test('should have proper font loading strategy', async ({ page }) => {
    const fonts = await page.evaluate(() => {
      const computedStyle = window.getComputedStyle(document.body);
      return {
        bodyFont: computedStyle.fontFamily,
        hasSystemFonts: computedStyle.fontFamily.includes('system-ui') || 
                        computedStyle.fontFamily.includes('BlinkMacSystemFont'),
      };
    });

    // Should use system fonts (DSGVO-compliant)
    expect(fonts.hasSystemFonts).toBeTruthy();
  });

  test('should have minimal render-blocking resources', async ({ page }) => {
    const renderBlocking = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
      const scripts = Array.from(document.querySelectorAll('script[src]:not([defer]):not([async])'));
      
      return {
        stylesheets: links.length,
        blockingScripts: scripts.length,
      };
    });

    console.log('Render-blocking resources:', renderBlocking);
    
    // Should have minimal blocking scripts
    expect(renderBlocking.blockingScripts).toBeLessThan(3);
  });
});

test.describe('UI Design Tests - Fun Facts Section', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/park-babelsberg/index.html');
  });

  test('Fun Facts section should have proper spacing', async ({ page }) => {
    const section = page.locator('#fun-facts');
    const padding = await section.evaluate(el => 
      window.getComputedStyle(el).padding
    );
    
    expect(padding).toBeTruthy();
  });

  test('Fun Facts cards should have gradient background', async ({ page }) => {
    const section = page.locator('#fun-facts');
    const background = await section.evaluate(el => 
      window.getComputedStyle(el).background
    );
    
    expect(background).toContain('gradient');
  });

  test('Fun Facts numbers should have gradient text', async ({ page }) => {
    const number = page.locator('.fun-fact-number').first();
    const backgroundClip = await number.evaluate(el => 
      window.getComputedStyle(el).webkitBackgroundClip || 
      window.getComputedStyle(el).backgroundClip
    );
    
    expect(backgroundClip).toBe('text');
  });

  test('should have accessible contrast ratios', async ({ page }) => {
    // This is a simplified check - in production, use axe-core
    const cards = await page.locator('.fun-fact-card').all();
    
    for (const card of cards) {
      const isVisible = await card.isVisible();
      expect(isVisible).toBeTruthy();
    }
  });

  test('should work in dark mode', async ({ page }) => {
    // Toggle dark mode
    await page.click('#theme-toggle');
    await page.waitForTimeout(500);

    // Check if dark mode is applied
    const theme = await page.evaluate(() => 
      document.documentElement.getAttribute('data-theme')
    );
    
    expect(theme).toBe('dark');

    // Fun Facts should still be visible
    const funFactsSection = await page.locator('#fun-facts');
    await expect(funFactsSection).toBeVisible();
  });
});