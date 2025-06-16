//src/app/summary/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

type Word = {
  word: string;
  meaning: string;
};

export default function SummaryPage() {
  const searchParams = useSearchParams();
  const [summary, setSummary] = useState('');
  const [words, setWords] = useState<Word[]>([]);

  useEffect(() => {
    const summaryParam = searchParams.get('summary');
    const wordsParam = searchParams.get('words');

    if (summaryParam) {
      setSummary(decodeURIComponent(summaryParam));
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
    <main className="min-h-screen bg-white px-6 py-10 space-y-10">
      {/* SVGのタイトル位置に対応 */}
      <h1 className="text-3xl font-bold text-center">翻訳・要約ページ</h1>

      {/* 記事タイトル枠 */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-bold text-gray-800 mb-2">記事タイトル</h2>
      </div>

      {/* 要約部分：既存構造に枠と背景のみ追加 */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-4xl mx-auto">
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">📝 要約</h2>
          <p className="whitespace-pre-wrap text-gray-800">{summary}</p>
        </section>
      </div>

      {/* 単語一覧：横長枠スタイル */}
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
    </main>
  );
}
