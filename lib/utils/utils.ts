export type Maybe<T> = T | undefined;
export type Option<T> = { name: string, nameHtml?: string, value: T }

export function imageUrl(path: string) {
  //return path;
  path = path.replace("/public", "");
  const rootSegment = process.env.NEXT_PUBLIC_REPO_SLUG;
  return `${rootSegment ? `/${rootSegment}` : ''}${path}`
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


export const isEmptyOrWhiteSpace = (value: string | undefined): boolean => {
  return value == null || (typeof value === 'string' && value.trim() === '');
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
export function formatArgs(value: any) {
  if (value == null) return value;
  if (typeof value == 'number') return formatNumber(value);
  if (typeof value == 'boolean') return value ? "A" : "N"
  if (typeof value == 'string') return value;
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value == 'object') return Object.entries(value).map(([key, value]) => `${key}:${value}`).join(', ');
  return value;
}

export function formatNumber(input: number, decimals: number = 2) {
  return input.toLocaleString("cs-CZ", { maximumFractionDigits: decimals, minimumFractionDigits: 0 })
}
export function isString(obj: object): obj is String {
  return  typeof obj === 'string' 
}
export function normalizeString(obj: object) {
  return  isString(obj)? obj.replace(/\s+/g, '').toLowerCase():obj;
}
export function areDeeplyEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2 || (typeof obj1 === "number" && obj1 == obj2) || (typeof obj2 === "number" && obj2 == obj1) ) return true;
  if (normalizeString(obj1) === normalizeString(obj2)) return true;

  if (Array.isArray(obj1) && Array.isArray(obj2)) {

    if (obj1.length !== obj2.length) return false;

    return obj1.every((elem: any, index: any) => {
      return areDeeplyEqual(elem, obj2[index]);
    })


  }

  if (typeof obj1 === "object" && typeof obj2 === "object" && obj1 !== null && obj2 !== null) {
    if (Array.isArray(obj1) || Array.isArray(obj2)) return false;

    const keys1 = Object.keys(obj1)
    const keys2 = Object.keys(obj2)

    if (keys1.length !== keys2.length || !keys1.every(key => keys2.includes(key))) return false;

    for (let key in obj1) {
      let isEqual = areDeeplyEqual(obj1[key], obj2[key])
      if (!isEqual) { return false; }
    }

    return true;

  }

  return false;
}

export function matchNumberListCount(input: string) {
  return input.replace(/^\s*(\d+(?:\.\d+)*)(?=\s|$)/gm, (_match, p1) => {
    const hashCount = p1.split('.').length - 1;
    const hashes = '#'.repeat(hashCount + 1);
    return `${hashes} ${p1}`;
  });
  //return input.replaceAll(/(\d+)(?:\.(\d+))?/gm, (_, ...matches:string[]) => `## ${matches.join('.')}`)
}
export function formatTime(seconds: number) {
  const miliseconds = seconds * 1000
  var minutes = Math.floor(miliseconds / (1000 * 60));
  var seconds = Math.floor((miliseconds % (1000 * 60)) / 1000);
  return minutes + "m " + seconds + "s";

}

export function isArraySame<T>(f: T[], s: T[]) {
  return Array.isArray(f) &&
    Array.isArray(s) &&
    f.length === s.length &&
    f.every((val, index) => val === s[index]);
}

export function intersection<T>(arr1: T[], arr2: T[]) {
  // Use Set to eliminate duplicates and filter to find common elements
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  // Find the intersection by checking if elements of one set are in the other
  const intersection = Array.from(set1).filter(item => set2.has(item));

  return intersection.length;
}
export function normalizeToArray(value: string | any[]) {
  return Array.isArray(value)
    ? value
    : isEmptyOrWhiteSpace(value)
      ? []
      : value.split(",")
}

export function normalizeImageUrlsToAbsoluteUrls(markdown: string, segments: string[]): string {
  const regex = /\]\((.*?)\)/g;
  const replacedMarkdown = markdown.replace(regex, (match, imageUrl: string) => {
    const modifiedImageUrl = segments.concat(imageUrl.replace('./', '')).join('/');
    // Reconstruct the markdown with the modified image URL
    return `](${modifiedImageUrl})`;
  });

  return replacedMarkdown;

}

export function convertToDate(value: string) {
  // Extract year, month, and day from the input string
  const year = value.substring(0, 4);
  const month = value.substring(4, 6);
  const day = value.substring(6, 8);

  // Create a Date object with the extracted values
  const date = new Date(`${year}-${month}-${day}`);

  return date;
}


export function groupBy<T>(
  arr: T[],
  callback: (currentValue: T, currentIndex: number, array: T[]) => string
) {
  return arr.reduce((acc = {}, ...args) => {
    const key = callback(...args);
    acc[key] ??= []
    acc[key].push(args[0]);
    return acc;
  }, {} as Record<string,T[]>);
};

export function stringPatternToRegex(input: string) {
  const regexString = input
  .replace(/\((.*?)\)/g, "(?:$1\\s+)?") // Make parts in parentheses optional with spaces handled directly after each part
  .replace(/(?<=\?)\s/g, "") // spaces that are preceded by a question mark
  .replace(/,\s*/g, ",\\s*") // Allow optional spaces around commas
  .replace(/ /g, "\\s+")   // Require at least one space between words
  
  const regex = new RegExp(`^${regexString.trim()}$`);  // Anchor to ensure full match
  return regex;
}

export function mapObjectValues(obj: Record<string,string>, format: (value:string) => string){
  return Object.entries(obj).reduce((acc, [key, value]) => ({ 
    ...acc, 
    [key]: format(value) 
  }), {} as Record<string,string>);
}