import { NextResponse } from "next/server";
import openai from "../../../../lib/openai";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "テキストが空です。" }, { status: 400 });
    }

    const prompt = `
以下の英文から、TOEICスコア600点以上の英単語をすべて抽出してください。
それぞれの単語に対して、日本語訳を含むJSON形式で返してください。
前後の説明や\`\`\`などの記号は付けず、JSONデータのみを返してください。
同じ単語の重複は避けてください。

形式:
[
  { "word": "climate", "meaning": "気候" },
  ...
]

対象の英文:
"${text}"
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const rawContent = response.choices[0]?.message?.content?.trim();

    // 余計な```やコメントを除去
    const jsonString = rawContent
      ?.replace(/^\s*```json\s*/i, "")
      ?.replace(/^\s*```\s*/i, "")
      ?.replace(/\s*```$/i, "")
      ?.trim();

    let words = [];
    try {
      words = jsonString ? JSON.parse(jsonString) : [];
    } catch (parseError) {
      console.error("❌ JSON parse failed:", parseError);
      console.error("📦 OpenAI response content:", rawContent);
      return NextResponse.json({ error: "JSONパースに失敗しました。" }, { status: 500 });
    }

    return NextResponse.json({ words });
  } catch (error) {
    console.error("❌ 単語抽出エラー:", error);
    return NextResponse.json({ error: "単語抽出に失敗しました。" }, { status: 500 });
  }
}
