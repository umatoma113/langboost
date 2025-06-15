// lib/auth.ts
import { auth as baseAuth } from "@/auth.config";

type AuthUser = {
  id: string;
  name?: string | null;
};

export async function auth(): Promise<AuthUser> {
  const session = await baseAuth();

  if (!session?.user?.id) {
    throw new Error("認証が必要です");
  }

  return {
    id: session.user.id, // この時点で undefined なら throw される
    name: session.user.name,
  };
}
