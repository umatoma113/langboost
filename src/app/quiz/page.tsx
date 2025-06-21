//src/app/quiz/page.tsx
'use client';

import { useEffect, useState } from 'react';
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
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  function playSound(path: string) {
    const audio = new Audio(path);
    audio.play();
  }

  useEffect(() => {
    startQuizAction()
      .then(setQuizzes)
      .catch((e) => console.error('クイズ取得失敗:', e));
  }, []);

  const handleSubmitAnswer = async () => {
    if (selected === null) return;

    const current = quizzes[currentIndex];
    const correct = selected === current.answer;
    setIsCorrect(correct);

    try {
      await submitAnswerAction({
        wordId: current.wordId,
        quizTemplateId: current.id,
        selectedChoice: selected,
        isCorrect: correct,
      });

      const soundPath = correct ? '/sounds/correct.mp3' : '/sounds/incorrect.mp3';
      playSound(soundPath);

      setShowResult(true);
    } catch (e) {
      console.error('結果の送信に失敗しました', e);
    }
  };

  const handleNext = () => {
    setSelected(null);
    setShowResult(false);
    setIsCorrect(null);
    setCurrentIndex((prev) => prev + 1);
  };

  if (quizzes.length === 0) return <p className="p-6">クイズがありません。</p>;

  const current = quizzes[currentIndex];
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
              className={`w-full p-3 border rounded ${selected === i + 1
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
          onClick={handleSubmitAnswer}
          disabled={selected === null}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          答え合わせ
        </button>
      )}

      {showResult && isCorrect !== null && (
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
