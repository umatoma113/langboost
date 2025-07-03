// src/components/Layouts/MyPage.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { deleteWordAction } from '@/app/actions/deleteWord';
import { deleteArticleAction } from '@/app/actions/deleteArticleAction';
import { format } from 'date-fns';

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
  executedAt: string;
  isCorrect: boolean;
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
  const [userArticles, setUserArticles] = useState(articles);
  const [userWords, setUserWords] = useState(words);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const sortedQuizzes = [...quizzes].sort(
    (a, b) => new Date(b.executedAt).getTime() - new Date(a.executedAt).getTime()
  );
  const paginated = sortedQuizzes.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(sortedQuizzes.length / ITEMS_PER_PAGE);

  const handleWordDelete = async (wordId: number) => {
    try {
      await deleteWordAction(wordId);
      setUserWords((prev) => prev.filter((entry) => entry.word.id !== wordId));
    } catch {
      alert('削除に失敗しました');
    }
  };

  const handleArticleDelete = async (articleId: number) => {
    if (!confirm('この記事を削除しますか？')) return;
    try {
      await deleteArticleAction(articleId);
      setUserArticles((prev) => prev.filter((a) => a.id !== articleId));
    } catch {
      alert('記事の削除に失敗しました');
    }
  };

  return (
    <>
      <Header showTopPage={true} showMyPage={false} />

      <main className="flex-grow px-6 py-10 bg-gradient-to-b from-white via-green-50 to-green-50 text-gray-800 space-y-10">

        {/* ✅ プロフィール */}
        <section className="p-4 text-center">
          <h2 className="text-xl font-semibold mb-1">ようこそ、{user.name ?? 'ユーザー'} さん!!!</h2>
          {user.email && <p className="text-sm text-gray-500">{user.email}</p>}
        </section>

        {/* ✅ 表示切り替え */}
        <div className="flex justify-center space-x-4">
          {(['both', 'articles', 'words'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2 rounded border ${viewMode === mode ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'}`}
            >
              {mode === 'both' ? '両方表示' : mode === 'articles' ? '記事のみ' : '単語のみ'}
            </button>
          ))}
        </div>

        {/* ✅ 記事・単語帳（6:4レイアウト） */}
        <div
          className={`grid gap-6 ${viewMode === 'both'
              ? 'grid-cols-[3fr_2fr]' // ← 6:4 表示
              : 'grid-cols-1'
            }`}
        >
          {(viewMode === 'articles' || viewMode === 'both') && (
            <section className="bg-white p-4 rounded shadow w-full">
              <h2 className="text-lg font-bold mb-2">📰 登録記事</h2>
              {userArticles.length === 0 ? (
                <p className="text-sm text-gray-500">まだ記事が登録されていません。</p>
              ) : (
                <ul className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                  {userArticles.map((article) => (
                    <li key={article.id} className="flex justify-between items-center border-b pb-2">
                      <span className="truncate">{article.title}</span>
                      <div className="flex space-x-2">
                        <Link href={`/summary/${article.id}`}>
                          <button className="flex-shrink-0 w-16 px-3 py-1 text-sm text-white bg-blue-600 hover:bg-red-700 rounded shadow">
                            開く
                          </button>
                        </Link>
                        <button
                          onClick={() => handleArticleDelete(article.id)}
                          className="flex-shrink-0 w-16 px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded shadow"
                        >
                          削除
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {(viewMode === 'words' || viewMode === 'both') && (
            <section className="bg-white p-4 rounded shadow w-full">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-bold">📚 単語帳</h2>
                <Link href="/quiz">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded shadow">
                    クイズを始める
                  </button>
                </Link>
              </div>
              {userWords.length === 0 ? (
                <p className="text-sm text-gray-500">単語がまだ登録されていません。</p>
              ) : (
                <ul className="list-disc pl-5 space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                  {userWords.map((entry, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span>{entry.word.word} - {entry.word.meaning}</span>
                      <button
                        onClick={() => handleWordDelete(entry.word.id)}
                        className="flex-shrink-0 w-14 px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-700 rounded shadow"
                      >
                        削除
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>

        {/* ✅ クイズ履歴 */}
        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-bold mb-2">📝 クイズ履歴</h2>
          {sortedQuizzes.length === 0 ? (
            <p className="text-sm text-gray-500">まだクイズ履歴がありません。</p>
          ) : (
            <>
              <ul className="divide-y divide-gray-200">
                {paginated.map((quiz) => (
                  <li key={quiz.id} className="py-2 flex justify-between items-center text-sm">
                    <div>
                      <span className="text-gray-500">{format(new Date(quiz.executedAt), 'yyyy/MM/dd')}：</span>{' '}
                      <strong>{quiz.quizTemplate.word.word}</strong> — {quiz.quizTemplate.question}
                    </div>
                    <span className={`font-semibold ${quiz.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {quiz.isCorrect ? '正解' : '不正解'}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex justify-center items-center space-x-4">
                <button
                  onClick={() => setPage((prev) => prev - 1)}
                  disabled={page === 1}
                  className={`px-3 py-1 rounded border ${page === 1 ? 'text-gray-400 border-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                >
                  前へ
                </button>
                <span className="text-sm text-gray-600">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={page === totalPages}
                  className={`px-3 py-1 rounded border ${page === totalPages ? 'text-gray-400 border-gray-300 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                >
                  次へ
                </button>
              </div>
            </>
          )}
        </section>
      </main>
    </>
  );
}

