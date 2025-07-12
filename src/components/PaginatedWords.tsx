//src/app/components/PaginatedWords.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';

type Props = {
  page: number;
  totalPages: number;
  query?: string;
};

export default function PaginatedWords({ page, totalPages, query }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const goToPage = (newPage: number) => {
    if (!searchParams) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(newPage));
    if (query) {
      params.set('q', query);
    }

    router.push(`/words?${params.toString()}`);
  };

  return (
    <div className="flex justify-center gap-2 mt-6">
      <button
        onClick={() => goToPage(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        ← 前へ
      </button>
      <span className="text-sm text-gray-700">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => goToPage(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-1 border rounded disabled:opacity-50"
      >
        次へ →
      </button>
    </div>
  );
}
