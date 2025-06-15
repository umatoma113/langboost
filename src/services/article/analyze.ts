// src/services/article/analyze.ts
type AnalyzeResult = {
  summary: string;
};

export async function analyzeArticle(text: string): Promise<AnalyzeResult> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      response_format: "json", // ✅ JSONモード
      messages: [
        {
          role: "user",
          content: "以下の英文を要約してください。",
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "return_summary",
            description: "英文の要約を生成する",
            parameters: {
              type: "object",
              properties: {
                summary: {
                  type: "string",
                  description: "日本語での要約文",
                },
              },
              required: ["summary"],
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "return_summary" } },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API エラー: ${res.status} ${res.statusText}\n${err}`);
  }

  const json = await res.json();
  const toolCall = json.choices?.[0]?.message?.tool_calls?.[0];

  if (!toolCall || toolCall.function.name !== "return_summary") {
    throw new Error("構造化された要約が返されませんでした");
  }

  const args = JSON.parse(toolCall.function.arguments || "{}");

  return { summary: args.summary };
}
