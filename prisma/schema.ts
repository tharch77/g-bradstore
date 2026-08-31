import { PrismaClient } from '@prisma/client';

// インスタンス管理用（開発時のホットリロード対策）
const prismaClientSingleton = () => new PrismaClient();

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prismaInstance = globalThis.prismaGlobal ?? prismaClientSingleton();

// 型定義と拡張処理（価格・評価の変換）
export const prisma = prismaInstance.$extends({
  result: {
    product: {
      price: {
        needs: { price: true },
        compute: (p) => p.price.toString(),
      },
      rating: {
        needs: { rating: true },
        compute: (p) => p.rating.toString(),
      },
    },
  },
});

// 開発環境のみグローバルに保存
if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prismaInstance;
