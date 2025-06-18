'use client';

import { useState } from 'react';

type SentencePair = {
  english: string;
  japanese: string;
};

type Props = {
  translation: string; // 英文翻訳（全体）
  original: string; // 英文原文（全体）
};

export default function TranslationSection({ translation, original }: Props) {
  const enSentences = original.split(/(?<=[.?!])\s+/);
  const jaSentences = translation.split(/(?<=[。！？])\s*/);

  const count = Math.min(enSentences.length, jaSentences.length);
  const sentencePairs: SentencePair[] = Array.from({ length: count }, (_, i) => ({
    english: enSentences[i],
    japanese: jaSentences[i],
  }));

  const [visible, setVisible] = useState<boolean[]>(Array(count).fill(false));

  const toggle = (index: number) => {
    const copy = [...visible];
    copy[index] = !copy[index];
    setVisible(copy);
  };

  return (
    <section className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">📖 和訳</h2>
      <ul className="space-y-4">
        {sentencePairs.map((pair, idx) => (
          <li key={idx}>
            <p className="text-gray-800">{pair.english}</p>
            <button
              onClick={() => toggle(idx)}
              className="text-blue-600 text-sm underline"
            >
              {visible[idx] ? '翻訳を隠す' : '翻訳を表示'}
            </button>
            {visible[idx] && (
              <p className="mt-1 text-gray-700">{pair.japanese}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
