// src/components/WordsListClient.tsx
'use client';

import { useTransition } from 'react';
import { deleteWordAction } from '@/app/actions/deleteWord';
import DeleteButton from '@/components/DeleteButton';
import { useRouter } from 'next/navigation';

type Props = {
  words: {
    word: {
      id: number;
      word: string;
      meaning: string;
    };
  }[];
};

export default function WordsListClient({ words }: Props) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  return (
    <ul className="space-y-4">
      {words.map((entry) => (
        <li
          key={entry.word.id}
          className="p-4 bg-white shadow rounded flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{entry.word.word}</p>
            <p className="text-sm text-gray-500">{entry.word.meaning}</p>
          </div>
          <DeleteButton
            id={entry.word.id}
            onDelete={async (id) => {
              startTransition(async () => {
                await deleteWordAction(id);
                router.refresh();
              });
            }}
          />
        </li>
      ))}
    </ul>
  );
}
