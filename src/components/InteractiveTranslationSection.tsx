// src/components/InteractiveTranslationSection.tsx
// ✅ 修正済み: InteractiveTranslationSection.tsx
'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { normalizeWordWithCache } from '../../lib/normalizeWordWithCache';

const excludedWords = new Set([
  'a', 'an', 'the', 'and', 'but', 'or', 'so', 'to', 'of', 'in', 'on', 'at',
  'by', 'for', 'with', 'as', 'from', 'that', 'which', 'who', 'whose', 'whom',
  'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being',
  'do', 'does', 'did', 'will', 'would', 'can', 'could', 'should', 'may', 'might', 'must', 'shall',
  'he', 'she', 'it', 'they', 'this', 'that', 'these', 'those', 'we', 'you', 'i',
  'her', 'him', 'his', 'them', 'their', 'ours', 'your', 'my', 'mine', 'its',
  'ourselves', 'themselves', 'yourself', 'hers', 'himself'
]);

type WordEntry = {
  word: string;
  meaning: string;
  wordId?: number;
  isRegistered: boolean;
};

type SentencePair = {
  english: string;
  japanese: string;
};

type Props = {
  sentencePairs: SentencePair[];
  wordList: WordEntry[];
  onRegister: (word: string, meaning: string) => void;
};

export default function InteractiveTranslationSection({
  sentencePairs,
  wordList,
  onRegister,
}: Props) {
  const [popupTargetKey, setPopupTargetKey] = useState<string | null>(null);
  const [popupWord, setPopupWord] = useState<string | null>(null);
  const [popupMeaning, setPopupMeaning] = useState<string | null>(null);
  const [localWords, setLocalWords] = useState<WordEntry[]>(wordList);
  const [isFetching, setIsFetching] = useState(false);
  const [visible, setVisible] = useState<boolean[]>(
    Array(sentencePairs.length).fill(false)
  );

  const toggle = (index: number) => {
    setVisible((prev) => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  const meaningMap = useMemo(() => {
    const map = new Map<string, WordEntry>();
    for (const entry of localWords) {
      map.set(normalizeWordWithCache(entry.word), entry);
    }
    return map;
  }, [localWords]);

  const handleRegister = async () => {
    if (!popupWord || !popupMeaning || popupMeaning === '意味未登録') return;
    await onRegister(popupWord, popupMeaning);

    const normalized = normalizeWordWithCache(popupWord);
    setLocalWords((prev) =>
      prev.map((w) =>
        normalizeWordWithCache(w.word) === normalized
          ? { ...w, isRegistered: true }
          : w
      )
    );
    setPopupTargetKey(null);
  };

  const handleFetchMeaning = async () => {
    if (!popupWord) return;
    const normalized = normalizeWordWithCache(popupWord);
    setIsFetching(true);
    try {
      const res = await fetch('/api/fetchMeaning', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseWord: normalized }),
      });

      const data = await res.json();
      if (data.meaning) {
        setPopupMeaning(data.meaning);
        setLocalWords((prev) =>
          prev.map((w) =>
            normalizeWordWithCache(w.word) === normalized
              ? { ...w, meaning: data.meaning }
              : w
          )
        );
      }
    } catch (err) {
      console.error('意味取得エラー:', err);
    } finally {
      setIsFetching(false);
    }
  };

  const highlightWords = (sentence: string, sentenceIndex: number) => {
    const words = sentence.split(/(\s+)/);
    return words.map((part, idx) => {
      const trimmed = part.trim();
      if (!trimmed) return <span key={idx}>{part}</span>;

      const normalized = normalizeWordWithCache(trimmed);
      const wordKey = `${sentenceIndex}-${normalized}-${idx}`;

      if (excludedWords.has(normalized)) {
        return (
          <span key={wordKey} className="text-black">
            {part}
          </span>
        );
      }

      const wordEntry = meaningMap.get(normalized);
      const isRegistered = wordEntry?.isRegistered ?? false;
      const meaning = wordEntry?.meaning ?? '意味未登録';
      const isPopupOpen = popupTargetKey === wordKey;

      return (
        <span key={wordKey} className="relative inline-block">
          <span
            className={`underline cursor-pointer transition-colors duration-150 ${isRegistered ? 'text-blue-600' : 'text-gray-800'}`}
            onClick={() => {
              setPopupTargetKey(wordKey);
              setPopupWord(trimmed);
              setPopupMeaning(meaning);
            }}
          >
            {part}
          </span>

          {isPopupOpen && (
            <div className="absolute z-50 w-72 p-4 bg-white border border-gray-300 rounded shadow-lg text-sm mt-1">
              <div className="font-bold text-gray-900 mb-2">{popupWord}</div>
              <div className="text-gray-700 mb-2">{popupMeaning}</div>

              {isRegistered ? (
                <div className="text-blue-600 text-xs font-semibold">✅ 登録済み</div>
              ) : popupMeaning === '意味未登録' ? (
                <button
                  onClick={handleFetchMeaning}
                  className="text-xs px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
                  disabled={isFetching}
                >
                  {isFetching ? '取得中...' : '🔍 意味を取得'}
                </button>
              ) : (
                <button
                  onClick={handleRegister}
                  className="text-xs px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  ＋ 単語を登録
                </button>
              )}

              <button
                onClick={() => setPopupTargetKey(null)}
                className="absolute top-1 right-2 text-gray-400 hover:text-gray-600 text-xs"
              >
                ×
              </button>
            </div>
          )}
        </span>
      );
    });
  };

  const latestPairsRef = useRef(sentencePairs);
const articleIdRef = useRef<number | null>(null); // 初期は null

useEffect(() => {
  latestPairsRef.current = sentencePairs;
}, [sentencePairs]);

useEffect(() => {
  if (typeof window === 'undefined') return;

  // articleId をクライアントで取得
  const id = Number(window.location.pathname.split('/').pop());
  if (!isNaN(id)) {
    articleIdRef.current = id;
  }

  const handleSave = () => {
    if (articleIdRef.current === null) return;

    const payload = {
      articleId: articleIdRef.current,
      sentencePairs: latestPairsRef.current,
    };

    console.log("💾 AutoSave payload:", payload);
    navigator.sendBeacon('/api/saveSummary', JSON.stringify(payload));
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      handleSave();
    }
  };

  window.addEventListener('beforeunload', handleSave);
  window.addEventListener('pagehide', handleSave);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    window.removeEventListener('beforeunload', handleSave);
    window.removeEventListener('pagehide', handleSave);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}, []);


  return (
    <section className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-6xl mx-auto relative">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        📘 英文と和訳（クリックで意味表示・登録）
      </h2>
      <ul className="space-y-4">
        {sentencePairs.map((pair, idx) => (
          <li key={idx}>
            <div className="text-gray-800 flex flex-wrap gap-1">
              {highlightWords(pair.english, idx)}
            </div>
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
