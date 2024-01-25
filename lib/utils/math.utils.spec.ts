import { expect, test } from 'vitest'
import { normalizeToString } from './math.utils';

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