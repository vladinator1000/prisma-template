import path from 'path'
import fs from 'fs'
import { prisma } from '../../../prisma'
import { Seed } from '../../seed'
import { SEED_TABLE } from '../constants'
import {
  applySeeds,
  getSeedHistory,
  parseSeeds,
  parseSeedsWithHistory,
} from './applySeeds'

describe('Apply seeds', () => {
  const folderPath = path.join(__dirname, './fixtures')

  describe('parse seeds', () => {
    test('loads seeds from the filesystem ', async () => {
      const seeds = await parseSeeds(folderPath, [])
      const seedNames = seeds.map((seed) => seed.name)
      expect(seedNames).toEqual(['1-hello.ts', '2-world.ts'])
    })

    test('should not load seeds that are already in history', async () => {
      const seeds = await parseSeeds(folderPath, ['1-hello.ts'])
      const seedNames = seeds.map((seed) => seed.name)
      expect(seedNames).toEqual(['2-world.ts'])
    })

    test('works with empty folders', async () => {
      const emptyDirectory = path.join(folderPath, 'emptyFolder')
      if (!fs.existsSync(emptyDirectory)) {
        fs.mkdirSync(emptyDirectory)
      }

      const seeds = await parseSeeds(emptyDirectory, [])
      const seedNames = seeds.map((seed) => seed.name)
      expect(seedNames).toEqual([])
    })
  })

  describe('parseSeedsWithHistory', () => {
    let seeds: Seed[]

    beforeAll(async () => {
      seeds = await parseSeeds(folderPath)
    })

    beforeEach(async () => {
      await prisma.$queryRawUnsafe(`DELETE FROM ${SEED_TABLE}`)
    })

    test('does not include seeds already recorded in history', async () => {
      // insert existing seed
      await prisma.$queryRawUnsafe(
        `INSERT INTO ${SEED_TABLE} VALUES ('someId', '1-hello.ts', '2016-06-22 22:10:25-04')`,
      )

      const seeds = await parseSeedsWithHistory(prisma, folderPath)
      const seedNames = seeds.map((seed) => seed.name)
      expect(seedNames).toEqual(['2-world.ts'])
    })
  })

  describe('apply', () => {
    let seeds: Seed[]

    beforeAll(async () => {
      seeds = await parseSeeds(folderPath)
    })

    beforeEach(async () => {
      await prisma.$queryRawUnsafe(`DELETE FROM ${SEED_TABLE}`)
    })

    test('keeps a history ', async () => {
      const result = await applySeeds(prisma, seeds)
      expect(result).toEqual({ appliedSeeds: ['1-hello.ts', '2-world.ts'] })

      const history = await getSeedHistory(prisma)
      expect(history).toEqual([
        {
          id: expect.any(String),
          name: '1-hello.ts',
          startedAt: expect.any(String),
        },
        {
          id: expect.any(String),
          name: '2-world.ts',
          startedAt: expect.any(String),
        },
      ])
    })

    test('stops execution on failed seed and does not record it to history', async () => {
      const corruptSeed: Seed = {
        name: 'corrupt',
        // try to select a table that doesn't exist
        apply: (prisma) => prisma.$queryRawUnsafe(`SELECT * FROM wrong`),
      }

      try {
        await applySeeds(prisma, [seeds[0], corruptSeed, seeds[1]])
      } catch (error) {
        // ignore the error because we expect it
      } finally {
        const history = await getSeedHistory(prisma)
        expect(history).toEqual([
          {
            id: expect.any(String),
            name: '1-hello.ts',
            startedAt: expect.any(String),
          },
        ])
      }
    })
  })
})
