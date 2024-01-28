export type Maybe<T> = T | undefined;
export type Option<T> = { name: string, value: T }

export function absoluteUrl(path: string) {
  //return path;
  path = path.replace("/public", "");
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

export function extractNumberRange(text: string): [number, number] | null {
  const match = text.match(/^([\s\S]*?)(\d+)(?:[-–](\d+))?/);
  if (match) {
    const prefix = match[1];
    const start = parseInt(match[2], 10);
    const end = match[3] ? parseInt(match[3], 10) : start;
    return [start, end];
  } else {
    return null;
  }
}

export function extractOptionRange(text: string): [string, string] | null {
  const match = text.match(/^\[([\w\d]*)\][ \t]/);
  if (match) {
    const prefix = match[1];
    return [prefix, text.replace(`[${prefix}] `, '')];
  } else {
    return null;
  }
}

export const isEmptyOrWhiteSpace = (value: string): boolean => {
  return value == null || value.trim() === '';
};

export const removeSpaces = (value: string) => {
  return value !=
    null ? value.replace(/\s+/g, '') : value
}
export function updateMap<K, V>(originalMap: Map<K, V>, key: K, value: V): Map<K, V> {
  // Create a shallow copy of the original Map
  const newMap = new Map(originalMap);

  // Add or update the entry in the copied Map
  newMap.set(key, value);

  return newMap;
}

export function strToSimpleHtml(value: string) {

  // Use a regular expression to match patterns like x^22^
  const regex = /\^(.*)\^/g;

  // Replace matched patterns with HTML sup tags
  const result = value.replace(regex, (_, exponent) => `<sup>${exponent}</sup>`);

  return result;
}
export function format(value: any) {
  if (value == null) return value;
  if (typeof value == 'number') return formatNumber(value);
  if (typeof value == 'boolean') return value ? "A" : "N"
  return value;
}

export function formatNumber(input: number, decimals: number = 0) {
  return input.toLocaleString("cs-CZ", { maximumFractionDigits: decimals, minimumFractionDigits: 0 })
}
