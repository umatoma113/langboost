// src/app/words/page.tsx
import { auth } from '../../../lib/auth';
import { prisma } from '../../../lib/db';
import PaginatedWords from '@/components/PaginatedWords';
import { Prisma } from '../generated/prisma';
import Header from '@/components/Header';
import WordsListClient from '@/components/WordsListClient';

const PAGE_SIZE = 10;

async function getUserWords(userId: string, page: number, query: string) {
  const where: Prisma.UserWordWhereInput = {
    userId,
    word: query
      ? {
        OR: [
          { word: { contains: query, mode: 'insensitive' as const } },
          { meaning: { contains: query, mode: 'insensitive' as const } },
        ],
      }
      : undefined,
  };

  const total = await prisma.userWord.count({ where });

  const words = await prisma.userWord.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: { word: true },
  });

  return {
    words,
    totalPages: Math.ceil(total / PAGE_SIZE),
  };
}

export default async function WordsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; q?: string }>;
}) {
  const params = await searchParams;
  const session = await auth();
  if (!session?.id) return <p className="text-center mt-10">ログインが必要です。</p>;

  const currentPage = Number(params?.page) || 1;
  const query = params?.q?.trim() || '';

  const { words, totalPages } = await getUserWords(session.id, currentPage, query);


  return (
    <>
      <Header showTopPage={true} showMyPage={true} />

      <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">📚 単語帳</h1>

        {/* 検索フォーム */}
        <form method="GET" className="mb-6 flex gap-2 items-center">
          <input
            type="text"
            name="q"
            placeholder="単語 or 意味で検索"
            defaultValue={query}
            className="border border-gray-300 rounded px-3 py-1 w-full"
          />
          <button
            type="submit"
            className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1 rounded shadow"
          >
            検索
          </button>
        </form>

        {/* 単語一覧 */}
        {words.length === 0 ? (
          <p className="text-gray-500">単語がまだ登録されていません。</p>
        ) : (
          <WordsListClient words={words} />
        )}
        {totalPages > 1 && (
          <PaginatedWords page={currentPage} totalPages={totalPages} query={query} />
        )}
      </main>
    </>
  );
}
