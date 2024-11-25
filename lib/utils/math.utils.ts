import { parse,  MathNode, simplify, evaluate } from 'mathjs';
import { isEmptyOrWhiteSpace, removeSpaces } from './utils';

export const str2sym = (expression: string): MathNode => {
  try {
    const parsedExpression = parse(expression);
    return parsedExpression;
    // const simplifiedExpression = simplify(parsedExpression);
    // return simplifiedExpression;
  } catch (error) {
    throw new Error(`Invalid expression: ${expression}`);
  }
};

export const toTex = (expression: string) => {
  return str2sym(expression).toTex({ format: 'mathml' })
}

// export const toMathML = (expression: string) => {
//   return str2sym(expression).toString({handler: toMathMLHandler, csymbols: dictFunc});
// }


export const toHtml = (expression: string) => {
  let result = '';
  try {
    return str2sym(expression).toHTML({ implicit: 'hide', parenthesis: 'auto', })
  }
  catch {
    result = `<span class="error">Chybné zadání: ${expression}</span>`;
  }
  return result;
}

export const normalizeToString = (input: string) => {
  if (isEmptyOrWhiteSpace(input)) return '';
  let result = '';
  try {
    const output = str2sym(input).toString({ implicit: 'hide', parenthesis: 'auto' })
    return removeSpaces(output).replaceAll("*", "");
  }
  catch {
    result = `Invalid expression: ${input}`;
  }

  return result;
};

export function checkEquivalence(expr1:string, expr2:string) {
  try {
      if (isEmptyOrWhiteSpace(expr1) || isEmptyOrWhiteSpace(expr2)){
        //unable to evaulate
        return false;
      }
      //return simplify(expr1).toString() == simplify(expr2).toString();
      // Extract variable names from the expressions
      const variables = Array.from(new Set([
          ...parse(expr1).filter((node:any) => node.isSymbolNode).map((node:any) => node.name),
          ...parse(expr2).filter((node:any) => node.isSymbolNode).map((node:any) => node.name),
      ]));
      if (variables.length == 0){
        return simplify(expr1).toString() == simplify(expr2).toString();
      }
      console.log(expr1, expr2)

      // Generate test points for each variable
      const testCases = [
          [...Array(5)].keys() // Test with 5 sets of random values
      ].map(() =>
          Object.fromEntries(variables.map(variable => [variable, Math.random() * 20 - 10]))
      );

      // Evaluate expressions for all test cases
      for (const testCase of testCases) {
          const result1 = evaluate(expr1, testCase);
          const result2 = evaluate(expr2, testCase);

          // If results differ, expressions are not equivalent
          if (Math.abs(result1 - result2) > 1e-9) {
              return false;
          }
      }
      return true; // All test cases passed
  } catch (error) {
      console.error("Error in evaluating expressions:", error);
      return false;
  }
}