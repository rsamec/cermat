import { test, expect } from "vitest";
import { FunctionCatalog, FunctionNames, FunctionsMap, getStaticFunctionsMap } from "./func.utils";

export interface MathFunctions {
  add: (a: number, b: number) => number,
  subtract: (a: number, b: number) => number,
  multiply: (a: number, b: number) => number,
  // Add more static functions as needed
}
type MathFunctionsNames = FunctionNames<MathFunctions>
type MathFunctionType = (a: number, b: number) => number

export interface StringFunctions {
  concatStrings: StringFunctionType
}

type StringFunctionNames = FunctionNames<StringFunctions>
type StringFunctionType = (str1: string, str2: string) => string


test('get math catalogs', () => {

  const obj: FunctionsMap<MathFunctions, MathFunctionType> = {
    add: (a: number, b: number) => {
      return a + b;
    },
    subtract: (a: number, b: number) => {
      return a - b;
    },
    multiply: (a: number, b: number) => {
      return a * b;
    },
  }

  const catalogObject = new FunctionCatalog(obj);


  expect(catalogObject.callFunction("add", 1, 2)).toBe(3);
  expect(catalogObject.callFunction("subtract", 2, 1)).toBe(1);
  expect(catalogObject.callFunction("multiply", 2, 1)).toBe(2);
})

test('get string catalogs', () => {

  const obj: FunctionsMap<StringFunctions, StringFunctionType> = {
    concatStrings: (str1: string, str2: string) => {
      return str1 + str2;
    }
  }

  const catalogObject = new FunctionCatalog(obj);

  expect(catalogObject.callFunction("concatStrings", "a", "b")).toBe("ab")
})