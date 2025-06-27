// src/app/actions/analyzeAndExtract.ts
'use server';

import { analyzeArticle } from "@/services/article/analyze";
import { extractWordsFromText } from "@/services/article/extractWords";
import { auth } from "../../../lib/auth";
import { prisma } from "../../../lib/db";

export async function analyzeAndExtractAction(formData: FormData) {
  console.log("✅ analyzeAndExtractAction reached");

  const session = await auth();
  if (!session?.id) throw new Error("ログインが必要です");

  const text = formData.get("text")?.toString() || "";
  if (!text.trim()) throw new Error("本文が空です");

  // 要約
  const result = await analyzeArticle(text);
  const summary = result.summaryJa;
  const translation = result.translation;

  // 要約結果を保存
  const savedArticle = await prisma.article.create({
    data: {
      userId: session.id,
      title: summary.slice(0, 50),
      content: text,
      summary,
      translation,
      sourceUrl: "",
    },
  });

  console.log("✅ Article saved:", savedArticle.id);

  await prisma.articleQuiz.create({
    data: {
      articleId: savedArticle.id,
      question: result.quiz.question,
      choice1: result.quiz.choices[0],
      choice2: result.quiz.choices[1],
      choice3: result.quiz.choices[2],
      choice4: result.quiz.choices[3],
      answer: result.quiz.answer,
      explanation: result.quiz.explanation,
    },
  });

  // 単語抽出
  const rawWords = await extractWordsFromText(summary); // or use `text` if preferred

  const MAX_WORD_LENGTH = 255;
  const MAX_MEANING_LENGTH = 1024;

  const words = [];

  for (const entry of rawWords) {
    const word = entry.word?.toString() ?? "";
    const meaning = entry.meaning?.toString() ?? "";

    if (!word || !meaning || word.length > MAX_WORD_LENGTH || meaning.length > MAX_MEANING_LENGTH) {
      continue;
    }

    const savedWord = await prisma.word.upsert({
      where: { baseForm: word },
      update: {},
      create: {
        word,
        baseForm: word,
        meaning,
      },
    });

    await prisma.userWord.upsert({
      where: {
        userId_wordId: {
          userId: session.id,
          wordId: savedWord.id,
        },
      },
      update: {},
      create: {
        userId: session.id,
        wordId: savedWord.id,
        level: 1,
        nextReviewDate: new Date(),
        registeredAt: new Date(),
        lastTestedAt: new Date(),
        correctCount: 0,
        incorrectCount: 0,
      },
    });

    words.push(savedWord);
  }


  return {
    id: savedArticle.id,
    summary,
    translation,
    words,
    quiz: result.quiz,
  };
}
