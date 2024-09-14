import { expect, test } from 'vitest'
import { CoreVerifyiers } from './assert'

test('standard operation expressions', () => {
  const equalTo = CoreVerifyiers.MathExpressionEqualTo("x(2x-1)+1/2");

  expect(equalTo("x * (2 *x - 1) + 1 / 2")).toBeUndefined()
  expect(equalTo("x *(2 x - 1)+1/2")).toBeUndefined()
  expect(equalTo("x(2x-1)+ 1 /2")).toBeUndefined()
  expect(equalTo("x (2 x - 1)+1 /2")).toBeUndefined()
})

test('power expression expressions', () => {
  const equalTo = CoreVerifyiers.MathExpressionEqualTo("4/9a^2-4a+9");

  expect(equalTo("4 / 9 a^2 - 4a + 9")).toBeUndefined()
  expect(equalTo("4 / 9 * a^2 - 4*a + 9")).toBeUndefined()
})

test('parenthesis expression expressions', () => {
  const equalTo = CoreVerifyiers.MathExpressionEqualTo("(1+2)2+1");

  expect(equalTo("(1+2)*2+1")).toBeUndefined()
  expect(equalTo("((1+2)*2)+1")).toBeUndefined()
})

test('array equals - order of items is ignored', () => {
  expect(CoreVerifyiers.EqualStringCollectionTo(["a", "b", "c", "d"])(["a", "b", "c", "d"])).toBeUndefined()
  expect(CoreVerifyiers.EqualStringCollectionTo(["a", "b", "c", "d"])(["a", "d", "b", "c"])).toBeUndefined()
  expect(CoreVerifyiers.EqualStringCollectionTo(["a", "b", "c", "d"])(["a", "b"])).not.toBeUndefined()
  expect(CoreVerifyiers.EqualStringCollectionTo(["a", "b", "c", "d"])(["a", "b", "c"])).not.toBeUndefined()
  expect(CoreVerifyiers.EqualStringCollectionTo(["a", "b", "c", "d"])(["a", "b", "c", "d", "e"])).not.toBeUndefined()
})

test('assert match expression match', () => {
  expect(CoreVerifyiers.MatchTo(/abc/)('Prefix abc suffix')).toBeUndefined()
  expect(CoreVerifyiers.MatchTo(/abc/)('Prefixabcsuffix')).toBeUndefined()
  expect(CoreVerifyiers.MatchTo(/abc/)('abc')).toBeUndefined()
  expect(CoreVerifyiers.MatchTo(/abc/)('Prefix ab suffix')).not.toBeUndefined()
  expect(CoreVerifyiers.MatchTo(/abc/)('Prefixabsuffix')).not.toBeUndefined()
  expect(CoreVerifyiers.MatchTo(/abc/)('ab')).not.toBeUndefined()
  
  expect(CoreVerifyiers.MatchTo(/abc/i)('aBc')).toBeUndefined()
  expect(CoreVerifyiers.MatchTo(/abc/)('aBc')).not.toBeUndefined()
  

})