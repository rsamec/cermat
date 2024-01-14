export type Maybe<T> = T | undefined;
export type Option<T> = { name: string, value: T }

export function absoluteUrl(path: string) {
  //return path;
  const rootSegment = process.env.NEXT_PUBLIC_REPO_SLUG;
  return `${rootSegment ? `/${rootSegment}` : ''}${path}`
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
export function formatNumber(value: string) {
  return value != null ? parseInt(value).toLocaleString("cs-CZ", { maximumFractionDigits: 0, minimumFractionDigits: 0 }) + " Kč" : '---';
}

export function cls(input: (string | boolean)[]) {
  return input.filter((cond: string | boolean) => typeof cond === "string").join(" ")
}
export function filterSteps<T>(steps: T[], currentStepIndex: number, maxVisibleSteps: number): T[] {
  const totalSteps = steps.length;

  // Calculate the start and end indices for the visible steps
  let start = Math.max(0, currentStepIndex - Math.floor(maxVisibleSteps / 2));
  let end = Math.min(totalSteps - 1, start + maxVisibleSteps - 1);

  // Adjust the start index if needed to keep the end index within bounds
  start = Math.max(0, end - maxVisibleSteps + 1);

  // Return the filtered array of visible steps
  return steps.slice(start, end + 1);
};


export type PositionChunk = {
  from: number;
  to: number;
};

export function excludeChunks(inputString: string, chunks: PositionChunk[]): string {
  if (chunks.length === 0) {
    return inputString; // No chunks to exclude, return the original string
  }

  // Sort chunks by start index in descending order
  const sortedChunks = chunks.sort((a, b) => b.from - a.from);

  let result = inputString;
  for (const chunk of sortedChunks) {
    const { from: start, to: end } = chunk;
    
    // Ensure start and end indices are within the bounds of the string
    if (start >= 0 && end <= result.length && start <= end) {
      // Exclude the chunk from the result string
      result = result.slice(0, start) + result.slice(end);
    }
  }

  return result;
}