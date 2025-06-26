// src/app/summary/[id]/page.tsx

import QuizSection from '@/components/QuizSection';
import TopPageButtons from '@/components/TopPageButtons';
import InteractiveTranslationSection from '@/components/InteractiveTranslationSection';
import { getArticleById } from '@/services/article';
import { getMyRegisteredWordIds } from '@/services/user/getMyRegisteredWordIds';
import { auth } from '../../../../lib/auth';
import { notFound } from 'next/navigation';
import { registerWordAction } from '@/app/actions/registerWord';


export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id || isNaN(Number(id))) {
    return notFound();
  }

  const articleId = Number(id);
  const article = await getArticleById(articleId);
  if (!article) return notFound();

  const user = await auth();
  const userId = user?.id;
  const registeredIds = userId ? await getMyRegisteredWordIds(userId) : [];

  const wordList = (article.words as { id: number; word: string; meaning: string }[]).map(w => ({
    word: w.word,
    meaning: w.meaning,
    wordId: w.id,
    isRegistered: registeredIds.includes(w.id),
  }));

  return (
    <>
      <TopPageButtons />
      <main className="min-h-screen bg-white px-6 py-10 space-y-10">
        <h1 className="text-3xl font-bold text-center text-gray-900">翻訳・要約ページ</h1>

        {/* 要約 */}
        <section className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">📝 要約</h2>
          <p className="whitespace-pre-wrap text-gray-800">{article.summary}</p>
        </section>

        {/* 英文＋対訳＋単語クリック対応 */}
        <InteractiveTranslationSection
          original={article.content}
          translation={article.translation ?? ''}
          wordList={wordList}
          onRegister={async (word, meaning) => {
            'use server';
            await registerWordAction(word, meaning);
          }}
        />


        {/* クイズ */}
        {article.quiz && <QuizSection quiz={article.quiz} />}
      </main>
    </>
  );
}
