//src/app/quiz/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { startQuizAction } from '@/app/actions/startQuiz';

type QuizTemplate = {
  id: number;
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
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  function playSound(path: string) {
    const audio = new Audio(path);
    audio.play();
  }

  useEffect(() => {
    startQuizAction()
      .then(setQuizzes)
      .catch((e) => console.error('クイズ取得失敗:', e));
  }, []);

  useEffect(() => {
    if (!showResult || selected === null) return;
    const current = quizzes[currentIndex];
    const isCorrect = selected === current.answer;
    const soundPath = isCorrect ? '/sounds/correct.mp3' : '/sounds/incorrect.mp3';
    playSound(soundPath);
  }, [showResult]);


  if (quizzes.length === 0) return <p className="p-6">クイズがありません。</p>;

  const current = quizzes[currentIndex];
  const choices = [
    current.choice1,
    current.choice2,
    current.choice3,
    current.choice4,
  ];

  const isCorrect = selected === current.answer;

  const handleNext = () => {
    setSelected(null);
    setShowResult(false);
    setCurrentIndex((prev) => prev + 1);
  };

  return (
    <div className="p-6 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">単語クイズ</h1>

      <p className="text-lg font-semibold">{current.question}</p>

      <ul className="space-y-2">
        {choices.map((choice, i) => (
          <li key={i}>
            <button
              className={`w-full p-3 border rounded ${
                selected === i + 1
                  ? 'bg-blue-200'
                  : 'bg-white hover:bg-gray-50'
              }`}
              onClick={() => setSelected(i + 1)}
              disabled={showResult}
            >
              {choice}
            </button>
          </li>
        ))}
      </ul>

      {!showResult && (
        <button
          onClick={() => setShowResult(true)}
          disabled={selected === null}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          答え合わせ
        </button>
      )}

      {showResult && (
        <div className="space-y-4">
          <p className={`text-lg font-bold ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
            {isCorrect ? '正解！' : '不正解…'}
          </p>

          {currentIndex < quizzes.length - 1 ? (
            <button
              onClick={handleNext}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              次の問題へ
            </button>
          ) : (
            <p>すべての問題が完了しました！</p>
          )}
        </div>
      )}
    </div>
  );
}
