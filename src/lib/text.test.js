import { describe, expect, test } from 'vitest';
import { normalizeText } from './text';

describe('normalizeText', () => {
  test('lowercases and strips accents', () => {
    expect(normalizeText('Copa do Brasil')).toBe('copa do brasil');
    expect(normalizeText('Libertadores')).toBe('libertadores');
    expect(normalizeText('TIMÃO')).toBe('timao');
  });
});
