import { createNextAuthMiddleware } from "nextjs-basic-auth-middleware";

export const proxy = createNextAuthMiddleware();

export const config = {
  matcher: [
    // 静的ファイル・画像最適化・public 配下の画像は Basic 認証の対象外にする
    // （next/image の内部フェッチは認証ヘッダーを持たないため 401 になる）
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|png|webp|svg|gif|ico)$).*)",
  ],
};
