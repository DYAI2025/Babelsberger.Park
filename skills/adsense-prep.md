# AdSense Preparation & Compliance Skill

## When to Use
- Preparing a website for Google AdSense production approval.
- Auditing existing AdSense integrations for GDPR/CPRA compliance.
- Fixing "Website could not be verified" errors from Google.
- Optimizing Ad performance and Core Web Vitals (CLS).

## Key Concepts

### 1. Crawler Verification
Google's crawler must find specific markers in the HTML. 
- **Meta Tag**: `<meta name="google-adsense-account" content="ca-pub-XXXXXXXXXXXXXXXX">`
- **Script Tag**: A hardcoded script in the `<head>` of core pages (root `index.html`) is often required for the initial validation, even if dynamic loading is used later.

### 2. GDPR/CMP Compliance
Ads must not load until the user grants consent.
- **Consent Mode v2**: Integration with `cookie-consent.js` or similar managers.
- **Dynamic Loading**: Use `document.createElement('script')` inside consent callbacks instead of static HTML tags on subpages.

### 3. authorized Digital Sellers (ads.txt)
The `ads.txt` file must be in the root directory.
- Format: `google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0`
- Ensure no `ca-` prefix is used in the `ads.txt` file (unlike the HTML tags).

### 4. Slot Standardization
Avoid hardcoding numeric Slot IDs in every HTML file.
- Use **Logical Names** (e.g., `BABELSB_TOP_1`) in the `data-ad-slot` attribute.
- Map these to numeric IDs in a centralized `ad-config.js` file.

## Examples

### Example 1: Compliant Ad Unit (HTML)
```html
<!-- Logical name used, CSS class for CLS prevention -->
<div class="ad-container">
  <ins class="adsbygoogle"
       style="display:block"
       data-ad-client="ca-pub-1712273263687132"
       data-ad-slot="TOP_HEADER_SLOT"
       data-ad-format="auto"
       data-full-width-responsive="true"></ins>
</div>
```

### Example 2: CLS Prevention (CSS)
```css
ins.adsbygoogle {
  display: block;
  background: rgba(0,0,0,0.05);
  min-height: 100px; /* Prevents layout jump */
  margin: 1rem 0;
  overflow: hidden;
}
```

## Best Practices
- **Verify Root First**: Google checks the root `index.html` first. Ensure it's a full page (not a redirect) with the verification script.
- **Cross-Origin**: Always include `crossorigin="anonymous"` on the loader script.
- **Async Loading**: Use the `async` attribute to prevent blocking the main thread.
- **Sitemap Sync**: Ensure `sitemap.xml` contains the actual final paths to help the crawler find legal disclosures.

## Common Patterns
### Centralized Mapping (ad-config.js)
```javascript
const SLOT_MAP = {
  'TOP_HEADER_SLOT': '1234567890',
  'ARTICLE_SLOT': '0987654321'
};

function initAds() {
  document.querySelectorAll('ins.adsbygoogle').forEach(ins => {
    const logical = ins.getAttribute('data-ad-slot');
    if (SLOT_MAP[logical]) {
      ins.setAttribute('data-ad-slot', SLOT_MAP[logical]);
      (adsbygoogle = window.adsbygoogle || []).push({});
    }
  });
}
```

## Troubleshooting
| Issue | Solution |
|-------|----------|
| Crawler Error: No code found | Add hardcoded script tag to `<head>` of root index.html. |
| ads.txt not found | Ensure it's in the web root, not a subdirectory. |
| Large Layout Shifts | Add `min-height` to the `ins` or parent container. |
| Ads not showing in EU | Check if `cookie-consent.js` is correctly triggering `loadGoogleAdSense()`. |
