//src/components/QuizSection.tsx
'use client';

import { useState } from 'react';

type Props = {
  quiz: {
    question: string;
    choice1: string;
    choice2: string;
    choice3: string;
    choice4: string;
    answer: number;
    explanation: string;
  };
};

export default function QuizSection({ quiz }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  const isCorrect = selected === quiz.answer;

  const choices = [
    quiz.choice1,
    quiz.choice2,
    quiz.choice3,
    quiz.choice4,
  ];

  return (
    <section className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-black text-center">🧠 理解度チェック</h2>

      <p className="text-lg font-medium text-black mb-4">{quiz.question}</p>

      <ul className="space-y-2">
        {choices.map((choice, idx) => (
          <li key={idx}>
            <button
              onClick={() => setSelected(idx + 1)}
              className={`w-full text-left px-4 py-2 border rounded text-black
                ${selected === idx + 1
                  ? (isCorrect ? 'bg-green-200 border-green-400' : 'bg-red-200 border-red-400')
                  : 'bg-white hover:bg-gray-50'}
              `}
            >
              {idx + 1}. {choice}
            </button>
          </li>
        ))}
      </ul>

      {selected && (
        <div className="mt-4 text-sm text-black">
          <p className="font-semibold">
            {isCorrect ? '✅ 正解！' : '❌ 不正解'}
          </p>
          <p className="mt-1">{quiz.explanation}</p>
        </div>
      )}
    </section>
  );
}

