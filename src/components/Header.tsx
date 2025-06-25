//src/components/Header.tsx
'use client';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

type HeaderProps = {
  showTopPage?: boolean;
  showMyPage?: boolean;
};

export default function Header({ showTopPage, showMyPage }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  await signOut({ callbackUrl: `${baseUrl}/signin` });
};

  return (
    <header className="flex justify-between items-center px-4 py-4 border-b">
      <h1 className="text-2xl font-bold">LangBoost</h1>
      <div className="space-x-4 text-gray-600">
        {showTopPage && (
          <button onClick={() => router.push('/')} className="hover:underline">
            トップページ
          </button>
        )}
        {showMyPage && (
          <button onClick={() => router.push('/mypage')} className="hover:underline">
            マイページ
          </button>
        )}
        <button onClick={handleLogout} className="hover:underline text-red-600">
          ログアウト
        </button>
      </div>
    </header>
  );
}
