export type Maybe<T> = T | undefined;
export type Option<T> = { name: string, value: T }

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
export function format(value: any) {
  if (value == null) return value;
  if (typeof value == 'number') return formatNumber(value);
  if (typeof value == 'boolean') return value ? "A" : "N"
  if (typeof value == 'string') return value;
  if (Array.isArray(value)) return value.join(', ');
  if (typeof value == 'object') return Object.entries(value).map(([key,value]) => `${key}:${value}`).join(', ');
  return value;
}

export function formatNumber(input: number, decimals: number = 0) {
  return input.toLocaleString("cs-CZ", { maximumFractionDigits: decimals, minimumFractionDigits: 0 })
}


export function areDeeplyEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;

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
  var minutes =  Math.floor(miliseconds / (1000 * 60));
  var seconds = Math.floor((miliseconds % (1000 * 60)) / 1000);
  return minutes + "m " + seconds + "s";
   
}

export function isArraySame<T>(f: T[], s: T[]) {
  return Array.isArray(f) &&
    Array.isArray(s) &&
    f.length === s.length &&
    f.every((val, index) => val === s[index]);

}