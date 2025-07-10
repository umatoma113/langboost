//src/components/ClientPage.tsx
'use client';

import Header from "@/components/Header";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { analyzeAndExtractAction } from "@/app/actions/analyzeAndExtractAction";

type Props = {
  user: { id: string; name?: string | null };
};

export default function ClientPage({ user }: Props) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const maxLength = 1200;

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

      router.push(`/summary/${result.id}`);
    } catch (err) {
      console.error(err);
      setError("要約・単語抽出に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  const charCountColor =
    text.length > maxLength * 0.9
      ? "text-red-500"
      : text.length > maxLength * 0.75
        ? "text-yellow-600"
        : "text-gray-500";

  return (
    <>
      <Header showMyPage />
      <main className="flex-grow bg-white px-4 py-6 md:py-12">
        <section className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">英語力を、毎日のニュースで育てよう</h2>
          <p className="text-gray-600 mt-15 mb-15 text-sm md:text-base">
            ようこそ、{user.name ?? "ユーザー"} さん！<br />
            記事本文を貼り付けるだけで、日本語の要約と単語抽出ができる語学学習ツールです。
          </p>
        </section>

        <div className="max-w-2xl mx-auto space-y-6">
          <textarea
            placeholder="ここに記事の本文を貼り付けてください…"
            className="w-full border border-gray-300 rounded px-4 py-3 h-110 text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-blue-300"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={maxLength}
          />

          {/* 文字数カウント & 注意書き */}
          <p className={`text-sm text-center ${charCountColor}`}>
            現在の文字数: {text.length} / {maxLength}
          </p>
          <p className="text-xs text-gray-500 text-center">
            ※ 最大文字数は {maxLength} 文字です。入力が多いと処理に時間がかかることがあります。
          </p>
          <p className="text-sm text-gray-500 text-center">
            ※ 有料記事や著作権で保護されたコンテンツの貼り付けはご遠慮ください。
          </p>

          <div className="flex justify-center">
            <button
              onClick={handleAnalyzeAndExtract}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "分析中..." : "要約と単語を抽出"}
            </button>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
      </main>
    </>
  );
}
