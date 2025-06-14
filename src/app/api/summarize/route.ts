// src/app/api/summarize/route.ts
import { NextResponse } from "next/server";
import openai from "../../../../lib/openai";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || text.trim() === "") {
      return NextResponse.json({ error: "テキストが空です。" }, { status: 400 });
    }

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: [
        {
          role: "user",
          content: `以下の文章を日本語で要約してください:\n\n${text}`,
        },
      ],
    });

    const result = chatCompletion.choices[0]?.message?.content;
    if (!result) {
      return NextResponse.json({ error: "要約結果が取得できませんでした。" }, { status: 502 });
    }

    return NextResponse.json({ summary: result });
  } catch (error) {
    console.error("❌ OpenAI API Error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ error: "要約に失敗しました。" }, { status: 500 });
  }
}
