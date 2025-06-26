// src/components/HighlightedTextWrapper.tsx
'use client';

import HighlightedText from './HighlightedText';
import { registerWordAction } from '@/app/actions/registerWord';

type WordEntry = {
  word: string;
  meaning: string;
  wordId: number;
  isRegistered: boolean;
};

type Props = {
  text: string;
  wordList: WordEntry[];
};

export default function HighlightedTextWrapper({ text, wordList }: Props) {
  return (
    <HighlightedText
      text={text}
      wordList={wordList}
      onRegister={async (word, meaning) => {
        await registerWordAction(word, meaning);
      }}
    />
  );
}
