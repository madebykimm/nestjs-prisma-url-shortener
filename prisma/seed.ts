import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';

// initialize the Prisma Client
const prisma = new PrismaClient();
async function main() {
  // create two dummy users

  const hashedPassword = await bcrypt.hash('Password123!', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'test@kim.com' },
    update: {},
    create: {
      email: 'test@kim.com',
      name: 'test kim',
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

  const url1 = await prisma.url.upsert({
    where: { longUrl: 'http://google.com' },
    update: {},
    create: {
      title: 'google',
      longUrl: 'https://google.com',
      urlCode: 'go.gl',
      sortUrl: 'http://localhost:3000/go.gl',
      authorId: user1.id,
    },
  });

  const url2 = await prisma.url.upsert({
    where: { longUrl: 'http://facebook.com' },
    update: {},
    create: {
      title: 'facebook',
      longUrl: 'https://facebook.com',
      urlCode: 'fb',
      sortUrl: 'http://localhost:3000/fb',
      authorId: user2.id,
    },
  });

  console.log({ user1, user2, url1, url2 });
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
