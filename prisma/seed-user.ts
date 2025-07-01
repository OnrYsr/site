import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('123', 10);

  await prisma.user.upsert({
    where: { email: 'onuryasar@tes.com' },
    update: {},
    create: {
      name: 'Onur Yaşar',
      email: 'onuryasar@tes.com',
      password: hashedPassword,
      role: 'USER',
    },
  });

  console.log('Test kullanıcısı eklendi!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 