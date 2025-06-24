'use client';

import { useRouter } from 'next/navigation';

export default function TopPageButtons() {
  const router = useRouter();

  return (
    <div className="flex justify-end gap-4 px-6 py-4">
      <button
        onClick={() => router.push('/')}
        className="text-blue-600 hover:underline"
      >
        トップページ
      </button>
      <button
        onClick={() => router.push('/mypage')}
        className="text-blue-600 hover:underline"
      >
        マイページ
      </button>
    </div>
  );
}
