// src/components/Layouts/MyPage.tsx
'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { deleteWordAction } from '@/app/actions/deleteWord';

type Article = {
  id: number;
  title: string;
  createdAt: string;
};

type Word = {
  word: {
    id: number;
    word: string;
    meaning: string;
  };
};

type Quiz = {
  id: number;
  createdAt: string;
  quizTemplate: {
    question: string;
    word: {
      word: string;
    };
  };
};

type Props = {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
  };
  articles: Article[];
  words: Word[];
  quizzes: Quiz[];
};

export default function MyPageLayout({ user, articles, words, quizzes }: Props) {
  const [viewMode, setViewMode] = useState<'both' | 'articles' | 'words'>('both');
  const [userWords, setUserWords] = useState(words);

  const handleDelete = async (wordId: number) => {
    try {
      await deleteWordAction(wordId);
      setUserWords((prev) => prev.filter((entry) => entry.word.id !== wordId));
    } catch (error) {
      alert('削除に失敗しました');
    }
  };


  return (
    <>
      <Header showTopPage={true} showMyPage={false} />

      <main className="min-h-screen px-6 py-10 bg-gray-50 text-gray-800 space-y-8">
        <h1 className="text-2xl font-bold text-center">
          {user.name ?? 'あなた'}のマイページ
        </h1>

        {/* 表示切り替えボタン */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setViewMode('both')}
            className={`px-4 py-2 rounded border ${
              viewMode === 'both' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
            }`}
          >
            両方表示
          </button>
          <button
            onClick={() => setViewMode('articles')}
            className={`px-4 py-2 rounded border ${
              viewMode === 'articles' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
            }`}
          >
            記事のみ
          </button>
          <button
            onClick={() => setViewMode('words')}
            className={`px-4 py-2 rounded border ${
              viewMode === 'words' ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
            }`}
          >
            単語のみ
          </button>
        </div>

        {/* 記事と単語：左右並びまたは片方のみ */}
        <div
          className={`grid gap-6 ${
            viewMode === 'both' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
          }`}
        >
          {(viewMode === 'articles' || viewMode === 'both') && (
            <section className="bg-white p-4 rounded shadow w-full">
              <h2 className="text-lg font-bold mb-2">📰 登録記事</h2>
              <ul className="list-disc pl-5 space-y-1">
                {articles.map((article) => (
                  <li key={article.id}>{article.title}</li>
                ))}
              </ul>
            </section>
          )}

          {(viewMode === 'words' || viewMode === 'both') && (
            <section className="bg-white p-4 rounded shadow w-full">
              <h2 className="text-lg font-bold mb-2">📚 単語帳</h2>
              <ul className="list-disc pl-5 space-y-2">
                {userWords.map((entry, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>
                      {entry.word.word} - {entry.word.meaning}
                    </span>
                    <button
                      onClick={() => handleDelete(entry.word.id)}
                      className="ml-4 text-red-600 text-sm hover:underline"
                    >
                      削除
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>


        {/* クイズ履歴（下部固定） */}
        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2">📝 クイズ履歴</h2>
          <ul className="list-disc pl-5 space-y-1">
            {quizzes.map((quiz) => (
              <li key={quiz.id}>
                {new Date(quiz.createdAt).toLocaleDateString()} - {quiz.quizTemplate.word.word}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </>
  );
}
