import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { prisma } from '../prisma'
import { getSeedDirectory } from './utils'
import {
  applySeeds,
  parseSeedsWithHistory,
  printSeedingResults,
} from './utils/applySeeds/applySeeds'

export interface Seed {
  name: string
  apply: (prisma: PrismaClient) => Promise<any>
}

dotenv.config()

async function main() {
  const prodSeedsDirectory = getSeedDirectory('production')
  const prodSeeds = await parseSeedsWithHistory(prisma, prodSeedsDirectory)

  const prodResult = await applySeeds(prisma, prodSeeds)
  printSeedingResults('production', prodResult)

  // Skip this in CI for faster runs
  if (
    process.env.NODE_ENV !== 'production' &&
    !Boolean(process.env.SKIP_DEV_SEED)
  ) {
    const devSeedsDirectory = getSeedDirectory('development')
    const devSeeds = await parseSeedsWithHistory(prisma, devSeedsDirectory)

    const devResult = await applySeeds(prisma, devSeeds)
    printSeedingResults('development', devResult)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    process.exit(0)
  })
