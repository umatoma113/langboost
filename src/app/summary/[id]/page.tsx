// src/app/summary/[id]/page.tsx
import QuizSection from '@/components/QuizSection';
import TranslationSection from '@/components/TranslationSection';
import WordList from '@/components/WordList';
import { getArticleById } from '@/services/article';
import { notFound } from 'next/navigation';
import TopPageButtons from '@/components/TopPageButtons';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  if (!id || typeof id !== 'string' || isNaN(Number(id))) {
    return notFound();
  }

  const articleId = Number(id);
  const article = await getArticleById(articleId);
  if (!article) return notFound();

  return (
    <>
      <TopPageButtons />
      <main className="min-h-screen bg-white px-6 py-10 space-y-10">
        <h1 className="text-3xl font-bold text-center">翻訳・要約ページ</h1>

        {/* 要約 */}
        <section className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">📝 要約</h2>
          <p className="whitespace-pre-wrap text-gray-800">{article.summary}</p>
        </section>

        {/* 単語一覧 */}
        {article.words.length === 0 ? (
          <p className="text-gray-600 text-center">単語が見つかりませんでした。</p>
        ) : (
          <WordList words={article.words} />
        )}

        {/* 和訳 */}
        <TranslationSection
          original={article.content}
          translation={article.translation ?? ''}
        />

        {/* クイズ */}
        {article.quiz && <QuizSection quiz={article.quiz} />}
      </main>
    </>
  );
}
