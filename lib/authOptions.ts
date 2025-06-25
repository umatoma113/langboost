// lib/authOptions.ts
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./db";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async session({ session, token }) {
      if (!token.sub || !session.user?.email) return session;

      await prisma.user.upsert({
        where: { id: token.sub },
        update: {},
        create: {
          id: token.sub,
          email: session.user.email,
          name: session.user.name ?? null,
          image: session.user.image ?? null,
        },
      });

      session.user.id = token.sub;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id || user.email || "default-id";
      }
      return token;
    },
  },
};
