import en from './locales/en.json';
import de from './locales/de.json';

const LOCALES = { en, de };

export function t(hass, key) {
  const lang = hass?.language || 'en';
  const locale = LOCALES[lang] || LOCALES.en;
  return locale[key] || LOCALES.en[key] || key;
}
