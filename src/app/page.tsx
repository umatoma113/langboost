// src/app/page.tsx
import { redirect } from "next/navigation";
import { auth } from "../../lib/auth";
import ClientPage from "@/components/ClientPage";

export default async function Page() {
  try {
    const user = await auth();
    return <ClientPage user={user} />;
  } catch {
    // 未ログイン → ログインページへリダイレクト
    redirect("/signin"); // 任意のサインインページに変更可能
  }
}
