'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { useSearchParams } from 'next/navigation';

export default function SummaryLayout() {
  const searchParams = useSearchParams();
  const articleId = searchParams.get('articleId');

  const [showQuiz, setShowQuiz] = useState(false);
  const [showTranslation, setShowTranslation] = useState<{ [index: number]: boolean }>({});
  const [savedWords, setSavedWords] = useState<string[]>([]);

  const title = '気候変動と持続可能な未来';
  const summary = 'この記事では、気候変動の影響と持続可能な社会の構築に向けた取り組みについて述べています。';
  const words = [
    { word: 'ecosystem', meaning: '生態系' },
    { word: 'emission', meaning: '排出' },
    { word: 'innovation', meaning: '革新' },
    { word: 'sustainable', meaning: '持続可能な' },
    { word: 'renewable', meaning: '再生可能な' },
  ];
  const translations = [
    {
      en: 'Climate change is affecting ecosystems around the world.',
      ja: '気候変動は世界中の生態系に影響を与えています。',
    },
    {
      en: 'Governments are taking actions to reduce carbon emissions.',
      ja: '政府は炭素排出を減らすために行動しています。',
    },
    {
      en: 'Innovations in renewable energy play a vital role.',
      ja: '再生可能エネルギーの革新は重要な役割を果たします。',
    },
  ];

  const toggleTranslation = (index: number) => {
    setShowTranslation((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleWordRightClick = (e: React.MouseEvent, word: string) => {
    e.preventDefault();
    setSavedWords((prev) => (prev.includes(word) ? prev : [...prev, word]));
    alert(`\"${word}\" をマイ単語帳に登録しました。`);
  };

  return (
    <>
      <Header showTopPage showMyPage />
      <main className="min-h-screen bg-white px-4 py-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">翻訳・要約ページ</h2>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-700 mb-6">{summary}</p>

        <div className="bg-yellow-50 border border-gray-300 rounded p-4 mb-8">
          <h4 className="text-center font-semibold text-gray-700 mb-2">単語一覧</h4>
          <p className="text-center text-sm text-gray-700">
            {words.map((item, i) => (
              <span
                key={i}
                className="cursor-pointer hover:underline"
                onContextMenu={(e) => handleWordRightClick(e, item.word)}
              >
                ・{item.word}：{item.meaning}　
              </span>
            ))}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-gray-50 border rounded p-4">
            <h4 className="font-semibold text-gray-800 mb-4">原文と和訳</h4>
            <ul className="space-y-4">
              {translations.map((item, index) => (
                <li key={index}>
                  <p className="text-gray-900">{index + 1}. {item.en}</p>
                  {showTranslation[index] && (
                    <p className="text-gray-600">　{item.ja}</p>
                  )}
                  <button
                    onClick={() => toggleTranslation(index)}
                    className="text-sm text-blue-600 underline hover:text-blue-800 mt-1"
                  >
                    {showTranslation[index] ? '和訳を隠す' : '和訳を見る'}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {showQuiz && (
            <div className="bg-blue-50 border rounded p-4">
              <h4 className="font-semibold text-gray-800 mb-4">クイズ</h4>
              <ul className="space-y-2">
                <li>① ~~~~~~</li>
                <li>② ------</li>
                <li>③ ??????</li>
              </ul>
            </div>
          )}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => setShowQuiz(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            記事クイズ
          </button>
        </div>
      </main>
    </>
  );
}
