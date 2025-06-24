// services/quiz/getLatestQuizResult.ts
import { prisma } from '../../../lib/db';

export async function getLatestQuizResult(userId: string) {
    const latestHistories = await prisma.quizHistory.findMany({
        where: { userId },
        orderBy: { executedAt: 'desc' },
        take: 10,
        include: {
            quizTemplate: true,
        },
    });

    return latestHistories.map((result: typeof latestHistories[number]) => {
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
