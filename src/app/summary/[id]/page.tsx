// src/app/summary/[id]/page.tsx
import { getArticleById } from '@/services/article';
import { notFound } from 'next/navigation';

export default async function SummaryPage({ params }: { params: { id: string } }) {
  const articleId = Number(params.id);
  const article = await getArticleById(articleId);
  if (!article) return notFound();

  return (
    <main className="min-h-screen bg-white px-6 py-10 space-y-10">
      {/* タイトル */}
      <h1 className="text-3xl font-bold text-center">翻訳・要約ページ</h1>

      {/* 要約セクション */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-6xl mx-auto">
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">📝 要約</h2>
          <p className="whitespace-pre-wrap text-gray-800">{article.summary}</p>
        </section>
      </div>

      {/* 単語一覧 */}
      <div className="bg-yellow-50 border border-gray-300 rounded-lg p-6 max-w-6xl mx-auto">
        <section>
          <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">📚 抽出された単語</h2>
          {article.words.length === 0 ? (
            <p className="text-gray-600 text-center">単語が見つかりませんでした。</p>
          ) : (
            <ul className="list-disc ml-5 space-y-2 text-gray-800">
              {article.words.map((word, index) => (
                <li key={index}>
                  <span className="font-semibold">{word.word}</span>：{word.meaning}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* 和訳セクション */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-6xl mx-auto">
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">📖 和訳</h2>
          <p className="whitespace-pre-wrap text-gray-800">{article.translation}</p>
        </section>
      </div>
    </main>
  );
}
