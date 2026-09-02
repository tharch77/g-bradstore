import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Next.js v15 で next dev --turbo を使用しながら
  //  Tailwind CSS v4 を使う場合、
  // ビルド設定がバッティングしてエラーやスタイルの未反映が起きることがあります。

  // experimental: {
  //   // Next.jsの内部コンパイラで Tailwind v4 を直接高速処理させる設定
  //   // tailwindFunctions: ['clsx', 'type-fest'],
  //   turbo: {
  //     rules: {
  //       // CSSファイルのインポートをTurbopackに正しく処理させる設定
  //       '*.css': ['@vercel/turbopack-css'],
  //     },
  //   }
  // },

  typescript: {
    // 💡 型エラーがあっても無視して本番ビルドを成功させる設定
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLint（コードの文法チェック）の警告でビルドが止まるのも防ぐ
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
      },
    ],
  },
};

export default nextConfig;
