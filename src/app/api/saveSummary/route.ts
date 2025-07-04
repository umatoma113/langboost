//src/app/api/saveSummary/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';
import { auth } from '../../../../lib/auth';

type SentencePair = {
  english: string;
  japanese: string;
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { articleId, sentencePairs } = body as {
      articleId: number;
      sentencePairs: SentencePair[] | null | undefined;
    };

    const session = await auth();
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.article.update({
      where: { id: articleId },
      data: {
        sentencePairs: sentencePairs ?? undefined,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ /api/saveSummary error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
