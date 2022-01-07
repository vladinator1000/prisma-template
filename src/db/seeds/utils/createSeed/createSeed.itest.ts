import fs from 'fs'
import path from 'path'
import { createSeed } from './createSeed'

describe('Create seed', () => {
  const seedsFolderPath = path.join(__dirname, 'fixtures')
  const devFolder = path.join(seedsFolderPath, 'development')
  const prodFolder = path.join(seedsFolderPath, 'production')

  beforeAll(() => {
    if (!fs.existsSync(seedsFolderPath)) {
      fs.mkdirSync(seedsFolderPath)
    }
  })

  afterAll(() => {
    fs.rmSync(seedsFolderPath, { recursive: true })
  })

  test('folder for development is created', () => {
    createSeed('seed', seedsFolderPath, 'development')
    const folderExists = fs.existsSync(devFolder)
    expect(folderExists).toBe(true)
  })

  test('folder for production is created', () => {
    createSeed('seed', seedsFolderPath, 'production')
    const folderExists = fs.existsSync(prodFolder)
    expect(folderExists).toBe(true)
  })

  test('a seed file is created', () => {
    const filePath = createSeed('hello', seedsFolderPath, 'development')
    const devFileExists = fs.existsSync(filePath)
    expect(devFileExists).toBe(true)
  })

  test('the names of subsequent files in the same folder start with an incrementing number', () => {
    const startsWithNumberRegex = new RegExp(/^\d*/)
    const filePath = createSeed('hello', seedsFolderPath, 'development')
    const fileName = path.basename(filePath)
    expect(startsWithNumberRegex.test(fileName)).toBe(true)
  })
})
