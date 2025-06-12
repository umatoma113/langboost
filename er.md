model User {
  id              Int             @id @default(autoincrement())
  name            String
  email           String
  providerType    String
  providerUid     String
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  articles        Article[]
  userWords       UserWord[]
  quizHistories   QuizHistory[]
}

model Article {
  id              Int             @id @default(autoincrement())
  userId          Int
  title           String
  content         String
  summary         String
  sourceUrl       String
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  user            User            @relation(fields: [userId], references: [id])
  sentences       Sentence[]
  articleQuizzes  ArticleQuiz[]
}

model Sentence {
  id              Int             @id @default(autoincrement())
  articleId       Int
  english         String
  japanese        String
  order           Int
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  article         Article         @relation(fields: [articleId], references: [id])
}

model Word {
  id              Int             @id @default(autoincrement())
  word            String
  meaning         String
  partOfSpeech    String
  level           String
  etymology       String
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  wordExamples    WordExample[]
  quizTemplates   QuizTemplate[]
  userWords       UserWord[]
}

model WordExample {
  id              Int             @id @default(autoincrement())
  wordId          Int
  english         String
  japanese        String
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  word            Word            @relation(fields: [wordId], references: [id])
}

model UserWord {
  id              Int             @id @default(autoincrement())
  userId          Int
  wordId          Int
  registeredAt    DateTime
  lastTestedAt    DateTime
  correctCount    Int
  incorrectCount  Int
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  user            User            @relation(fields: [userId], references: [id])
  word            Word            @relation(fields: [wordId], references: [id])
}

model QuizTemplate {
  id              Int             @id @default(autoincrement())
  wordId          Int
  quizType        String
  question        String          @db.VarChar(512)
  choice1         String
  choice2         String
  choice3         String
  choice4         String
  answer          Int
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  word            Word            @relation(fields: [wordId], references: [id])
  quizHistories   QuizHistory[]
}

model QuizHistory {
  id                  Int         @id @default(autoincrement())
  userId              Int
  quizTemplateId      Int
  userAnswer          Int
  isCorrect           Boolean
  executedAt          DateTime
  createdAt           DateTime    @default(now())
  updatedAt           DateTime    @updatedAt

  user                User        @relation(fields: [userId], references: [id])
  quizTemplate        QuizTemplate @relation(fields: [quizTemplateId], references: [id])
}

model ArticleQuiz {
  id              Int             @id @default(autoincrement())
  articleId       Int
  question        String          @db.VarChar(512)
  choice1         String
  choice2         String
  choice3         String
  answer          Int
  explanation     String
  createdAt       DateTime        @default(now())
  updatedAt       DateTime        @updatedAt

  article         Article         @relation(fields: [articleId], references: [id])
}


<!-- 
model Sentence {
  id              Int      @id @default(autoincrement())
  articleId       Int
  english         String   @db.Text
  japanese        String   @db.Text
  order           Int
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  article         Article  @relation(fields: [articleId], references: [id])
}

model Word {
  id              Int      @id @default(autoincrement())
  word            String   @db.VarChar(255)
  meaning         String   @db.Text
  partOfSpeech String? @db.VarChar(100)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  wordExamples    WordExample[]
  quizTemplates   QuizTemplate[]
  userWords       UserWord[]
}

model WordExample {
  id              Int      @id @default(autoincrement())
  wordId          Int
  english         String   @db.Text
  japanese        String   @db.Text
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  word            Word     @relation(fields: [wordId], references: [id])
}

model UserWord {
  id              Int      @id @default(autoincrement())
  userId          Int
  wordId          Int
  registeredAt    DateTime
  lastTestedAt    DateTime
  correctCount    Int
  incorrectCount  Int
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user            User     @relation(fields: [userId], references: [id])
  word            Word     @relation(fields: [wordId], references: [id])
}

model QuizTemplate {
  id              Int      @id @default(autoincrement())
  wordId          Int
  quizType        String   @db.VarChar(50)
  question        String   @db.VarChar(512)
  choice1         String   @db.VarChar(255)
  choice2         String   @db.VarChar(255)
  choice3         String   @db.VarChar(255)
  choice4         String   @db.VarChar(255)
  answer          Int
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  word            Word     @relation(fields: [wordId], references: [id])
  quizHistories   QuizHistory[]
}

model QuizHistory {
  id                  Int          @id @default(autoincrement())
  userId              Int
  quizTemplateId      Int
  userAnswer          Int
  isCorrect           Boolean
  executedAt          DateTime
  createdAt           DateTime     @default(now())
  updatedAt           DateTime     @updatedAt

  user                User         @relation(fields: [userId], references: [id])
  quizTemplate        QuizTemplate @relation(fields: [quizTemplateId], references: [id])
}

model ArticleQuiz {
  id              Int      @id @default(autoincrement())
  articleId       Int
  question        String   @db.VarChar(512)
  choice1         String   @db.VarChar(255)
  choice2         String   @db.VarChar(255)
  choice3         String   @db.VarChar(255)
  answer          Int
  explanation     String   @db.Text
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  article         Article  @relation(fields: [articleId], references: [id])
}
 -->
