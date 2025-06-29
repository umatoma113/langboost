import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import TopLoader from "@/components/TopLoader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LangBoost",
  description: "英語学習をサポートするアプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <TopLoader />
          <div className="min-h-screen flex flex-col">
            <main className="flex-grow">
              {children}
            </main>
            <footer className="text-center text-xs text-gray-500 py-6 border-t bg-white">
              <div className="mb-2">
                出典：<br />
                New General Service List by Browne, C. and Culligan, B.<br />
                Tanaka Corpus<br />
                DiQt Editors
              </div>
              <div className="mb-2">
                提供：
                <a
                  href="https://www.diqt.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-600"
                >
                  DiQt
                </a>
              </div>
              <div>
                ライセンス：
                <a
                  href="https://creativecommons.org/licenses/by-sa/4.0/deed.ja"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-600"
                >
                  CC BY-SA 4.0
                </a>
              </div>
            </footer>

          </div>
        </Providers>
      </body>
    </html>
  );
}
