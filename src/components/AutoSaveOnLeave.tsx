//src/components/AutoSaveOnLeave.tsx
'use client';

import { useEffect } from 'react';

type SentencePair = {
  english: string;
  japanese: string;
};

type Props = {
  articleId: number;
  sentencePairs: SentencePair[];
};

export default function AutoSaveOnLeave({ articleId, sentencePairs }: Props) {
  useEffect(() => {
    const handleBeforeUnload = () => {
        console.log("💾 AutoSave payload:", { articleId, sentencePairs });
      const payload = JSON.stringify({
        articleId,
        sentencePairs,
      });

      // データをサーバに送信（非同期）
      navigator.sendBeacon('/api/saveSummary', payload);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [articleId, sentencePairs]);

  return null; // UIはない
}
