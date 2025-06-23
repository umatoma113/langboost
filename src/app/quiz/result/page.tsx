// src/app/quiz/result/page.tsx
import { auth } from '../../../../lib/auth';
import { redirect } from 'next/navigation';
import { getLatestQuizResult } from '@/services/quiz/getLatestQuizResult';

type QuizResultItem = {
    wordId: number | null;
    question: string;
    choices: string[];
    correctAnswer: string;
    selectedAnswer: string;
    correctAnswerIndex: number;
    selectedAnswerIndex: number;
    isCorrect: boolean;
    executedAt: Date;
};

export default async function QuizResultPage() {
    const user = await auth().catch(() => null);
    if (!user) return redirect('/login');

    const results = await getLatestQuizResult(user.id);

    return (
        <main className="max-w-3xl mx-auto p-6 space-y-8">
            <h1 className="text-2xl font-bold text-center text-gray-800">クイズ結果</h1>

            {results.length === 0 ? (
                <p className="text-center text-gray-500">クイズ結果が見つかりませんでした。</p>
            ) : (
                <ul className="space-y-4">
                    {results.map((res: QuizResultItem, idx: number) => (
                        <li
                            key={idx}
                            className={`p-4 border rounded shadow ${res.isCorrect ? 'bg-green-50' : 'bg-red-50'
                                }`}
                        >
                            <p className="font-semibold text-gray-700 mb-2">
                                Q{idx + 1}. {res.question}
                            </p>
                            <ul className="space-y-1 text-sm text-gray-800">
                                {res.choices.map((choice: string, i: number) => {
                                    const isSelected = i === res.selectedAnswerIndex;
                                    const isCorrect = i === res.correctAnswerIndex;

                                    let label = '';
                                    if (isSelected && isCorrect) label = '✅ あなたの選択（正解）';
                                    else if (isSelected && !isCorrect) label = '❌ あなたの選択';
                                    else if (!isSelected && isCorrect) label = '✅ 正解';

                                    const baseStyle = 'pl-2';
                                    const selectedStyle = isSelected
                                        ? isCorrect
                                            ? 'text-green-600 font-bold'
                                            : 'text-red-600 font-bold'
                                        : isCorrect
                                            ? 'text-green-600 font-semibold'
                                            : 'text-gray-800';

                                    return (
                                        <li key={i} className={`${baseStyle} ${selectedStyle}`}>
                                            {i + 1}. {choice}
                                            {label && <span className="ml-2 text-sm">{label}</span>}
                                        </li>
                                    );
                                })}
                            </ul>
                        </li>
                    ))}
                </ul>
            )}

            <div className="text-center mt-10">
                <a
                    href="/mypage"
                    className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    マイページへ戻る
                </a>
            </div>
        </main>
    );
}
