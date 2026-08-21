// Pure text helpers shared across the app.

// Lowercases and strips diacritics so searches match regardless of accents
// and case (e.g. "copa" matches "Copa do Brasil" and "Copa do Brasil").
export function normalizeText(text) {
  return String(text)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
