'use client';

import Link from 'next/link';

export default function TopPageButtons() {
  return (
    <div className="flex justify-end gap-4 px-6 py-4">
      <Link href="/" className="text-blue-600 hover:underline">
        トップページ
      </Link>
      <Link href="/mypage" className="text-blue-600 hover:underline">
        マイページ
      </Link>
    </div>
  );
}
