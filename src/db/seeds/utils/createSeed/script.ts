import path from 'path'
import { getSeedDirectory, SeedEnvironment } from '..'
import { createSeed } from './createSeed'

export function executeScript() {
  const args = process.argv.slice(2)
  const flags = args.filter((arg) => arg.includes('-'))
  const withoutFlags = args.filter((arg) => !arg.includes('-'))

  let environment: SeedEnvironment = 'development'

  if (flags.includes('-p') || flags.includes('--production')) {
    environment = 'production'
  }

  const fileName = withoutFlags[0]
  const seedsDirectory = path.join(getSeedDirectory(environment), '..')

  createSeed(fileName, seedsDirectory, environment)
}
