import { test, expect } from "vitest";
import { calculateMaxTotalPoints, convertTree } from "./utils/quiz-specification";

import mat5_2023_1 from './exams/matematika-5-2023-1';
import mat9_2023_1 from './exams/matematika-9-2023-1';
import cz5_2023_1 from './exams/cestina-5-2023-1';
import cz9_2023_1 from './exams/cestina-9-2023-1';
import cestina7 from './exams/C7A-2023'


test('matika 5 2023 - 1 radny termin', () => {    
  expect(calculateMaxTotalPoints(convertTree(mat5_2023_1))).toBe(50);
})
test('matika 9 2023 - 1 radny termin', () => {    
  expect(calculateMaxTotalPoints(convertTree(mat9_2023_1))).toBe(50);
})
test('cz 5 2023 - 1 radny termin', () => {    
  expect(calculateMaxTotalPoints(convertTree(cz5_2023_1))).toBe(50);
})
test('cz 9 2023 - 1 radny termin', () => {    
  expect(calculateMaxTotalPoints(convertTree(cz9_2023_1))).toBe(50);
})
test('cestina 7 2023', () => {    
  expect(calculateMaxTotalPoints(convertTree(cestina7))).toBe(50);
})