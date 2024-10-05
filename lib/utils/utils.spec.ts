import { expect, test } from 'vitest';
import { cls, formatTime, intersection, normalizeImageUrlsToAbsoluteUrls, strToSimpleHtml } from './utils';

test('simple string', () => {

  expect(cls(["one"])).toBe("one")
  expect(cls(["one", "two"])).toBe("one two")
})

test('ternary operator', () => {
  expect(cls([true ? "one" : "two"])).toBe("one");
  expect(cls([false ? "one" : "two"])).toBe("two");

})
test('boolean to string', () => {
  expect(cls([true && "one"])).toBe("one")
  expect(cls([false && "one"])).toBe("")
})

test('simple convert string to super script', () => {
  expect(strToSimpleHtml("x^a + 2^")).toEqual("x<sup>a + 2</sup>")
  expect(strToSimpleHtml("some prefix x^a + 2^ some suffix")).toEqual("some prefix x<sup>a + 2</sup> some suffix")
})

test('format time to minutes and seconds', () => {
  expect(formatTime(60)).toEqual("1m 0s");
  expect(formatTime(4200)).toEqual("70m 0s")

})

test('replace markdown image urls to absolute urls', () => {
  const assetPathes = ["https://www.eforms.cz", "math", "5"];
  expect(normalizeImageUrlsToAbsoluteUrls("![alt text](image.png)", assetPathes)).toEqual("![alt text](https://www.eforms.cz/math/5/image.png)")
  expect(normalizeImageUrlsToAbsoluteUrls(">![OBRAZEK1](./1.jpeg)", assetPathes)).toEqual(">![OBRAZEK1](https://www.eforms.cz/math/5/1.jpeg)")
})

test('intersection', () => {
  const array1 = ["apple", "banana", "orange", "grape"];
  const array2 = ["banana", "apple", "grape", "pineapple"];
  expect(intersection(array1, array2)).toBe(3);
})