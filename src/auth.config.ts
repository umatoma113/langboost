// src/auth.config.ts
export const runtime = "nodejs";

import Google from "next-auth/providers/google";
import NextAuth from "next-auth";
import { prisma } from "../lib/db";
import type { NextAuthConfig } from "next-auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async session({ session, token }) {
      if (token?.sub && session.user) {
        session.user.id = token.sub;

        // ✅ PrismaにUserがなければ作成
        await prisma.user.upsert({
          where: { id: token.sub },
          update: {},
          create: {
            id: token.sub,
            email: session.user.email!,
            name: session.user.name ?? null,
            image: session.user.image ?? null,
          },
        });
      }
      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id || user.email || "default-id";
      }
      return token;
    },
  },
} satisfies NextAuthConfig);
