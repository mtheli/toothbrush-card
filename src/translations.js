import en from './locales/en.json';
import de from './locales/de.json';
import nl from './locales/nl.json';
import ru from './locales/ru.json';
import da from './locales/da.json';
import sl from './locales/sl.json';
import es from './locales/es.json';

const LOCALES = { en, de, nl, ru, da, sl, es };

export function t(hass, key) {
  const lang = hass?.language || 'en';
  const locale = LOCALES[lang] || LOCALES.en;
  return locale[key] || LOCALES.en[key] || key;
}
