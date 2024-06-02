import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

// initialize the Prisma Client
const prisma = new PrismaClient();
async function main() {
  // create two dummy users

  const hashedPassword = await bcrypt.hash('Password123!', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'sabin@adams.com' },
    update: {},
    create: {
      email: 'sabin@adams.com',
      name: 'Sabin Adams',
      password: hashedPassword,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'test@test.com' },
    update: {},
    create: {
      email: 'test@test.com',
      name: 'Alex Ruheni',
      password: hashedPassword,
    },
  });

  console.log({ user1, user2 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close the Prisma Client at the end
    await prisma.$disconnect();
  });
