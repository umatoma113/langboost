//src/services/quiz/getQuizSet.ts
import { getLeitnerReviewWords } from './getLeitnerReviewWords';
import { generateQuizTemplateForWord } from './generateQuizTemplate';

export type QuizTemplate = {
  id: number;
  wordId: number;
  quizType: string;
  question: string;
  choice1: string;
  choice2: string;
  choice3: string;
  choice4: string;
  answer: number;
};

export async function getQuizSet(userId: string): Promise<QuizTemplate[]> {
  const userWords = await getLeitnerReviewWords(userId);
  const quizzes: QuizTemplate[] = [];

  for (const userWord of userWords) {
    const existing = userWord.word.quizTemplates.find(
      (q: QuizTemplate) => q.quizType === 'meaning'
    );

    if (existing) {
      quizzes.push(existing);
    } else {
      const generated = await generateQuizTemplateForWord(userWord.wordId);
      quizzes.push(generated);
    }
  }

  return quizzes;
}
