// src/services/article.ts
import { prisma } from '../../lib/db';

export type ArticleWithWords = {
  id: number;
  title: string;
  summary: string;
  translation: string | null;
  content: string; 
  words: {
    word: string;
    meaning: string;
  }[];
  quiz?: {
    question: string;
    choice1: string;
    choice2: string;
    choice3: string;
    choice4: string;
    answer: number;
    explanation: string;
  } | null;
};

export async function getArticleById(id: number): Promise<ArticleWithWords | null> {
  const article = await prisma.article.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      summary: true,
      translation: true,
      content: true,
      userId: true,
      articleQuizzes: {
        take: 1, // 1問だけ取得
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!article) return null;

  const words = await prisma.word.findMany({
    where: { userId: article.userId },
    select: {
      word: true,
      meaning: true,
    },
  });

  const quizData = article.articleQuizzes[0];

  return {
    id: article.id,
    title: article.title,
    summary: article.summary,
    translation: article.translation,
    content: article.content,
    words,
    quiz: quizData
      ? {
          question: quizData.question,
          choice1: quizData.choice1,
          choice2: quizData.choice2,
          choice3: quizData.choice3,
          choice4: quizData.choice4,
          answer: quizData.answer,
          explanation: quizData.explanation,
        }
      : null,
  };
}
