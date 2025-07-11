// src/app/quiz/QuizClient.tsx
'use client';

import { useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitAnswerAction } from '../actions/submitAnswerAction';

type QuizTemplate = {
  id: number;
  wordId: number;
  question: string;
  choice1: string;
  choice2: string;
  choice3: string;
  choice4: string;
  answer: number;
};

export default function QuizClient({ initialQuizzes }: { initialQuizzes: QuizTemplate[] }) {
  const [quizzes] = useState(initialQuizzes);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [executedAt] = useState(() => new Date().toISOString());
  const router = useRouter();

  const correctAudio = useMemo(() => new Audio('/sounds/correct.mp3'), []);
  const incorrectAudio = useMemo(() => new Audio('/sounds/incorrect.mp3'), []);

  useEffect(() => {
    correctAudio.load();
    incorrectAudio.load();
  }, [correctAudio, incorrectAudio]);

  const current = quizzes[currentIndex];

  if (!current) {
    return (
      <div className="p-6 text-center text-gray-600 space-y-4">
        <p>現在、復習すべきクイズはありません。</p>
        <p>一度出題された単語は、一定期間経過後に再び出題されます。</p>
        <p>復習のタイミングになると、問題が表示されます。</p>
      </div>
    );
  }

  const playSound = (isCorrect: boolean) => {
    if (isCorrect) correctAudio.play();
    else incorrectAudio.play();
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
        executedAt,
      });

      playSound(correct);
    } catch (e) {
      console.error('送信エラー:', e);
    }
  };

  const handleNext = () => {
    setShowResult(false);
    setIsCorrect(null);

    if (currentIndex < quizzes.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      router.push('/quiz/result');
    }
  };

  const choices = [
    current.choice1,
    current.choice2,
    current.choice3,
    current.choice4,
  ];

  return (
    <div className="min-h-screen overflow-auto bg-gradient-to-br from-yellow-50 to-indigo-100 px-6 py-10">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-center text-indigo-600">🎯 単語クイズ</h1>

        <div className="text-lg font-semibold text-gray-800 text-center">
          {`Q${currentIndex + 1}：${current.question}`}
        </div>

        <ul className="space-y-3">
          {choices.map((choice, i) => (
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
          ))}
        </ul>

        {showResult && (
          <div className="text-center space-y-4">
            <p
              className={`text-xl font-bold ${isCorrect ? 'text-green-600' : 'text-red-500'
                }`}
            >
              {isCorrect ? '正解！' : '不正解…'}
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
