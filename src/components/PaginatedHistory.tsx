'use client';

import { useRouter } from 'next/navigation';

type Props = {
  page: number;
  totalPages: number;
};

export default function PaginatedHistory({ page, totalPages }: Props) {
  const router = useRouter();

  const handlePageChange = (newPage: number) => {
    const url = new URL(window.location.href);
    url.searchParams.set('page', String(newPage));
    window.location.href = url.toString(); // ページ更新
  };

  return (
    <div className="flex justify-center mt-8 space-x-2">
      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        前へ
      </button>
      <span className="px-4 py-1 text-sm text-gray-700">
        {page} / {totalPages}
      </span>
      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={page >= totalPages}
        className="px-3 py-1 text-sm rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
      >
        次へ
      </button>
    </div>
  );
}
