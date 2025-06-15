// src/services/article/extractWords.ts
import openai from "../../../lib/openai";

export async function extractWordsFromText(text: string) {
  const prompt = `
以下の英文からTOEICスコア600点以上の英単語をすべて抽出してください。
それぞれの単語に対して、日本語訳を含むJSON形式で返してください。
JSONの形式は以下のような配列形式でお願いします：

[
  { "word": "ecosystem", "meaning": "生態系" },
  { "word": "climate", "meaning": "気候" }
]

前後の説明や記号（\`\`\`など）は一切つけず、JSONデータのみを返してください。
同じ単語の重複は避けてください。

"${text}"
`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
  });

  let content = res.choices[0].message.content || "[]";
  content = content.trim();

  // ✅ コードブロック除去（強化版）
  content = content.replace(/```(?:json)?\s*([\s\S]*?)\s*```/i, "$1").trim();
  content = content.replace(/```/g, "").trim();

  try {
    const parsed = JSON.parse(content);

    // オブジェクト形式だった場合は配列形式に変換して返す
    if (!Array.isArray(parsed) && typeof parsed === "object") {
      console.warn("⚠️ JSONは配列ではありません。オブジェクトを配列に変換します");
      return Object.entries(parsed).map(([word, meaning]) => ({
        word,
        meaning,
      }));
    }

    return parsed;
  } catch (err) {
    console.error("❌ JSON parse error:", err);
    console.error("🔍 content received:", content);
    throw new Error("JSONの解析に失敗しました");
  }
}
