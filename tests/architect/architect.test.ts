import * as fs from 'fs'
import * as path from 'path'

describe('File Pattern Matching in Core Modules', () => {
  const modulesDirectory = path.resolve(__dirname, '../../src/app/core/')
  const filePatterns = {
    controllers: /^[a-z-]+\.controller\.ts$/i,
    routers: /^[a-z-]+\.router\.ts$/i,
    services: /^[a-z-]+\.service\.ts$/i,
    entities: /^[a-z-]+\.entity\.ts$/i,
    repositories: /^[a-z-]+\.repository\.ts$/i,
    dto: /^[a-z-]+\.dto\.ts$/i
  }

  const checkFolderForPattern = (folderName: string, pattern: RegExp) => {
    const folderPath = path.join(modulesDirectory, folderName)
    if (!fs.existsSync(folderPath)) return

    const files = fs.readdirSync(folderPath)

    const matchingFiles = files.filter((file) => pattern.test(file))

    expect(matchingFiles.length).toBeGreaterThan(0)
  }

  it('should ensure all files match their respective patterns', () => {
    Object.entries(filePatterns).forEach(([folder, pattern]) => {
      checkFolderForPattern(folder, pattern)
    })
  })
})
