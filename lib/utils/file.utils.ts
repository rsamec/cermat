import { promises as fs } from 'fs'
import path from 'path'

export async function getFileNames(subPath: string) {
  const postsDirectory = path.join(process.cwd(), subPath)
  return await fs.readdir(postsDirectory) 
}
export async function getImages(imageDir: string) {
  return getFileNames(path.join("public", "images", imageDir));
}