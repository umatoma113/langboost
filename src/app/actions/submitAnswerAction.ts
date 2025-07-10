// src/app/actions/submitAnswerAction.ts
'use server';

import { auth } from '../../../lib/auth';
import { saveQuizResult } from '@/services/quiz/saveResult';

type SubmitAnswerParams = {
    wordId: number;
    quizTemplateId: number;
    selectedChoice: number;
    isCorrect: boolean;
    executedAt: string;
};

export async function submitAnswerAction({
    wordId,
    quizTemplateId,
    selectedChoice,
    isCorrect,
    executedAt,
}: SubmitAnswerParams) {
    const user = await auth();
    if (!user) throw new Error('認証が必要です');

    await saveQuizResult({
        userId: user.id,
        wordId,
        quizTemplateId,
        selectedChoice,
        isCorrect,
        executedAt: new Date(executedAt),
    });

    return { success: true };
}
