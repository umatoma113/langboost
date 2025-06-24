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

    const correctCount = results.filter((r: QuizResultItem) => r.isCorrect).length;

    return (
        <main className="min-h-screen bg-gradient-to-br from-pink-50 to-indigo-100 py-10 px-4">
            <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow space-y-8 animate-fade-in">
                <h1 className="text-3xl font-bold text-center text-indigo-700">🎉 クイズ結果</h1>
                <p className="text-center text-gray-700 text-lg font-semibold">
                    {results.length > 0 ? `全${results.length}問中 ${correctCount}問正解！` : ''}
                </p>

                {results.length === 0 ? (
                    <p className="text-center text-gray-500">クイズ結果が見つかりませんでした。</p>
                ) : (
                    <ul className="space-y-6">
                        {results.map((res: QuizResultItem, idx: number) => (
                            <li
                                key={idx}
                                className={`p-5 rounded-lg shadow-md border-l-8 ${res.isCorrect
                                        ? 'bg-green-50 border-green-400'
                                        : 'bg-red-50 border-red-400'
                                    }`}
                            >
                                <p className="text-md font-bold text-gray-800 mb-3">
                                    Q{idx + 1}. {res.question}
                                </p>
                                <ul className="space-y-2 text-sm">
                                    {res.choices.map((choice, i) => {
                                        const isSelected = i === res.selectedAnswerIndex;
                                        const isCorrect = i === res.correctAnswerIndex;

                                        let label = '';
                                        if (isSelected && isCorrect) label = '✅ あなたの選択（正解）';
                                        else if (isSelected) label = '❌ あなたの選択';
                                        else if (isCorrect) label = '✅ 正解';

                                        const base =
                                            'py-1 px-3 rounded transition-all border text-gray-700';
                                        const highlight = isSelected
                                            ? isCorrect
                                                ? 'bg-green-100 border-green-300 font-semibold'
                                                : 'bg-red-100 border-red-300 font-semibold'
                                            : isCorrect
                                                ? 'bg-green-50 border-green-200 font-semibold'
                                                : 'bg-white border-gray-200';

                                        return (
                                            <li key={i} className={`${base} ${highlight}`}>
                                                {i + 1}. {choice}
                                                {label && <span className="ml-2 text-xs text-gray-500">{label}</span>}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="text-center pt-8">
                    <a
                        href="/mypage"
                        className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition"
                    >
                        マイページへ戻る
                    </a>
                </div>
            </div>
        </main>
    );
}
