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
      messages: [
        {
          role: "user",
          content: `以下の英文からTOEICスコア600点以上の英単語を抽出してください。
それぞれの単語に対して、日本語訳を**1〜2語程度の簡潔な表現**で返してください。`,
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
            name: "extract_words",
            description: "英文から英単語と日本語訳を抽出する",
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
        function: { name: "extract_words" },
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
    throw new Error("構造化出力が取得できませんでした");
  }

  try {
    const parsed = JSON.parse(functionCall.arguments) as { words: ExtractedWord[] };

    // 文字数制限による安全フィルタ
    const MAX_WORD_LENGTH = 100;
    const MAX_MEANING_LENGTH = 255;

    const filtered = parsed.words.filter(
      ({ word, meaning }) =>
        word.length <= MAX_WORD_LENGTH && meaning.length <= MAX_MEANING_LENGTH
    );

    return filtered;
  } catch (e) {
    throw new Error("JSONパースエラー: " + String(e));
  }
}
