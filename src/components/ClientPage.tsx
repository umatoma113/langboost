//src/components/ClientPage.tsx
'use client';

import Header from "@/components/Header";
import { Button } from "@heroui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { analyzeAndExtractAction } from "@/app/actions/analyzeAndExtractAction";

type Word = { word: string; meaning: string };

type Props = {
  user: { id: string; name?: string | null };
};

export default function ClientPage({ user }: Props) {
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleAnalyzeAndExtract = async () => {
    if (!text.trim()) {
      setError("本文を入力してください。");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("text", text);

      const result = await analyzeAndExtractAction(formData);

      // クエリパラメータとして遷移先へ渡す
     const params = new URLSearchParams();
      params.set("summary", encodeURIComponent(result.summary));
      params.set("translation", encodeURIComponent(result.translation));
      params.set("words", JSON.stringify(result.words));

      router.push(`/summary/${result.id}`);
    } catch (err) {
      console.error(err);
      setError("要約・単語抽出に失敗しました。");
    } finally {
      setLoading(false);
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
            ようこそ、{user.name ?? "ユーザー"} さん！記事URLや文章を貼るだけで、日本語の要約と単語抽出ができる語学学習ツール。
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

          <div className="flex justify-center">
            <button
              onClick={handleAnalyzeAndExtract}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "分析中..." : "要約と単語を抽出"}
            </button>
          </div>

          <div className="text-center mt-6">
            <Button color="primary" className="focus:ring-0 focus:outline-none">
              HeroUIボタン
            </Button>
          </div>

          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
      </main>
    </>
  );
}
