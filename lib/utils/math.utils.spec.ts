import { expect, test } from 'vitest'
import { checkEquivalence, normalizeToString } from './math.utils';

test('math advanced input', () => {
  const userInput = 'x^2 + 2x + 1';
  const symbolicExpression = normalizeToString(userInput);
  expect(symbolicExpression).toBe('x^2+2x+1')

})

test('math basic input', () => {
  const userInput = '2 * x * ( 2 * x-1)';
  const symbolicExpression = normalizeToString(userInput);
  expect(symbolicExpression).toBe('2x(2x-1)')

})

test('check equilance', () => {
  const userInput1 = '(3a-4)(3a+4)';
  const userInput2 = '(3a+4)(3a-4)';  
  expect(checkEquivalence(userInput1, userInput2)).toBe(true)

})
test('check equilance', () => {
  const userInput1 = '1.2';
  const userInput2 = '6/5';  
  expect(checkEquivalence(userInput1, userInput2)).toBe(true)

})
