//src/components/InteractiveTranslationSection.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { normalizeWord } from '../../lib/normalizeWord';
import { ngslWords as ngslWordsSet } from '../../lib/ngslWords';

type WordEntry = {
    word: string;
    meaning: string;
    wordId?: number;
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
    console.log("🧪 初期 localWords.length:", wordList.length);


    const [localWords, setLocalWords] = useState<WordEntry[]>(wordList);
    const [hoveredWordKey, setHoveredWordKey] = useState<string | null>(null);
    const [popupPos, setPopupPos] = useState<{ top: number; left: number } | null>(null);
    const [hasFetchedMissing, setHasFetchedMissing] = useState(false);
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
        console.log("📘 NGSL語数（クライアント側）:", ngslWordsSet.size);
    }, []);


    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setHoveredWordKey(null);
                setPopupPos(null);
            }
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, []);

    const missing = useMemo(() => {
        return localWords.filter((w) => {
            const normalized = normalizeWord(w.word);
            return w.meaning === '意味未登録' && !ngslWordsSet.has(normalized);
        });
    }, [localWords]);

    useEffect(() => {
        if (hasFetchedMissing || missing.length === 0) return;

        const text = missing.map((w) => w.word).join(', ');

        fetch('/api/extract-words', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
        })
            .then((res) => res.json())
            .then((data) => {
                const map = new Map(
                    (data.words || []).map((w: { word: string; meaning: string }) => [
                        normalizeWord(w.word),
                        w.meaning,
                    ])
                );

                setLocalWords((prev) =>
                    prev.map((w) => {
                        const base = normalizeWord(w.word);
                        const meaning = map.get(base) as string | undefined;

                        console.log(
                            `🧪 word: "${w.word}" → base: "${base}" → meaning: ${meaning ?? "❌ 見つからない"}`
                        );

                        return meaning ? { ...w, meaning } : w;
                    })
                );
                setHasFetchedMissing(true);
            })
            .catch((err) => {
                console.error('❌ OpenAI意味取得エラー:', err);
            });
    }, [missing, hasFetchedMissing]);


    const handleMouseEnter = (
        wordKey: string,
        event: React.MouseEvent<HTMLSpanElement>,
        idx: number
    ) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setHoveredWordKey(`${wordKey}-${idx}`);
        setPopupPos({
            top: rect.top + window.scrollY - 10,
            left: rect.left + window.scrollX,
        });
    };


    const handleMouseLeave = () => {
        setHoveredWordKey(null);
        setPopupPos(null);
    };

    const handleRegister = async (target: WordEntry) => {
        if (!target.meaning || target.meaning === '意味未登録') {
            alert('意味が登録されていません。');
            return;
        }

        const normalized = normalizeWord(target.word);
        await onRegister(target.word, target.meaning);
        setLocalWords((prev) =>
            prev.map((w) =>
                normalizeWord(w.word) === normalized ? { ...w, isRegistered: true } : w
            )
        );
        setHoveredWordKey(null);
    };

    const highlightWords = (sentence: string) => {
        const words = sentence.split(/(\s+)/); // preserve spaces
        return words.map((part, idx) => {
            const trimmed = part.trim();
            if (!trimmed) {
                return <span key={idx}>{part}</span>; // 空白はそのまま描画だけ
            }

            const normalized = normalizeWord(part);
            const wordEntry = localWords.find(
                (w) => normalizeWord(w.word) === normalized
            );

            console.log("🔍 Hover word:", part, "→", normalized);
            console.log("🔍 Matching entry:", wordEntry);

            if (!wordEntry) {
                return <span key={idx}>{part}</span>;
            }

            const isHovered = hoveredWordKey === `${normalized}-${idx}`;

            return (
                <span
                    key={`${normalized}-${idx}`}
                    className={`relative underline cursor-pointer transition-colors duration-150 ${wordEntry.isRegistered ? 'text-blue-600' : 'text-gray-800'
                        }`}
                    onMouseEnter={(e) => handleMouseEnter(normalized, e, idx)}
                    onMouseLeave={handleMouseLeave}
                >
                    {part}
                    {isHovered && popupPos && (
                        <div
                            className="absolute z-50 w-72 p-4 bg-white border border-gray-300 rounded shadow-lg text-sm"
                            style={{
                                top: '100%',
                                left: '50%',
                                transform: 'translateX(-50%)',
                                marginTop: '0.5rem',
                            }}
                        >
                            <div className="font-bold text-gray-900 mb-2">{wordEntry.word}</div>
                            <div className="text-gray-700 mb-2">{wordEntry.meaning}</div>
                            {wordEntry.isRegistered ? (
                                <div className="text-blue-600 text-xs font-semibold">✅ 登録済み</div>
                            ) : (
                                <button
                                    onClick={() => handleRegister(wordEntry)}
                                    className="text-xs px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
                                >
                                    ＋ 単語を登録
                                </button>
                            )}
                        </div>
                    )}
                </span>
            );
        });
    };


    return (
        <section className="bg-gray-50 border border-gray-200 rounded-lg p-6 max-w-6xl mx-auto relative">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
                📘 英文と和訳（マウスオーバーで意味表示・登録）
            </h2>
            <ul className="space-y-4">
                {sentencePairs.map((pair, idx) => (
                    <li key={idx}>
                        <div className="text-gray-800 flex flex-wrap gap-1">
                            {highlightWords(pair.english)}
                        </div>
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
        </section>
    );
}