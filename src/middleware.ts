import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');

  // APIルートはスキップ（NextAuthログインなどに必要）
  if (req.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // ローカル環境ではスキップ
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.next();
  }

  // 認証チェック
  if (basicAuth) {
    const auth = basicAuth.split(' ')[1];
    const [user, pwd] = Buffer.from(auth, 'base64').toString().split(':');

    if (
      user === process.env.BASIC_AUTH_USER &&
      pwd === process.env.BASIC_AUTH_PASSWORD
    ) {
      return NextResponse.next();
    }
  }

  // 認証失敗
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}

// Basic認証をかけたいルートのみに限定
export const config = {
  matcher: ['/', '/mypage', '/summary/:path*', '/quiz', '/quiz/:path*'],
};
