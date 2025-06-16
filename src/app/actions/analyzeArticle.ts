//src/app/actions/analyzeArticle.ts
'use server';

import { analyzeArticle } from "@/services/article/analyze";
import { auth } from "../../../lib/auth";
import { prisma } from "../../../lib/db";

export async function analyzeArticleAction(formData: FormData) {
  console.log("✅ analyzeArticleAction reached");

  const session = await auth();
  console.log("🧑 session.id:", session.id);

  if (!session?.id) {
    throw new Error("ログインが必要です");
  }

  const text = formData.get("text")?.toString() || "";

  if (!text.trim()) {
    throw new Error("本文が空です");
  }

  const result = await analyzeArticle(text); // ✅ オブジェクトを受け取る
  console.log("📝 result:", result);

  const saved = await prisma.article.create({
    data: {
      userId: session.id,
      title: "", // タイトル自動生成などは今後追加
      content: text,
      summary: result.summaryJa, // ✅ summaryは文字列で保存
      sourceUrl: "",
    },
  });

  console.log("✅ Article saved:", saved.id);

  return result; // ✅ returnもオブジェクトのまま
}
