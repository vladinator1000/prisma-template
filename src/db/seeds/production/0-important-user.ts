import { PrismaClient } from '@prisma/client'

// Runs always
// Useful for adding mandatory data that your system can't function without,
// for example currencies, locations etc.
export async function apply(prisma: PrismaClient) {
  await prisma.user.create({
    data: {
      name: 'Jeff',
    },
  })
}
