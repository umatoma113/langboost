// src/app/quiz/history/page.tsx
import PaginatedHistory from '@/components/PaginatedHistory';
import { auth } from '../../../../lib/auth';
import { prisma } from '../../../../lib/db';
import { format } from 'date-fns';
import Header from '@/components/Header';

const PAGE_SIZE = 10;

async function getQuizHistory(userId: string, page: number) {
  const total = await prisma.quizHistory.count({
    where: { userId },
  });

  const histories = await prisma.quizHistory.findMany({
    where: { userId },
    orderBy: { executedAt: 'desc' },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    include: {
      quizTemplate: {
        include: {
          word: true,
        },
      },
    },
  });

  return {
    histories,
    totalPages: Math.ceil(total / PAGE_SIZE),
  };
}

export default async function QuizHistoryPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const session = await auth();
  if (!session?.id)
    return <p className="text-center mt-10">ログインが必要です。</p>;

  const currentPage = Number(params?.page) || 1;
  const { histories, totalPages } = await getQuizHistory(session.id, currentPage);

  return (
    <>
      <Header showTopPage={true} showMyPage={true} />
      <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">📝 クイズ履歴</h1>

        {histories.length === 0 ? (
          <p className="text-gray-500">クイズ履歴がまだありません。</p>
        ) : (
          <ul className="space-y-4">
            {histories.map((quiz) => (
              <li
                key={quiz.id}
                className="p-4 bg-white shadow rounded flex justify-between items-center"
              >
                <div>
                  <p className="text-sm text-gray-500">
                    {format(new Date(quiz.executedAt), 'yyyy/MM/dd')} — {quiz.quizTemplate.word.word}
                  </p>
                  <p className="text-sm text-gray-800">{quiz.quizTemplate.question}</p>
                </div>
                <span
                  className={`flex-shrink-0 text-sm font-semibold text-center ${
                    quiz.isCorrect ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {quiz.isCorrect ? '正解' : '不正解'}
                </span>
              </li>
            ))}
          </ul>
        )}

        {totalPages > 1 && (
          <PaginatedHistory page={currentPage} totalPages={totalPages} />
        )}
      </main>
    </>
  );
}
