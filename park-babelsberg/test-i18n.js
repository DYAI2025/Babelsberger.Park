const fs = require('fs');
const de = JSON.parse(fs.readFileSync('./assets/translations/de.json'));
const i18n = {
  currentLang: 'de',
  translations: { de: de, en: {} },
  fallbackLang: 'de',
  t(keyPath) {
    const keys = keyPath.split('.');
    let value = this.translations[this.currentLang];

    for (const key of keys) {
      if (value && typeof value === 'object') {
        value = value[key];
      } else {
        // Fallback to German if key not found
        value = this.translations[this.fallbackLang];
        for (const k of keys) {
          if (value && typeof value === 'object') {
            value = value[k];
          } else {
            return keyPath;
          }
        }
        break;
      }
    }

    return value || keyPath;
  }
};
console.log(i18n.t('parks.neuergarten.name'));
