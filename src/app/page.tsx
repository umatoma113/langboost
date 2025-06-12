'use client';

import Header from "@/components/Header";
import {Button} from '@heroui/button'; 
import { openai } from "../../lib/openai";

export default function Page() {
  return (
    <>
    <Header showMyPage />
  
    <main className="min-h-screen bg-white px-4 py-6 md:py-12">
      {/* 見出し */}
      <section className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">英語力を、毎日のニュースで</h2>
        <h2 className="text-3xl font-bold text-gray-900 mt-2">育てよう</h2>
        <p className="text-gray-600 mt-4">
          記事URLや文章を貼るだけで、日本語の要約と翻訳ができる語学学習ツール。
        </p>
      </section>

      {/* 入力エリア */}
      <div className="max-w-2xl mx-auto mt-12 space-y-6">
        <input
          type="text"
          placeholder="https://example.com/news..."
          className="w-full border border-gray-300 rounded px-4 py-3 text-gray-700 placeholder-gray-400"
        />

        <div className="text-center text-sm text-gray-500">または</div>

        <textarea
          placeholder="ここに記事の本文を貼り付けてください…"
          className="w-full border border-gray-300 rounded px-4 py-3 h-60 text-gray-700 placeholder-gray-400"
        />

        <div className="text-center">
          <button className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
            スタート
          </button>
        </div>

        {/* HeroUI */}
        <div className="text-center mt-6">
          <Button color="primary" className="focus:ring-0 focus:outline-none">
            Button
          </Button>
        </div>
      </div>
    </main>
    </>
  );
}

