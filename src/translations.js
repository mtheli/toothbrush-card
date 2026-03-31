import en from './locales/en.json';
import de from './locales/de.json';
import nl from './locales/nl.json';

const LOCALES = { en, de, nl };

export function t(hass, key) {
  const lang = hass?.language || 'en';
  const locale = LOCALES[lang] || LOCALES.en;
  return locale[key] || LOCALES.en[key] || key;
}
