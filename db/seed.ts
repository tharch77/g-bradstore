import { PrismaClient } from '@prisma/client';
import sampleData from './sample-data';
import { hash } from '@/lib/encrypt';

// 一時的なデバッグコード：何の環境変数が空かチェック
// console.log('--- 環境変数チェック ---');
// console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET);
// console.log('APP_SECRET:', process.env.APP_SECRET);
// console.log('JWT_SECRET:', process.env.JWT_SECRET);
// console.log('ENCRYPTION_KEY:', process.env.ENCRYPTION_KEY);
// console.log('------------------------');

async function main() {
  const prisma = new PrismaClient();
  await prisma.product.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.user.deleteMany();

  await prisma.product.createMany({ data: sampleData.products });

  const users = [];
  for (let i = 0; i < sampleData.users.length; i++) {
    users.push({
      ...sampleData.users[i],
      password: await hash(sampleData.users[i].password),
    });
    console.log(
      sampleData.users[i].password,
      await hash(sampleData.users[i].password)
    );
  }
  await prisma.user.createMany({ data: users });

  console.log('Database seeded successfully!');
}

main();
