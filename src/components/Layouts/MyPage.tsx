'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const mockArticles = [
  { id: 1, title: 'Climate change is affecting ecosystems...' },
  { id: 2, title: 'AI is transforming the job market...' },
];

const mockWords = [
  { word: 'ecosystem', meaning: '生態系' },
  { word: 'innovation', meaning: '革新' },
];

export default function MyPage() {
  const router = useRouter();
  const [visibleMeanings, setVisibleMeanings] = useState<{ [word: string]: boolean }>({});

  const toggleMeaning = (word: string) => {
    setVisibleMeanings((prev) => ({
      ...prev,
      [word]: !prev[word],
    }));
  };

  return (
    <main className="min-h-screen bg-white px-4 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">マイページ（仮ユーザー名）</h2>

      {/* 左右カラム：記事が左 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 記事履歴（左） */}
        <section className="order-1">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">記事履歴</h3>
          <ul className="space-y-3">
            {mockArticles.map((article) => (
              <li key={article.id} className="flex items-center justify-between border p-3 rounded shadow-sm">
                <span className="text-gray-800">{article.title}</span>
                <button
                  onClick={() => router.push(`/summary?articleId=${article.id}`)}
                  className="text-sm text-blue-600 underline hover:text-blue-800"
                >
                  記事へ
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* マイ単語帳（右） */}
        <section className="order-2">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">マイ単語帳</h3>
          <ul className="space-y-3 mb-4">
            {mockWords.map((item, index) => (
              <li key={index} className="border p-3 rounded bg-gray-50 text-gray-800 flex justify-between items-center">
                <div>
                  <strong>{item.word}</strong>
                  {visibleMeanings[item.word] && <span className="ml-2 text-gray-600">（{item.meaning}）</span>}
                </div>
                <button
                  onClick={() => toggleMeaning(item.word)}
                  className="text-sm text-blue-600 underline hover:text-blue-800"
                >
                  {visibleMeanings[item.word] ? '非表示' : '意味を見る'}
                </button>
              </li>
            ))}
          </ul>
          <div className="text-right">
            <button
              onClick={() => router.push('/wordquiz')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              マイ単語帳クイズへ
            </button>
          </div>
        </section>
      </div>

      {/* クイズ履歴セクション */}
      <section className="mt-12">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">クイズ履歴</h3>
        <p className="text-gray-500">※ この機能は今後追加予定です。</p>
      </section>
    </main>
  );
}
