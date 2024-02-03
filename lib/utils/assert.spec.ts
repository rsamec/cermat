import { expect, test } from 'vitest'
import { CoreVerifyiers } from './assert';


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