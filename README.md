# LangBoost

## サービス内容

LangBoost は、英語ニュースを活用して語彙力を強化するための語学学習支援サービスです。

- ニュース記事のURLまたは本文を入力すると、日本語要約と単語リストを自動生成。
- **NGSL（New General Service List）※1** に基づいた単語レベルの色分けと意味表示。
- 自分だけの単語帳を作成し、クイズで復習が可能。
- **Leitner システム※2** を活用した効率的な復習アルゴリズム。
- 多読支援（原文内で単語ホバー辞書・意味登録・右クリックで保存）など、学習者の習慣化を支援。

---

### ※1 NGSLとは？

**NGSL（New General Service List）** とは、英語学習における高頻度語彙を約2800語に絞った語彙リストです。  
日常英語の約90%以上をカバーできるとされ、英語学習初中級者にとって最も効率の良い語彙習得指標の一つです。

LangBoostではこのリストを活用し、重要語を青色で表示・意味をポップアップ表示することで学習を効率化します。

---

### ※2 Leitnerシステムとは？

**Leitner（ライトナー）システム** は、記憶の定着を高めるための反復学習アルゴリズムです。  
問題に正解すると復習間隔が長くなり、不正解だとすぐに再出題されるよう設計されています。

LangBoostではこの仕組みに基づき、単語ごとの復習タイミングを自動で調整し、ユーザーの記憶に残りやすい最適なタイミングで復習クイズを出題します。

---


## 公開デモ

以下のURLからアプリの動作をご確認いただけます（APIキー含めて動作する構成です）：

🔗 https://langboost.vercel.app/

このアプリは BASIC 認証を設定しており、管理者から提供される**ユーザー名とパスワードが必要**です。

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
- nextjs-toploader: ページ遷移時のローディングバー
- DiQt: NGSL/TSL/BSL の語彙・意味データ（CC BY-SA 4.0 ライセンス）

---

## 設計書（別ファイル）

詳細なアーキテクチャ図・ER図・画面遷移図などは以下をご参照ください。

▶ [設計書（architecture.md）を開く](docs/architecture.md)


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

### [.env.local の設定例]

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://user:password@db.supabase.co:5432/dbname
OPENAI_API_KEY=sk-xxxx
