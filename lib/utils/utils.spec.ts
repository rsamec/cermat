import { expect, test } from 'vitest';
import { cls, extractNumberRange, extractOptionRange } from './utils';

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
  `Some text 8-12
  ===`
  )).toEqual([8,12])

})
test('extract number range identifier', () => {
  expect(extractNumberRange(
  `Some text 8–12
  ===`
  )).toEqual([8,12])

})

test('extract option identifier', () => {
  expect(extractOptionRange("[A] some text")).toEqual(["A", "some text"])

})