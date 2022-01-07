import path from 'path'
import { prisma } from '../../prisma'
import {
  applySeeds,
  parseSeedsWithHistory,
  printSeedingResults,
} from './applySeeds/applySeeds'

export type SeedEnvironment = 'development' | 'production'
export function getSeedDirectory(environment: SeedEnvironment): string {
  return path.join(process.cwd(), 'src/db/seeds', environment)
}

export async function applyProdSeeds() {
  const prodSeedsDirectory = getSeedDirectory('production')
  const prodSeeds = await parseSeedsWithHistory(prisma, prodSeedsDirectory)

  const prodResult = await applySeeds(prisma, prodSeeds)
  printSeedingResults('production', prodResult)
}
