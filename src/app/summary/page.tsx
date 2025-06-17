//src/app/summary/[id]/page.tsx
'use client';

import Header from '@/components/Header';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Word = {
  word: string;
  meaning: string;
};

export default function SummaryPage() {
  const searchParams = useSearchParams();
  const [summary, setSummary] = useState('');
  const [translation, setTranslation] = useState('');
  const [words, setWords] = useState<Word[]>([]);

  useEffect(() => {
    const summaryParam = searchParams.get('summary');
    const translationParam = searchParams.get('translation');
    const wordsParam = searchParams.get('words');

    if (summaryParam) {
      setSummary(decodeURIComponent(summaryParam));
    }

    if (translationParam) {
      setTranslation(decodeURIComponent(translationParam));
    }

    if (wordsParam) {
      try {
        const parsedWords = JSON.parse(decodeURIComponent(wordsParam));
        setWords(parsedWords);
      } catch (e) {
        console.error('単語データの解析に失敗しました:', e);
      }
    }
  }, [searchParams]);

  return (
    <>
      <Header showTopPage={true} showMyPage={true} />
    <main className="min-h-screen bg-white px-6 py-10 space-y-10">
      {/* タイトル */}
      <h1 className="text-3xl font-bold text-center">翻訳・要約ページ</h1>

      {/* 要約セクション（最上部・横長） */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-6xl mx-auto">
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">📝 要約</h2>
          <p className="whitespace-pre-wrap text-gray-800">{summary}</p>
        </section>
      </div>

      {/* 単語一覧（中央） */}
      <div className="bg-yellow-50 border border-gray-300 rounded-lg p-6 max-w-6xl mx-auto">
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">📚 抽出された単語</h2>
          {words.length === 0 ? (
            <p className="text-gray-600 text-center">単語が見つかりませんでした。</p>
          ) : (
            <ul className="list-disc ml-5 space-y-2 text-gray-800">
              {words.map((word, index) => (
                <li key={index}>
                  <span className="font-semibold">{word.word}</span>：{word.meaning}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* 和訳セクション（最下部・横長） */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-6xl mx-auto">
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">📖 和訳</h2>
          <p className="whitespace-pre-wrap text-gray-800">{translation}</p>
        </section>
      </div>
    </main>
    </>
  );
}
