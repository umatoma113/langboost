// src/app/articles/page.tsx
import { auth } from '../../../lib/auth';
import { prisma } from '../../../lib/db';
import Link from 'next/link';
import { format } from 'date-fns';
import PaginationWrapper from '@/components/PaginatedArticles';
import Header from '@/components/Header';
import DeleteButton from '@/components/DeleteButton';
import { deleteArticleAction } from '@/app/actions/deleteArticleAction';

const PAGE_SIZE = 10;

const getArticles = async (userId: string, page: number, query: string) => {
  const where = {
    userId,
    ...(query && {
      title: { contains: query, mode: 'insensitive' as const },
    }),
  };

  const total = await prisma.article.count({ where });

  const articles = await prisma.article.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return {
    articles,
    totalPages: Math.ceil(total / PAGE_SIZE),
  };
};

export default async function ArticlePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();
  const userId = session.id;

  const params = await searchParams;

  const pageParam = Array.isArray(params?.page)
    ? params?.page[0]
    : params?.page;

  const queryParam = Array.isArray(params?.q)
    ? params?.q[0]
    : params?.q;

  const currentPage = Number(pageParam) || 1;
  const query = queryParam?.trim() || '';

  const { articles, totalPages } = await getArticles(userId, currentPage, query);

  return (
    <>
      <Header showTopPage={true} showMyPage={true} />

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">📰 記事一覧</h1>

        <form method="GET" className="mb-6 flex items-center gap-2">
          <input
            type="text"
            name="q"
            placeholder="記事タイトルで検索"
            defaultValue={query}
            className="flex-grow border border-gray-300 rounded px-3 py-1"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 rounded shadow"
          >
            検索
          </button>
        </form>

        {articles.length === 0 ? (
          <p className="text-gray-500">記事がまだ登録されていません。</p>
        ) : (
          <ul className="space-y-4">
            {articles.map((article) => (
              <li
                key={article.id}
                className="p-4 bg-white shadow rounded flex justify-between items-center"
              >
                <div className="flex items-center gap-x-4 flex-grow min-w-0">
                  <div className="min-w-0 flex-grow">
                    <p className="font-semibold truncate">{article.title}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(article.createdAt), 'yyyy/MM/dd')}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    <Link
                      href={`/summary/${article.id}`}
                      className="w-20 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded shadow text-center"
                    >
                      開く
                    </Link>
                    <DeleteButton id={article.id} onDelete={deleteArticleAction} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {totalPages > 1 && (
          <PaginationWrapper
            page={currentPage}
            totalPages={totalPages}
            query={query}
          />
        )}
      </main>
    </>
  );
}
