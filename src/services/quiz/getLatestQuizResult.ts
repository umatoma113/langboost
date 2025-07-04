// services/quiz/getLatestQuizResult.ts
import { prisma } from '../../../lib/db';

export async function getLatestQuizResult(userId: string) {
    const latestTime = await prisma.quizHistory.aggregate({
        where: { userId },
        _max: { executedAt: true },
    });

    const executedAt = latestTime._max.executedAt;

    if (!executedAt) return [];

    const latestHistories = await prisma.quizHistory.findMany({
        where: {
            userId,
            executedAt,
        },
        orderBy: { id: 'asc' },
        include: {
            quizTemplate: true,
        },
    });

    return latestHistories.map((result) => {
        const template = result.quizTemplate;
        const choices = [
            template.choice1,
            template.choice2,
            template.choice3,
            template.choice4,
        ];

        const correctAnswerIndex = template.answer - 1;
        const selectedAnswerIndex = result.userAnswer - 1;

        return {
            wordId: result.wordId,
            question: template.question,
            choices,
            correctAnswer: choices[correctAnswerIndex],
            selectedAnswer: choices[selectedAnswerIndex],
            correctAnswerIndex,
            selectedAnswerIndex,
            isCorrect: result.isCorrect,
            executedAt: result.executedAt,
        };
    });
}
