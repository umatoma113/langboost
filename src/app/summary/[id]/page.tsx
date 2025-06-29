// src/app/summary/[id]/page.tsx
import QuizSection from '@/components/QuizSection';
import TopPageButtons from '@/components/TopPageButtons';
import InteractiveTranslationSection from '@/components/InteractiveTranslationSection';
import { getArticleById } from '@/services/article';
import { getMyRegisteredBaseForms } from '@/services/user/getMyRegisteredBaseForms';
import { auth } from '../../../../lib/auth';
import { notFound } from 'next/navigation';
import { registerWordAction } from '@/app/actions/registerWord';
import { normalizeWord } from '../../../../lib/normalizeWord';
import { prisma } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  console.time('summaryPage: 全体処理');

  console.time('summaryPage: paramsの取得');
  const { id } = await params;
  console.timeEnd('summaryPage: paramsの取得');

  if (!id || isNaN(Number(id))) return notFound();
  const articleId = Number(id);

  console.time('summaryPage: getArticleById');
  let article;
  try {
    article = await getArticleById(articleId);
  } finally {
    console.timeEnd('summaryPage: getArticleById');
  }
  if (!article) return notFound();

  console.time('summaryPage: auth');
  let user;
  try {
    user = await auth();
  } finally {
    console.timeEnd('summaryPage: auth');
  }

  const userId = user?.id;

  console.time('summaryPage: getMyRegisteredBaseForms');
  let registeredBaseForms;
  try {
    registeredBaseForms = userId ? await getMyRegisteredBaseForms(userId) : [];
  } finally {
    console.timeEnd('summaryPage: getMyRegisteredBaseForms');
  }

  const words = article.words as { id: number; word: string; meaning: string }[];

  console.time('summaryPage: 文章のトークン化と基本形への変換');
  const tokens = article.content.split(/\s+/);
  const baseFormSet = new Set(tokens.map(normalizeWord));
  console.timeEnd('summaryPage: 文章のトークン化と基本形への変換');

  const ignoredWords = new Set([
    'i', 'you', 'he', 'she', 'it', 'we', 'they',
    'me', 'him', 'her', 'us', 'them',
    'a', 'an', 'the', 'this', 'that', 'these', 'those',
    'to', 'of', 'in', 'on', 'at', 'for', 'with',
    'and', 'or', 'but', 'so', 'because', 'if', 'then',
  ]);

  console.time('summaryPage: baseWord取得');
  let baseWords;
  try {
    const baseForms = [...baseFormSet];
    baseWords = await prisma.baseWord.findMany({
      where: {
        word: { in: baseForms },
        isFunctionWord: false,
      },
    });
  } finally {
    console.timeEnd('summaryPage: baseWord取得');
  }

  const baseWordMap = new Map(baseWords.map(b => [b.word, b.meaning]));

  console.time('summaryPage: wordList生成');
  const wordList = Array.from(baseFormSet).map(base => {
    if (ignoredWords.has(base)) return null;

    const matched = words.find(w => normalizeWord(w.word) === base);
    const original = tokens.find(t => normalizeWord(t) === base) ?? base;
    const fallbackMeaning = baseWordMap.get(base);

    return {
      word: original,
      meaning: matched?.meaning ?? fallbackMeaning ?? '意味未登録',
      wordId: matched?.id ?? 0,
      isRegistered: registeredBaseForms.includes(base),
    };
  });
  console.timeEnd('summaryPage: wordList生成');

  console.time('summaryPage: null除外');
  const filteredWordList = wordList.filter((w): w is Exclude<typeof w, null> => w !== null);
  console.timeEnd('summaryPage: null除外');

  console.timeEnd('summaryPage: 全体処理');

  return (
    <>
      <TopPageButtons />
      <main className="flex-grow bg-white px-6 py-10 space-y-10">
        <h1 className="text-3xl font-bold text-center text-gray-900">翻訳・要約ページ</h1>

        <section className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">📝 要約</h2>
          <p className="whitespace-pre-wrap text-gray-800">{article.summary}</p>
        </section>

        <InteractiveTranslationSection
          original={article.content}
          translation={article.translation ?? ''}
          wordList={filteredWordList}
          onRegister={async (word, meaning) => {
            'use server';
            await registerWordAction(word, meaning);
          }}
        />

        {article.quiz && <QuizSection quiz={article.quiz} />}
      </main>
    </>
  );
}
