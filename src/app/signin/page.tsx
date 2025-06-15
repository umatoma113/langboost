// src/app/signin/page.tsx
'use client';

import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="text-center space-y-6">
        <h1 className="text-2xl font-bold">ログインが必要です</h1>
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Googleでログイン
        </button>
      </div>
    </main>
  );
}

