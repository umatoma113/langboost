//src/components/HighlightedText.tsx
'use client';

import { useState, useEffect } from 'react';

type WordEntry = {
    word: string;
    meaning: string;
    wordId: number;
    isRegistered: boolean;
};

type Props = {
    text: string;
    wordList: WordEntry[];
    onRegister: (word: string, meaning: string) => void;
};

export default function HighlightedText({ text, wordList, onRegister }: Props) {
    const [selectedWord, setSelectedWord] = useState<WordEntry | null>(null);

    // Escapeキーでモーダルを閉じる（UX改善）
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setSelectedWord(null);
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const regex = new RegExp(`\\b(${wordList.map(w => w.word).join('|')})\\b`, 'gi');
    const parts = text.split(regex);

    return (
        <div>
            <p className="whitespace-pre-wrap leading-loose">
                {parts.map((part, idx) => {
                    const word = wordList.find(w => w.word.toLowerCase() === part.toLowerCase());
                    return word ? (
                        <span
                            key={idx}
                            className="text-blue-600 underline cursor-pointer"
                            onClick={() => setSelectedWord(word)}
                        >
                            {part}
                        </span>
                    ) : (
                        <span key={idx}>{part}</span>
                    );
                })}
            </p>

            {selectedWord && (
                <div className="fixed inset-0 z-50 pointer-events-none">
                    {/* モーダル本体 */}
                    <div className="absolute top-[20%] left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg max-w-sm w-full p-6 pointer-events-auto">
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
                            <p className="text-green-600 text-sm">✅ 登録済み</p>
                        ) : (
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                                onClick={() => {
                                    onRegister(selectedWord.word, selectedWord.meaning);
                                    setSelectedWord({ ...selectedWord, isRegistered: true });
                                }}
                            >
                                ＋ 単語を登録
                            </button>
                        )}
                    </div>
                </div>
            )}

        </div>
    );
}
