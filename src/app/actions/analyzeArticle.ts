// src/app/actions/analyzeArticle.ts
'use server';

import { analyzeArticle } from "@/services/article/analyze";
import { auth } from "../../../lib/auth"; 
import { prisma } from "../../../lib/db";

export async function analyzeArticleAction(formData: FormData) {
  const user = await auth();

  const text = formData.get("text")?.toString() || "";

  if (!text.trim()) {
    throw new Error("本文が空です");
  }

  const summary = await analyzeArticle(text);

  // Prisma に保存
  await prisma.article.create({
    data: {
      userId: user.id,           
      title: "",              
      content: text,
      summary,
      sourceUrl: "",             
    },
  });

  return summary;
}
