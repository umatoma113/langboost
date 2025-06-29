// lib/normalizeWordWithCache.ts
import { normalizeWord } from './normalizeWord';

const cache = new Map<string, string>();

export function normalizeWordWithCache(word: string): string {
  if (cache.has(word)) return cache.get(word)!;
  const normalized = normalizeWord(word);
  cache.set(word, normalized);
  return normalized;
}
