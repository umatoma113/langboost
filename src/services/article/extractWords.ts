// src/services/article/extractWords.ts

type ExtractedWord = {
  word: string;
  meaning: string;
};

export async function extractWordsFromText(text: string): Promise<ExtractedWord[]> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      // response_format: "json", // ✅ 正しい指定（文字列）
      messages: [
        {
          role: "user",
          content: `以下の英文からTOEICスコア600点以上の英単語をすべて抽出してください。
それぞれの単語に対して、日本語訳を含むJSON形式で返してください。
形式は以下のようにしてください：

[
  { "word": "ecosystem", "meaning": "生態系" },
  { "word": "climate", "meaning": "気候" }
]

"${text}"`,
        },
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "return_words",
            description: "抽出された単語と日本語訳の配列を返す",
            parameters: {
              type: "object",
              properties: {
                words: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      word: { type: "string" },
                      meaning: { type: "string" },
                    },
                    required: ["word", "meaning"],
                  },
                },
              },
              required: ["words"],
            },
          },
        },
      ],
      tool_choice: {
        type: "function",
        function: {
          name: "return_words",
        },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API エラー: ${res.status} ${res.statusText}\n${err}`);
  }

  const json = await res.json();

  const toolCall = json.choices?.[0]?.message?.tool_calls?.[0];
  if (!toolCall || toolCall.function.name !== "return_words") {
    throw new Error("構造化された単語配列が返されませんでした");
  }

  const args = JSON.parse(toolCall.function.arguments || "{}");

  return args.words as ExtractedWord[];
}
