erDiagram

  ユーザー {
    int ID PK
    string 名前
    string メールアドレス
    string プロバイダー種別
    string プロバイダーUID
    datetime created_at
    datetime updated_at
  }

  記事 {
    int ID PK
    int ユーザーID FK
    string タイトル
    text 内容
    text 要約
    string 出典URL
    datetime created_at
    datetime updated_at
  }

  文 {
    int ID PK
    int 記事ID FK
    text 英文
    text 和訳
    int 並び順
    datetime created_at
    datetime updated_at
  }

  単語 {
    int ID PK
    string 単語
    text 意味
    string 品詞
    string レベル
    text 語源
    datetime created_at
    datetime updated_at
  }

  単語例文 {
    int ID PK
    int 単語ID FK
    text 英文
    text 和訳
    datetime created_at
    datetime updated_at
  }

  ユーザー単語 {
    int ID PK
    int ユーザーID FK
    int 単語ID FK
    datetime 登録日
    datetime 最終テスト日
    int 正解数
    int 不正解数
    datetime created_at
    datetime updated_at
  }

  クイズテンプレ {
    int ID PK
    int 単語ID FK
    string クイズ形式
    string 問題文  // VARCHAR(512)
    string 選択肢1
    string 選択肢2
    string 選択肢3
    string 選択肢4
    int 正解  // 1〜4
    datetime created_at
    datetime updated_at
  }

  クイズ履歴 {
    int ID PK
    int ユーザーID FK
    int クイズテンプレID FK
    int ユーザー解答
    boolean 正誤
    datetime 実施日時
    datetime created_at
    datetime updated_at
  }

  記事クイズ {
    int ID PK
    int 記事ID FK
    string 問題文  // VARCHAR(512)
    string 選択肢1
    string 選択肢2
    string 選択肢3
    int 正解  // 1〜3
    text 解説
    datetime created_at
    datetime updated_at
  }

  ユーザー ||--o{ 記事 : 投稿
  記事 ||--o{ 文 : 含む
  単語 ||--o{ 単語例文 : 例文
  単語 ||--o{ クイズテンプレ : クイズ
  単語 ||--o{ ユーザー単語 : 登録
  ユーザー ||--o{ ユーザー単語 : 単語登録
  クイズテンプレ ||--o{ クイズ履歴 : 解答
  ユーザー ||--o{ クイズ履歴 : クイズ記録
  記事 ||--o{ 記事クイズ : 理解度確認
