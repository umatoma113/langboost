// src/services/article/analyze.ts

type AnalyzeResult = {
  summaryJa: string;    // 要約（日本語）
  translation: string;  // 和訳（全文）
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
      messages: [
        {
          role: "user",
          content: "以下の英文について、日本語で簡潔に要約した要約文（summaryJa）と全文の自然な和訳（translation）を返してください。",
        },
        {
          role: "user",
          content: text,
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "analyze_article",
            description: "英文を日本語で要約し、和訳を返す",
            parameters: {
              type: "object",
              properties: {
                summaryJa: { type: "string" },
                translation: { type: "string" },
              },
              required: ["summaryJa", "translation"],
            },
          },
        },
      ],
      tool_choice: {
        type: "function",
        function: { name: "analyze_article" },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API エラー: ${res.status} ${res.statusText}\n${err}`);
  }

  const json = await res.json();
  const functionCall = json.choices?.[0]?.message?.tool_calls?.[0]?.function;

  if (!functionCall?.arguments) {
    throw new Error("構造化出力（tool_calls.arguments）が取得できませんでした");
  }

  try {
    const parsed = JSON.parse(functionCall.arguments) as AnalyzeResult;
    return parsed;
  } catch (e) {
    throw new Error("JSONパースエラー: " + String(e));
  }
}
