const fs = require('fs');
const path = require('path');

// Supported languages
const SUPPORTED_LANGUAGES = ['en', 'hi', 'te', 'ta', 'kn', 'ml'];

// Cache for loaded translations
const translationCache = {};

/**
 * Load translation JSON for a given language
 * @param {string} language - Language code (en, hi, te, etc.)
 * @returns {object} Translation object
 */
function loadTranslation(language) {
  // Fallback to English if language not supported
  const lang = SUPPORTED_LANGUAGES.includes(language) ? language : 'en';

  // Return from cache if already loaded
  if (translationCache[lang]) {
    return translationCache[lang];
  }

  try {
    const filePath = path.join(__dirname, `../translations/${lang}.json`);
    const content = fs.readFileSync(filePath, 'utf-8');
    const translation = JSON.parse(content);
    translationCache[lang] = translation;
    return translation;
  } catch (error) {
    console.error(`Error loading translation for ${lang}:`, error.message);
    // Fallback to English
    if (lang !== 'en') {
      return loadTranslation('en');
    }
    return {};
  }
}

/**
 * Get translated string for a given key and language
 * @param {string} key - Translation key (e.g., 'COVERS_DISEASE')
 * @param {string} language - Language code (defaults to 'en')
 * @param {object} options - Optional replacements object (e.g., { state: 'Karnataka' })
 * @returns {string} Translated string or key name if not found
 */
function t(key, language = 'en', options = {}) {
  const translation = loadTranslation(language);
  let value = translation[key] || key;

  // Replace placeholders in curly braces with values from options
  if (options && typeof options === 'object') {
    Object.keys(options).forEach(placeholder => {
      value = value.replace(`{${placeholder}}`, options[placeholder]);
    });
  }

  return value;
}

/**
 * Validate language code
 * @param {string} language - Language code
 * @returns {boolean} True if supported, false otherwise
 */
function isSupported(language) {
  return SUPPORTED_LANGUAGES.includes(language);
}

/**
 * Get default language if not supported
 * @param {string} language - Language code
 * @returns {string} Valid language code (fallback to 'en' if not supported)
 */
function getValidLanguage(language) {
  return isSupported(language) ? language : 'en';
}

module.exports = {
  t,
  isSupported,
  getValidLanguage,
  SUPPORTED_LANGUAGES
};
