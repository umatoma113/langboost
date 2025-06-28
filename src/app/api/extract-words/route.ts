// src/app/api/extract-words/route.ts
import { NextResponse } from "next/server";
import openai from "../../../../lib/openai";

type ExtractedWord = {
  word: string;
  meaning: string;
};

export async function POST(req: Request) {
  let text = "";

  // ✅ JSON.parseエラーをハンドリング
  try {
    const body = await req.json();
    text = typeof body.text === "string" ? body.text : "";
  } catch (err) {
    console.error("❌ リクエストボディのJSONパースに失敗:", err);
    return NextResponse.json({ error: "無効なJSON形式です。" }, { status: 400 });
  }

  if (!text || text.trim() === "") {
    return NextResponse.json({ error: "テキストが空です。" }, { status: 400 });
  }

  const prompt = `
以下の英文から、TOEICスコア600点以上の英単語（難しい語彙）を原形（base form）で抽出してください。
それぞれの単語に対して、日本語訳を含むJSON形式で返してください。
形式は以下に厳密に従い、前後に文章・記号・説明をつけず、**JSONのみを返してください**。

[
  { "word": "climate", "meaning": "気候" },
  ...
]

対象の英文:
"${text}"
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const rawContent = response.choices[0]?.message?.content?.trim();
    console.log("📥 OpenAI response:", rawContent);

    const jsonString = rawContent
      ?.replace(/^\s*```json\s*/i, "")
      ?.replace(/^\s*```/, "")
      ?.replace(/\s*```$/, "")
      ?.trim();

    let words: ExtractedWord[] = [];

    try {
      const parsed = jsonString ? JSON.parse(jsonString) : [];

      if (Array.isArray(parsed)) {
        words = parsed.filter(
          (w): w is ExtractedWord =>
            typeof w.word === "string" &&
            w.word.trim() !== "" &&
            typeof w.meaning === "string" &&
            w.meaning.trim() !== ""
        );
      }
    } catch (parseError) {
      console.error("❌ JSON parse failed:", parseError);
      console.error("📦 OpenAI response content:", rawContent);
      return NextResponse.json({ error: "JSONパースに失敗しました。" }, { status: 500 });
    }

    const uniqueWords = Array.from(new Map(
      words.map(w => [w.word.toLowerCase(), w])
    ).values());

    return NextResponse.json({ words: uniqueWords });
  } catch (error) {
    console.error("❌ 単語抽出エラー:", error);
    return NextResponse.json({ error: "単語抽出に失敗しました。" }, { status: 500 });
  }
}

