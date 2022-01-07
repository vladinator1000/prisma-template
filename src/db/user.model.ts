import { User } from '@prisma/client'
import { prisma } from './prisma'

// Example used in integration test
export function getById(id: number): Promise<User | null> {
  return prisma.user.findFirst({ where: { id } })
}

export function create(name: string): Promise<User> {
  return prisma.user.create({ data: { name } })
}
