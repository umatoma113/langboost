// src/app/api/summarize/route.ts
import { openai } from "../../../../lib/openai";

// export async function POST(req: Request) {
//   const { text } = await req.json();

//    const completion = await openai.chat.completions.create({
//     model: "gpt-3.5-turbo",
//     messages: [
//       {
//         role: "user",
//         content: `以下の文章を日本語で簡潔に要約してください：\n\n${text}`,
//       },
//     ],
//   });

//   const summary = completion.choices[0].message.content;
//   return Response.json({ summary });
// }

export async function POST() {
  console.log("✅ POST /api/summarize 実行されました");

  return new Response(JSON.stringify({ summary: "これはテスト要約です" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

