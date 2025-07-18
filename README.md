# LangBoost

## サービス内容

LangBoost は、英語ニュースを活用して語彙力を強化するための語学学習支援サービスです。

- ニュース記事のURLまたは本文を入力すると、日本語要約と単語リストを自動生成。
- NGSL（New General Service List）に基づいた単語レベルの色分けと意味表示。
- 自分だけの単語帳を作成し、クイズで復習が可能。
- Leitner システムを活用した効率的な復習アルゴリズム。
- 多読支援（原文内で単語ホバー辞書・意味登録・右クリックで保存）など、学習者の習慣化を支援。

---

## 公開デモ

以下のURLからアプリの動作をご確認いただけます（APIキー含めて動作する構成です）：

🔗 https://langboost.vercel.app/

このアプリは BASIC 認証を設定しており、**ユーザー名とパスワードが必要**です。

---

## 環境

### [ローカル環境]

- Node.js v20.x
- npm v10.x
- Next.js v15.x（App Router）
- TypeScript
- Prisma + Supabase（PostgreSQL）
- Tailwind CSS
- OpenAI API（要環境変数設定）

### [主な外部ツール・ライブラリ]

- Supabase: 認証・DB・ストレージ管理
- Prisma ORM: データベーススキーマ管理と型安全な操作
- OpenAI API: 翻訳・意味生成処理
- cheerio: URL貼り付け時のHTML解析
- nextjs-toploader: ページ遷移時のローディングバー
- DiQt: NGSL/TSL/BSL の語彙・意味データ（CC BY-SA 4.0 ライセンス）

---

## 開発環境の構築方法

```bash
# リポジトリをクローン
git clone https://github.com/umatoma113/langboost.git
cd langboost

# 依存関係のインストール
npm install

# .env.local を作成して以下の環境変数を設定
cp .env.example .env.local
