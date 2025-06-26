// src/components/InteractiveTranslationSection.tsx
'use client';

import { useState, useEffect } from 'react';

type WordEntry = {
    word: string;
    meaning: string;
    wordId: number;
    isRegistered: boolean;
};

type SentencePair = {
    english: string;
    japanese: string;
};

type Props = {
    original: string;
    translation: string;
    wordList: WordEntry[];
    onRegister: (word: string, meaning: string) => void;
};

export default function InteractiveTranslationSection({
    original,
    translation,
    wordList,
    onRegister,
}: Props) {
    const [localWords, setLocalWords] = useState<WordEntry[]>(wordList);
    const [selectedWord, setSelectedWord] = useState<WordEntry | null>(null);
    const [visible, setVisible] = useState<boolean[]>(
        Array(Math.min(original.length, translation.length)).fill(false)
    );

    const enSentences = original.split(/(?<=[.?!])\s+/);
    const jaSentences = translation.split(/(?<=[。！？])\s*/);

    const sentencePairs: SentencePair[] = enSentences.map((english, i) => ({
        english,
        japanese: jaSentences[i] ?? '',
    }));

    const toggle = (index: number) => {
        const copy = [...visible];
        copy[index] = !copy[index];
        setVisible(copy);
    };

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedWord(null);
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, []);

    const highlightWords = (sentence: string) => {
        const regex = new RegExp(`\\b(${localWords.map(w => w.word).join('|')})\\b`, 'gi');
        const parts = sentence.split(regex);
        return parts.map((part, idx) => {
            const word = localWords.find(w => w.word.toLowerCase() === part.toLowerCase());
            return word ? (
                <span
                    key={idx}
                    className={`underline cursor-pointer ${word.isRegistered ? 'text-red-600' : 'text-blue-600'}`}
                    onClick={() => setSelectedWord(word)}
                >
                    {part}
                </span>
            ) : (
                <span key={idx}>{part}</span>
            );
        });
    };

    const handleRegister = async (word: WordEntry) => {
        await onRegister(word.word, word.meaning);
        setLocalWords(prev =>
            prev.map(w =>
                w.word === word.word ? { ...w, isRegistered: true } : w
            )
        );
        setSelectedWord({ ...word, isRegistered: true });
    };

    return (
        <section className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">📘 英文と和訳（クリックで意味表示・登録）</h2>
            <ul className="space-y-4">
                {sentencePairs.map((pair, idx) => (
                    <li key={idx}>
                        <p className="text-gray-800">{highlightWords(pair.english)}</p>
                        <button
                            onClick={() => toggle(idx)}
                            className="text-blue-600 text-sm underline"
                        >
                            {visible[idx] ? '翻訳を隠す' : '翻訳を表示'}
                        </button>
                        {visible[idx] && <p className="mt-1 text-gray-700">{pair.japanese}</p>}
                    </li>
                ))}
            </ul>

            {selectedWord && (
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 z-40">
                    <div className="bg-white border border-gray-300 rounded-lg shadow-xl w-80 p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">{selectedWord.word}</h2>
                            <button
                                onClick={() => setSelectedWord(null)}
                                className="text-gray-400 hover:text-gray-600 text-xl"
                            >
                                ×
                            </button>
                        </div>

                        <p className="text-gray-700 mb-4">{selectedWord.meaning}</p>

                        {selectedWord.isRegistered ? (
                            <p className="text-red-600 text-sm font-semibold">✅ この単語は登録済みです</p>
                        ) : (
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                                onClick={() => handleRegister(selectedWord)}
                            >
                                ＋ 単語を登録
                            </button>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
