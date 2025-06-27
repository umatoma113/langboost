// types/next-auth.d.ts
import { DefaultSession } from "next-auth";  // DefaultSessionをインポート

declare module "next-auth" {
  interface Session {
    user: {
      id: string;               // カスタムIDを追加
    } & DefaultSession['user']; // DefaultSessionのユーザープロパティを継承
  }
}
