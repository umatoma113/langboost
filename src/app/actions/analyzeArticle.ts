//src/app/actions/analyzeArticle.ts
'use server';

import { analyzeArticle } from "@/services/article/analyze";
import { auth } from "../../../lib/auth";
import { prisma } from "../../../lib/db";

export async function analyzeArticleAction(formData: FormData) {
  console.time("🕒 analyzeArticleAction 全体処理");

  const session = await auth();
  if (!session?.id) throw new Error("ログインが必要です");

  const text = formData.get("text")?.toString() || "";
  if (!text.trim()) throw new Error("本文が空です");

  console.time("🕒 analyzeArticle 実行");
  const result = await analyzeArticle(text);
  console.timeEnd("🕒 analyzeArticle 実行");

  console.time("🕒 記事保存");
  await prisma.article.create({
    data: {
      userId: session.id,
      title: "",
      content: text,
      summary: result.summaryJa,
      sourceUrl: "",
    },
  });
  console.timeEnd("🕒 記事保存");

  console.timeEnd("🕒 analyzeArticleAction 全体処理");
  return result;
}

