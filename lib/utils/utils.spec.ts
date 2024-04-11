import { expect, test } from 'vitest';
import { cls, extractNumberRange, extractOptionRange, formatTime, strToSimpleHtml } from './utils';

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

test('extract number range identifier', () => {
  expect(extractNumberRange(
    `Some text 8
  ===`
  )).toEqual([8, 8])

})
test('extract number range identifier with standard dash', () => {
  expect(extractNumberRange(
    `Some text 8-12
  ===`
  )).toEqual([8, 12])

})
test('extract number range identifier with different longer dash ', () => {
  expect(extractNumberRange(
    `Some text 8–12
  ===`
  )).toEqual([8, 12])

})

test('extract number range identifier with multiple dashes', () => {
  expect(extractNumberRange(
    `POSLECH - 2. ČÁST ÚLOHY 5–12 
  ===`
  )).toEqual([5, 12])

})

test('extract option identifier', () => {
  expect(extractOptionRange("[A] some text")).toEqual(["A", "some text"])

})

test('simple convert string to super script', () => {
  expect(strToSimpleHtml("x^a + 2^")).toEqual("x<sup>a + 2</sup>")
  expect(strToSimpleHtml("some prefix x^a + 2^ some suffix")).toEqual("some prefix x<sup>a + 2</sup> some suffix")
})

test('format time to minutes and seconds', () => {
  expect(formatTime(60)).toEqual("1m 0s");
  expect(formatTime(4200)).toEqual("70m 0s")

})