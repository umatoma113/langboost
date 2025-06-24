// src/app/signin/page.tsx
'use client';

import { signIn } from "next-auth/react";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white via-blue-50 to-white px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">ログインが必要です</h1>
        <button
          onClick={() => signIn("google")}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 w-full"
        >
          Googleでログイン
        </button>
      </div>
    </main>
  );
}
