//src/components/ClientPage.tsx
"use client";

import Header from "@/components/Header";
import { Button } from "@heroui/button";
import { useState } from "react";
import { analyzeArticleAction } from "@/app/actions/analyzeArticle";
import { extractWordsAction } from "@/app/actions/extractWords";

type Word = { word: string; meaning: string };

type Props = {
  user: { id: string; name?: string | null };
};

export default function ClientPage({ user }: Props) {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
  if (!text.trim()) {
    setError("本文を入力してください。");
    return;
  }

  setLoading(true);
  setError("");
  setSummary("");
  setWords([]);

  try {
    const formData = new FormData();
    formData.append("text", text);

    const result = await analyzeArticleAction(formData);
    setSummary(result.summaryJa); // ✅ 修正ここ！
  } catch {
    setError("要約に失敗しました。");
  } finally {
    setLoading(false);
  }
};


  const handleExtractWords = async () => {
    if (!text.trim()) {
      setError("本文を入力してください。");
      return;
    }

    setExtracting(true);
    setError("");
    setWords([]);

    try {
      const formData = new FormData();
      formData.append("text", text);
      const result = await extractWordsAction(formData);
      setWords(result);
    } catch {
      setError("単語抽出に失敗しました。");
    } finally {
      setExtracting(false);
    }
  };

  return (
    <>
      <Header showMyPage />
      <main className="min-h-screen bg-white px-4 py-6 md:py-12">
        <section className="text-center mb-6">
          <h2 className="text-3xl font-bold text-gray-900">英語力を、毎日のニュースで</h2>
          <h2 className="text-3xl font-bold text-gray-900 mt-2">育てよう</h2>
          <p className="text-gray-600 mt-4">
            ようこそ、{user.name ?? "ユーザー"} さん！
            記事URLや文章を貼るだけで、日本語の要約と単語抽出ができる語学学習ツール。
          </p>
        </section>

        <div className="max-w-2xl mx-auto mt-12 space-y-6">
          <input
            type="text"
            placeholder="https://example.com/news..."
            className="w-full border border-gray-300 rounded px-4 py-3 text-gray-700 placeholder-gray-400"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <div className="text-center text-sm text-gray-500">または</div>

          <textarea
            placeholder="ここに記事の本文を貼り付けてください…"
            className="w-full border border-gray-300 rounded px-4 py-3 h-60 text-gray-700 placeholder-gray-400"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <div className="flex justify-center space-x-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "要約中..." : "要約する"}
            </button>

            <button
              onClick={handleExtractWords}
              disabled={extracting}
              className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {extracting ? "抽出中..." : "単語を抽出"}
            </button>
          </div>

          <div className="text-center mt-6">
            <Button color="primary" className="focus:ring-0 focus:outline-none">
              HeroUIボタン
            </Button>
          </div>

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}

          {summary && (
            <div className="mt-6 p-4 bg-gray-100 border rounded">
              <h2 className="font-semibold mb-2">要約結果：</h2>
              <p className="whitespace-pre-wrap">{summary}</p>
            </div>
          )}

          {words.length > 0 && (
            <div className="mt-6 p-4 bg-yellow-50 border rounded">
              <h2 className="font-semibold mb-2">抽出された単語：</h2>
              <ul className="list-disc pl-5 space-y-1">
                {words.map((w, i) => (
                  <li key={i}>
                    <span className="font-bold">{w.word}</span>: {w.meaning}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
