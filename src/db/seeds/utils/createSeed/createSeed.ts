import fs from 'fs'
import path from 'path'

/**
 * Creates a "data migration" file, with a name that starts with an incrementing number.
 * name The name of the file
 * folderPath A folder that will contain "development" and "production" subfolders
 * environment The subfolder that the file will be created in
 */
export function createSeed(
  name: string,
  folderPath: string,
  environment: 'development' | 'production' = 'development',
): string {
  const folderToCreate = path.join(folderPath, environment)
  if (!fs.existsSync(folderToCreate)) {
    fs.mkdirSync(folderToCreate)
  }

  const templatePath = path.join(__dirname, '../defaultSeedTemplate.ts')

  const generatedName = generateSeedFileName(folderToCreate, name)
  const destinationPath = path.join(folderToCreate, generatedName)
  fs.copyFileSync(templatePath, destinationPath)

  return destinationPath
}

function generateSeedFileName(
  destinationFolderPath: string,
  desiredName: string,
): string {
  const numFiles = fs.readdirSync(destinationFolderPath).length
  return `${numFiles}-${desiredName}.ts`
}
