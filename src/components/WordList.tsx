//src/components/WordList.tsx
'use client';

import { useState } from 'react';
import { registerWordAction } from '@/app/actions/registerWord';

type Word = {
  word: string;
  meaning: string;
};

type Props = {
  words: Word[];
};

export default function WordList({ words }: Props) {
  const [registered, setRegistered] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);

  const handleRegister = async (word: string, meaning: string) => {
    const res = await registerWordAction(word, meaning);
    if (res.success || res.alreadyRegistered) {
      setRegistered(prev => [...prev, word]);
    }
  };

  const visibleWords = showAll ? words : words.slice(0, 5);

  return (
    <div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-gray-800 max-h-[300px] overflow-y-auto">
        {visibleWords.map((wordObj, index) => (
          <li key={index} className="border p-3 rounded bg-white shadow-sm space-y-1">
            <div>
              <span className="font-semibold">{wordObj.word}</span>：{wordObj.meaning}
            </div>
            {registered.includes(wordObj.word) ? (
              <span className="text-sm text-green-600">✅ 登録済み</span>
            ) : (
              <button
                onClick={() => handleRegister(wordObj.word, wordObj.meaning)}
                className="text-sm text-blue-600 underline"
              >
                登録
              </button>
            )}
          </li>
        ))}
      </ul>

      {!showAll && words.length > 5 && (
        <div className="text-center mt-4">
          <button
            onClick={() => setShowAll(true)}
            className="text-blue-600 underline text-sm"
          >
            もっと見る
          </button>
        </div>
      )}
    </div>
  );
}

