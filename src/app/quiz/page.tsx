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
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-indigo-100 px-6 py-10">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-center text-indigo-600">🎯 単語クイズ</h1>

        <div className="text-lg font-semibold text-gray-800 text-center">
          {`Q${currentIndex + 1}：${current.question}`}
        </div>

        <ul className="space-y-3">
          {choices.map((choice, i) => {
            return (
              <li key={i}>
                <button
                  className={`w-full py-3 px-4 rounded-lg border transition-all duration-200 text-left text-md
                    ${showResult
                      ? current.answer === i + 1
                        ? 'bg-green-100 border-green-400 text-green-800 font-bold'
                        : 'bg-gray-100 border-gray-300 text-gray-400'
                      : 'bg-white hover:bg-indigo-50 border-gray-300'
                    }
                  `}
                  onClick={() => handleChoice(i + 1)}
                  disabled={showResult}
                >
                  {choice}
                </button>
              </li>
            );
          })}
        </ul>

        {showResult && (
          <div className="text-center space-y-4">
            <p
              className={`text-xl font-bold ${
                isCorrect ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {isCorrect ? ' 正解！ ' : ' 不正解… '}
            </p>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
            >
              {currentIndex < quizzes.length - 1 ? '次の問題へ' : '結果を見る'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
