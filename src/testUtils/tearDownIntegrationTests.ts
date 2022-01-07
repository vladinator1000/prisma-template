import { prisma } from '../db/prisma'

export async function closeDbConnection() {
  await prisma.$disconnect()
}

export default closeDbConnection
