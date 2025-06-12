// src/app/api/summarize/route.ts
import { openai } from "../../../../lib/openai";

export async function POST(req: Request) {
  const { text } = await req.json();

   const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `以下の文章を日本語で簡潔に要約してください：\n\n${text}`,
      },
    ],
  });

  const summary = completion.choices[0].message.content;
  return Response.json({ summary });
}

// export async function POST(req: Request) {
//   try {
//     const { text } = await req.json();

//     console.log("✅ 受け取ったテキスト:", text);

//     const completion = await openai.chat.completions.create({
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           role: "user",
//           content: `以下の文章を日本語で簡潔に要約してください：\n\n${text}`,
//         },
//       ],
//     });

//     const summary = completion.choices[0].message.content;
//     console.log("✅ 要約結果:", summary);

//     return Response.json({ summary });
//   } catch (error) {
//     console.error("❌ エラー:", error);
//     return new Response(JSON.stringify({ error: "Internal Server Error" }), {
//       status: 500,
//     });
//   }
// }

