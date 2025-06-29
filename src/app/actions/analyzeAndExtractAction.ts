// src/app/actions/analyzeAndExtract.ts
'use server';

import { analyzeArticle } from "@/services/article/analyze";
import { extractWordsFromText } from "@/services/article/extractWords";
import { normalizeWord } from "../../../lib/normalizeWord";
import { auth } from "../../../lib/auth";
import { prisma } from "../../../lib/db";

export async function analyzeAndExtractAction(formData: FormData) {
  console.time("🕒 analyzeAndExtract 全体処理");

  const session = await auth();
  if (!session?.id) throw new Error("ログインが必要です");

  const text = formData.get("text")?.toString() || "";
  if (!text.trim()) throw new Error("本文が空です");

  console.time("🕒 要約と翻訳");
  const result = await analyzeArticle(text);
  console.timeEnd("🕒 要約と翻訳");

  const summary = result.summaryJa;
  const translation = result.translation;

  console.time("🕒 記事保存");
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
  console.timeEnd("🕒 記事保存");

  console.time("🕒 クイズ保存");
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
  console.timeEnd("🕒 クイズ保存");

  console.time("🕒 単語抽出と保存");
  const rawWords = await extractWordsFromText(summary);
  const MAX_WORD_LENGTH = 255;
  const MAX_MEANING_LENGTH = 1024;

  const words = [];

  for (const entry of rawWords) {
    const word = entry.word?.toString() ?? "";
    const meaning = entry.meaning?.toString() ?? "";
    const baseForm = normalizeWord(word);

    if (
      !word ||
      !meaning ||
      !baseForm ||
      baseForm.length > MAX_WORD_LENGTH ||
      meaning.length > MAX_MEANING_LENGTH
    ) {
      continue;
    }

    const savedWord = await prisma.word.upsert({
      where: { baseForm },
      update: {},
      create: {
        word,
        baseForm,
        meaning,
      },
    });
    words.push(savedWord);
  }
  console.timeEnd("🕒 単語抽出と保存");

  console.timeEnd("🕒 analyzeAndExtract 全体処理");

  return {
    id: savedArticle.id,
    summary,
    translation,
    words,
    quiz: result.quiz,
  };
}
