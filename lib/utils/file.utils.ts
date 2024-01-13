import { promises as fs } from 'fs'

import { readFile } from 'fs/promises'
import { join, resolve } from 'path'

export async function getFileNames(subPath: string) {
  const postsDirectory = join(process.cwd(), subPath)
  return await fs.readdir(postsDirectory) 
}
export async function getImages(imageDir: string) {
  return getFileNames(join("public", "images", imageDir));
}
const CONTENT_PATH = join(
  process.cwd(),
  'generated'
)


export const loadJsonBySlug = async <TSchema extends {} = {}>(slug:string) => {
  const m = await readFile(resolve(CONTENT_PATH, `./${slug}.json`))
  return JSON.parse(m.toString()) as TSchema  
}
