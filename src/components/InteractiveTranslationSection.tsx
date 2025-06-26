'use client';

import { useState, useEffect, useRef } from 'react';

type WordEntry = {
  word: string;
  meaning: string;
  wordId: number;
  isRegistered: boolean;
};

type SentencePair = {
  english: string;
  japanese: string;
};

type Props = {
  original: string;
  translation: string;
  wordList: WordEntry[];
  onRegister: (word: string, meaning: string) => void;
};

export default function InteractiveTranslationSection({
  original,
  translation,
  wordList,
  onRegister,
}: Props) {
  const [localWords, setLocalWords] = useState<WordEntry[]>(wordList);
  const [hoveredWord, setHoveredWord] = useState<WordEntry | null>(null);
  const [popupPos, setPopupPos] = useState<{ top: number; left: number } | null>(null);
  const [visible, setVisible] = useState<boolean[]>(
    Array(Math.min(original.length, translation.length)).fill(false)
  );

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const enSentences = original.split(/(?<=[.?!])\s+/);
  const jaSentences = translation.split(/(?<=[。！？])\s*/);

  const sentencePairs: SentencePair[] = enSentences.map((english, i) => ({
    english,
    japanese: jaSentences[i] ?? '',
  }));

  const toggle = (index: number) => {
    const copy = [...visible];
    copy[index] = !copy[index];
    setVisible(copy);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setHoveredWord(null);
        setPopupPos(null);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const handleWordMouseEnter = (
    word: WordEntry,
    event: React.MouseEvent<HTMLSpanElement>
  ) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    setHoveredWord(word);
    setPopupPos({
      top: rect.top + window.scrollY - 10,
      left: rect.left + window.scrollX,
    });
  };

  const handleWordMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredWord(null);
      setPopupPos(null);
    }, 200);
  };

  const handleRegister = async (word: WordEntry) => {
    await onRegister(word.word, word.meaning);
    setLocalWords(prev =>
      prev.map(w =>
        w.word === word.word ? { ...w, isRegistered: true } : w
      )
    );
    setHoveredWord({ ...word, isRegistered: true });
  };

  const highlightWords = (sentence: string) => {
    const regex = new RegExp(`\\b(${localWords.map(w => w.word).join('|')})\\b`, 'gi');
    const parts = sentence.split(regex);
    return parts.map((part, idx) => {
      const word = localWords.find(w => w.word.toLowerCase() === part.toLowerCase());
      return word ? (
        <span
          key={idx}
          className={`relative underline cursor-pointer ${
            word.isRegistered ? 'text-red-600' : 'text-blue-600'
          }`}
          onMouseEnter={(e) => handleWordMouseEnter(word, e)}
          onMouseLeave={handleWordMouseLeave}
        >
          {part}
          {hoveredWord?.word === word.word && popupPos && (
            <div
              className="absolute z-50 w-72 p-4 bg-white border border-gray-300 rounded shadow-lg text-sm transition-opacity duration-200"
              style={{
                top: '100%',
                left: '50%',
                transform: 'translateX(-50%)',
                marginTop: '0.5rem',
              }}
            >
              <div className="font-bold text-gray-900 mb-2">{word.word}</div>
              <div className="text-gray-700 mb-2">{word.meaning}</div>
              {word.isRegistered ? (
                <div className="text-red-500 text-xs font-semibold">✅ 登録済み</div>
              ) : (
                <button
                  onClick={() => handleRegister(word)}
                  className="text-xs px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  ＋ 単語を登録
                </button>
              )}
            </div>
          )}
        </span>
      ) : (
        <span key={idx}>{part}</span>
      );
    });
  };

  return (
    <section className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-6xl mx-auto relative">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">📘 英文と和訳（マウスオーバーで意味表示・登録）</h2>
      <ul className="space-y-4">
        {sentencePairs.map((pair, idx) => (
          <li key={idx}>
            <div className="text-gray-800 flex flex-wrap gap-1">{highlightWords(pair.english)}</div>
            <button
              onClick={() => toggle(idx)}
              className="text-blue-600 text-sm underline"
            >
              {visible[idx] ? '翻訳を隠す' : '翻訳を表示'}
            </button>
            {visible[idx] && <p className="mt-1 text-gray-700">{pair.japanese}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
