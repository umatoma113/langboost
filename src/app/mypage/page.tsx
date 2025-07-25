import { auth } from '../../../lib/auth';
import { redirect } from 'next/navigation';
import MyPageLayout from '@/components/Layouts/MyPage';
import { getMyArticles } from '@/services/user/getMyArticles';
import { getMyWords } from '@/services/user/getMyWords';
import { getMyQuizRecords } from '@/services/user/getMyQuizRecords';

export default async function MyPage() {
  const user = await auth().catch(() => null);
  if (!user) return redirect('/login');

    console.log("🧪 user.id:", user.id);

  const articles = await getMyArticles(user.id, 10);
  const words = await getMyWords(user.id, 10);
  const quizzes = await getMyQuizRecords(user.id, 5);

  return (
    <>
      <MyPageLayout
        user={user}
        articles={articles}
        words={words}
        quizzes={quizzes}
      />
    </>
  );
}
