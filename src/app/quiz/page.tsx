//src/app/quiz/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { startQuizAction } from '@/app/actions/startQuiz';
import { submitAnswerAction } from '../actions/submitAnswerAction';

type QuizTemplate = {
  id: number;
  wordId: number;
  question: string;
  choice1: string;
  choice2: string;
  choice3: string;
  choice4: string;
  answer: number; // 1〜4
};

export default function QuizPage() {
  const [quizzes, setQuizzes] = useState<QuizTemplate[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false); // 🔧 追加
  const router = useRouter();

  useEffect(() => {
    setMounted(true); // 🔧 マウント検知
    startQuizAction()
      .then(setQuizzes)
      .catch((e) => console.error('クイズ取得失敗:', e));
  }, []);

  const current = quizzes[currentIndex];

  const playSound = (path: string) => {
    const audio = new Audio(path);
    audio.play();
  };

  const handleChoice = async (choiceNumber: number) => {
    if (!current || showResult) return;

    const correct = choiceNumber === current.answer;
    setIsCorrect(correct);
    setShowResult(true);

    try {
      await submitAnswerAction({
        wordId: current.wordId,
        quizTemplateId: current.id,
        selectedChoice: choiceNumber,
        isCorrect: correct,
      });

      const soundPath = correct ? '/sounds/correct.mp3' : '/sounds/incorrect.mp3';
      playSound(soundPath);
    } catch (e) {
      console.error('送信エラー:', e);
    }
  };

  const handleNext = () => {
    setShowResult(false);
    setIsCorrect(null);

    if (currentIndex < quizzes.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      router.push('/quiz/result');
    }
  };

  if (!mounted) return null;
  if (quizzes.length === 0) return <p className="p-6">クイズがありません。</p>;

  const choices = [
    current.choice1,
    current.choice2,
    current.choice3,
    current.choice4,
  ];

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">単語クイズ</h1>
      <p className="text-lg font-semibold">{current.question}</p>

      <ul className="space-y-2">
        {choices.map((choice, i) => (
          <li key={i}>
            <button
              className={`w-full p-3 border rounded ${showResult && current.answer === i + 1
                ? 'bg-green-100'
                : showResult
                  ? 'opacity-50'
                  : 'bg-white hover:bg-gray-50'
                }`}
              onClick={() => handleChoice(i + 1)}
              disabled={showResult}
            >
              {choice}
            </button>
          </li>
        ))}
      </ul>

      {showResult && isCorrect !== null && (
        <div className="space-y-4">
          <p
            className={`text-lg font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'
              }`}
          >
            {isCorrect ? '正解！' : '不正解…'}
          </p>
          <button
            onClick={handleNext}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {currentIndex < quizzes.length - 1 ? '次の問題へ' : '結果を見る'}
          </button>
        </div>
      )}
    </div>
  );
}
