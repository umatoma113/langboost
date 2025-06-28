// lib/normalizeWord.ts
import nlp from 'compromise';

export function normalizeWord(word: string): string {
  const cleaned = word.toLowerCase().replace(/[.,!?;:()"']+$/g, ''); // ← 語尾記号のみ除去
  const doc = nlp(cleaned);

  if (doc.verbs().length) return doc.verbs().toInfinitive().out('text');
  if (doc.nouns().length) return doc.nouns().toSingular().out('text');

  const result = doc.out('text');
  return result || cleaned; // ← 最後にcleanedをfallbackとして返す
}
