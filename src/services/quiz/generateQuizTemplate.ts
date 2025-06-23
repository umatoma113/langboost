// services/quiz/generateQuizTemplate.ts
import { prisma } from '../../../lib/db';
import openai from '../../../lib/openai';

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export async function generateQuizTemplateForWord(wordId: number) {
  const word = await prisma.word.findUnique({
    where: { id: wordId },
  });

  if (!word) throw new Error('指定された単語が見つかりません');

  const existingQuiz = await prisma.quizTemplate.findFirst({
    where: { wordId: word.id },
  });
  if (existingQuiz) return existingQuiz;

  const systemPrompt = 'あなたは英語学習者向けのクイズを日本語で作るAIです。';
  const userPrompt = `英単語「${word.word}」の意味は「${word.meaning}」です。この単語の意味を問う4択問題を日本語で作成してください。
正解の選択肢は最初（配列の先頭）に入れてください。以下の形式の**純粋なJSON文字列のみ**で返してください（説明やコードブロック記号は不要）：
{
  "question": "...",
  "choices": ["正解", "誤答1", "誤答2", "誤答3"]
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
  });

  const json = response.choices[0].message?.content;
  if (!json) throw new Error('OpenAIからの応答が不正です');

  let parsed;
  try {
    parsed = JSON.parse(json);
  } catch (e) {
    throw new Error('OpenAIのレスポンスのパースに失敗しました');
  }

  const { question, choices } = parsed;

  if (
    !question ||
    !Array.isArray(choices) ||
    choices.length !== 4
  ) {
    throw new Error('OpenAIのレスポンス形式が不正です');
  }
  
  const shuffled = shuffleArray(choices);
  const answerIndex = shuffled.indexOf(choices[0]) + 1;

  const quiz = await prisma.quizTemplate.create({
    data: {
      wordId: word.id,
      quizType: 'meaning',
      question,
      choice1: shuffled[0],
      choice2: shuffled[1],
      choice3: shuffled[2],
      choice4: shuffled[3],
      answer: answerIndex,
    },
  });

  return quiz;
}