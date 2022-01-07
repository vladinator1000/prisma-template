import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

import { PrismaClient, PrismaSeed } from '@prisma/client'
import { Seed } from '../../seed'
import { SEED_TABLE } from '../constants'
import { SeedEnvironment } from '..'

export async function parseSeeds(
  folderPath: string,
  excludeFileNames?: string[],
): Promise<Seed[]> {
  if (!fs.existsSync(folderPath)) {
    return []
  }

  const fileNamesAndPaths = fs
    .readdirSync(folderPath)
    .filter((fileName) => {
      const isInExcludeList = excludeFileNames?.includes(fileName)
      const filePath = path.join(folderPath, fileName)
      const isFile = fs.lstatSync(filePath).isFile()

      return !isInExcludeList && isFile
    })
    .map((fileName) => [fileName, path.join(folderPath, fileName)])

  const seeds: Seed[] = []

  for (const [name, path] of fileNamesAndPaths) {
    const module = await import(path)

    seeds.push({
      name,
      apply: module.apply,
    })
  }

  return seeds
}

export async function parseSeedsWithHistory(
  prisma: PrismaClient,
  folderPath: string,
): Promise<Seed[]> {
  const historyRows = await getSeedHistory(prisma)
  const historySeedNames = historyRows.map((row) => row.name)

  return parseSeeds(folderPath, historySeedNames)
}

interface ApplySeedsOutput {
  appliedSeeds: string[]
}

export async function applySeeds(
  prisma: PrismaClient,
  seeds: Seed[],
): Promise<ApplySeedsOutput> {
  const appliedSeeds: string[] = []

  for await (const seed of seeds) {
    await seed.apply(prisma)

    await prisma.$executeRawUnsafe(`
      INSERT INTO ${SEED_TABLE} (id, name)
      VALUES ('${randomUUID()}', '${seed.name}')  
    `)

    appliedSeeds.push(seed.name)
  }

  return {
    appliedSeeds,
  }
}

export async function getSeedHistory(prisma: PrismaClient) {
  return prisma.$queryRawUnsafe<PrismaSeed[]>(`
    SELECT * FROM ${SEED_TABLE}
  `)
}

export function printSeedingResults(
  environment: SeedEnvironment,
  seedApplicationOutput: ApplySeedsOutput,
) {
  const { appliedSeeds } = seedApplicationOutput

  if (appliedSeeds.length > 0) {
    console.info(
      `\nApplied ${environment} seeds:\n`,
      seedApplicationOutput.appliedSeeds,
    )
  }
}
