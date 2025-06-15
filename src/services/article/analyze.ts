// src/services/article/analyze.ts
import openai from "../../../lib/openai";

export async function analyzeArticle(text: string) {
  const prompt = `以下の英文を日本語で要約してください:\n\n${text}`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
  });

  return res.choices[0].message.content || "";
}
