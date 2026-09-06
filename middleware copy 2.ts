import { auth } from '@/auth';

export default auth;

export const config = {
  // 認証やCookie付与を適用するパス
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
