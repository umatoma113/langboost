// src/app/api/fetchMeaning/route.ts
import { prisma } from '../../../../lib/db';
import openai from '../../../../lib/openai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { baseWord } = await req.json();
  if (!baseWord) return NextResponse.json({ error: 'baseWordが必要です' }, { status: 400 });

  // 既に意味が登録されていればそれを返す
  const existing = await prisma.baseWord.findUnique({ where: { word: baseWord } });
  if (existing?.meaning) {
    return NextResponse.json({ meaning: existing.meaning });
  }

  // OpenAI で意味を取得
  const prompt = `英単語「${baseWord}」の日本語の意味を、できるだけ多義的に、辞書のような形式で一覧表示してください。可能であれば品詞も含めて、改行で区切って出力してください。`;
  const res = await openai.chat.completions.create({
    model: 'gpt-4.1-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });

  const meaning = res.choices[0]?.message?.content?.trim();
  if (!meaning) {
    return NextResponse.json({ error: '意味が取得できませんでした' }, { status: 500 });
  }

  // DBに保存（既にあれば update、なければ create）
  await prisma.baseWord.upsert({
    where: { word: baseWord },
    update: { meaning },
    create: { word: baseWord, meaning },
  });

  return NextResponse.json({ meaning });
}
