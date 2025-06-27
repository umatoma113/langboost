// src/lib/extractTextFromHtml.ts
import * as cheerio from 'cheerio';

export async function extractTextFromHtml(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("ページ取得に失敗しました");

  const html = await res.text();
  const $ = cheerio.load(html);

  // よく使われる構造を優先して抽出
  const content =
    $('article').text() ||
    $('main').text() ||
    $('body').text();

  return content.replace(/\s+/g, ' ').trim();
}
