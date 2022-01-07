import { PrismaClient } from '@prisma/client'

// Runs when process.NODE_ENV !== 'production'
// Useful when you want to add local testing data
export async function apply(prisma: PrismaClient) {
  await prisma.user.create({
    data: {
      name: 'Meff',
    },
  })
}
