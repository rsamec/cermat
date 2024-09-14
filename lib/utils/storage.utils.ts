import { safeJsonParse, safeJsonStringify, JSONCompatible } from "./json.utils";
import { isEmptyOrWhiteSpace } from "./utils";

export function set<T>(key: string, value: JSONCompatible<T>): Promise<void> {
  return new Promise((resolve) => {
    if (typeof localStorage !== 'undefined')
      localStorage?.setItem(key, safeJsonStringify(value));
    resolve()
  })
}
export function del(key: string): Promise<void> {
  return new Promise((resolve) => {
    if (typeof localStorage !== 'undefined')
      localStorage?.removeItem(key);
    resolve();
  })
}

export function get<T>(key: string, defaultValue: T): Promise<T> {
  return new Promise((resolve) => {
    const value = (typeof localStorage !== 'undefined') ? localStorage.getItem(key) : null;
    if (value == null) return resolve(defaultValue);
    if (isEmptyOrWhiteSpace(value)) return resolve(defaultValue);
    resolve(safeJsonParse(value) as T)
  });
}