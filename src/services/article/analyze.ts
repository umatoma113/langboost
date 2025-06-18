// src/services/article/analyze.ts

type AnalyzeResult = {
  summaryJa: string;
  translation: string;
  quiz: {
    question: string;
    choices: [string, string, string, string];
    answer: number; // 正解の番号（1〜4）
    explanation: string;
  };
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
          content: `以下の英文について、次の3点を日本語で生成してください：

  1. 簡潔な要約（summaryJa）  
  2. 全文の自然な和訳（translation）  
  3. 要旨に関する4択クイズ（quiz）を1問（JSON形式）

  本文：
  ${text}
  `,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_article",
              description: "英文を要約・翻訳し、要旨クイズを生成する",
              parameters: {
                type: "object",
                properties: {
                  summaryJa: { type: "string" },
                  translation: { type: "string" },
                  quiz: {
                    type: "object",
                    properties: {
                      question: { type: "string" },
                      choices: {
                        type: "array",
                        items: { type: "string" },
                        minItems: 4,
                        maxItems: 4,
                      },
                      answer: { type: "integer", minimum: 1, maximum: 4 },
                      explanation: { type: "string" },
                    },
                    required: ["question", "choices", "answer", "explanation"],
                  },
                },
                required: ["summaryJa", "translation", "quiz"],
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
