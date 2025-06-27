// lib/auth.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "./authOptions";
import type { Session } from "next-auth"; 

type AuthUser = {
  id: string;
  name?: string | null;
};

export async function auth(): Promise<AuthUser> {
  const session: Session | null = await getServerSession(authOptions); 

  if (!session?.user?.id) {
    throw new Error("認証が必要です");
  }

  return {
    id: session.user.id,
    name: session.user.name,
  };
}
