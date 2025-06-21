import { auth } from '../../../lib/auth';
import { redirect } from 'next/navigation';
import MyPageLayout from '@/components/Layouts/MyPage';
import { getMyArticles } from '@/services/user/getMyArticles';
import { getMyWords } from '@/services/user/getMyWords';
import { getMyQuizRecords } from '@/services/user/getMyQuizRecords';

export default async function MyPage() {
  const user = await auth().catch(() => null);
  if (!user) return redirect('/login');

  const articles = await getMyArticles(user.id);
  const words = await getMyWords(user.id);
  const quizzes = await getMyQuizRecords(user.id);

    // console.log('🧪 user.id:', user.id);
    // console.log('🧪 articles:', articles);
    // console.log('🧪 words:', words);
    // console.log('🧪 quizzes:', quizzes);

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
