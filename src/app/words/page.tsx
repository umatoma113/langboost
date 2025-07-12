// src/app/words/page.tsx
import { auth } from '../../../lib/auth';
import { prisma } from '../../../lib/db';
import PaginatedWords from '@/components/PaginatedWords';
import { deleteWordAction } from '@/app/actions/deleteWord';
import { revalidatePath } from 'next/cache';
import { Prisma } from '../generated/prisma';
import Header from '@/components/Header';

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

export default async function WordsPage({ searchParams }: { searchParams: { page?: string; q?: string } }) {
    const session = await auth();
    if (!session?.id) return <p className="text-center mt-10">ログインが必要です。</p>;

    const currentPage = Number(searchParams.page) || 1;
    const query = searchParams.q?.trim() || '';
    const { words, totalPages } = await getUserWords(session.id, currentPage, query);

    async function handleDelete(wordId: number) {
        'use server';
        await deleteWordAction(wordId);
        revalidatePath('/words');
    }

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
                    <ul className="space-y-4">
                        {words.map((entry) => (
                            <li key={entry.word.id} className="p-4 bg-white shadow rounded flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{entry.word.word}</p>
                                    <p className="text-sm text-gray-500">{entry.word.meaning}</p>
                                </div>
                                <form action={handleDelete.bind(null, entry.word.id)}>
                                    <button className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded shadow">
                                        削除
                                    </button>
                                </form>
                            </li>
                        ))}
                    </ul>
                )}

                {totalPages > 1 && (
                    <PaginatedWords page={currentPage} totalPages={totalPages} query={query} />
                )}
            </main>
        </>
    );

}
