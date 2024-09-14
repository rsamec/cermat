import { promises as fs } from 'fs'

import { readFile } from 'fs/promises'
import { join, resolve } from 'path'
import { normalizeImageUrlsToAbsoluteUrls } from './utils'

export async function getFileNames(subPath: string) {
  const postsDirectory = join(process.cwd(), subPath)
  return await fs.readdir(postsDirectory)
}
export async function getImages(imageDir: string) {
  return getFileNames(join("public", "images", imageDir));
}
const GENERATED_PATH = join(
  process.cwd(),
  'generated'
)
const ASSETS_PATH = join(
  process.cwd(),
  'public'
)

export const loadJson = async <TSchema extends {} = {}>(path:string[]) => {
  const m = await readFile(resolve(join(GENERATED_PATH, join(...path))))
  return JSON.parse(m.toString()) as TSchema
}

export const loadMarkdown = async (path: string[]) => {  
  const m = await readFile(resolve(join(ASSETS_PATH, join(...path))))
  return m.toString()
}

export async function loadMarkdownWithAbsoluteImagesUrl(pathes: string[], absoluteImageUrlDomain:string = 'https://www.eforms.cz') {
  const quizContent = await loadMarkdown(pathes.concat(['index.md']));
  return normalizeImageUrlsToAbsoluteUrls(quizContent,[absoluteImageUrlDomain].concat(...pathes ?? []))
}

