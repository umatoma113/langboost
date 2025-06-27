// lib/normalizeWord.ts
import nlp from 'compromise';

export function normalizeWord(word: string): string {
  const cleaned = word.toLowerCase().replace(/[.,!?;:()"']/g, '');
  const doc = nlp(cleaned);

  if (doc.verbs().length) return doc.verbs().toInfinitive().out('text');
  if (doc.nouns().length) return doc.nouns().toSingular().out('text');

  return doc.out('text');
}
