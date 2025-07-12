// src/app/articles/page.tsx
import { prisma } from '../../../lib/db';
import Link from 'next/link';
import { deleteArticleAction } from '@/app/actions/deleteArticleAction';
import { revalidatePath } from 'next/cache';
import { format } from 'date-fns';
import PaginationWrapper from '@/components/PaginatedArticles';
import Header from '@/components/Header';

const PAGE_SIZE = 10;

async function getArticles(page: number, query: string) {
    const where = query
        ? { title: { contains: query, mode: 'insensitive' as const } }
        : {};

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
}

export default async function ArticlePage({
    searchParams,
}: {
    searchParams?: { page?: string; q?: string };
}) {
    const currentPage = Number(searchParams?.page) || 1;
    const query = searchParams?.q?.trim() || '';

    const { articles, totalPages } = await getArticles(currentPage, query);

    async function handleDelete(id: number) {
        'use server';
        await deleteArticleAction(id);
        revalidatePath('/articles');
    }

    return (
        <>
            {/* ヘッダーは全幅表示 */}
            <Header showTopPage={true} showMyPage={true} />

            <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">📰 記事一覧</h1>

                {/* 🔍 検索フォーム */}
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

                {/* 📄 記事一覧 */}
                {articles.length === 0 ? (
                    <p className="text-gray-500">記事がまだ登録されていません。</p>
                ) : (
                    <ul className="space-y-4">
                        {articles.map((article) => (
                            <li
                                key={article.id}
                                className="p-4 bg-white shadow rounded flex justify-between items-center"
                            >
                                <div>
                                    <p className="font-semibold">{article.title}</p>
                                    <p className="text-sm text-gray-500">
                                        {format(new Date(article.createdAt), 'yyyy/MM/dd')}
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Link href={`/summary/${article.id}`}>
                                        <button className="w-20 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded shadow">
                                            開く
                                        </button>
                                    </Link>
                                    <form action={handleDelete.bind(null, article.id)}>
                                        <button className="w-20 bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded shadow">
                                            削除
                                        </button>
                                    </form>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {/* ページネーション */}
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
