const i18n = {
  currentLang: 'de',
  translations: { de: { test: "OK" }, en: {} },
  fallbackLang: 'de',
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
  }
};
console.log(i18n.t('test')); // OK
console.log(i18n.t('missing')); // null
console.log(i18n.t('missing.path')); // null
i18n.translations = {}; // Simulate fetch failure
console.log(i18n.t('test')); // null
