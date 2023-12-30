export function absoluteUrl(path: string) {
  //return path;
  const rootSegment = process.env.NEXT_PUBLIC_REPO_SLUG;
  return `${rootSegment ? `/${rootSegment}`:''}${path}`
}

export function imageUrl(image: string | undefined) {
  return image ?? '';
}

export function chunk<T>(arr: T[], chunkSize = 3) {

  const chunks = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    chunks.push(chunk);
  }
  return chunks;
}
export function formatNumber(value:string){
  return value != null ? parseInt(value).toLocaleString("cs-CZ", { maximumFractionDigits: 0, minimumFractionDigits: 0 }) + " Kč": '---';
}
