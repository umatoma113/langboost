// lib/authOptions.ts
import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./db";

export const authOptions: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login", // カスタムログインページ
  },
  callbacks: {
    async session({ session, token }) {
      if (!token.sub || !session.user?.email) return session;

      // ✅ PrismaにUserがなければ自動作成
      await prisma.user.upsert({
        where: { id: token.sub },
        update: {},
        create: {
          id: token.sub,
          email: session.user.email,
          name: session.user.name || null,
          image: session.user.image || null,
        },
      });

      // ✅ session.id を追加（サーバーアクションなどで使うため）
      session.user.id = token.sub;

      return session;
    },
  },
};
