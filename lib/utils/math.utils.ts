import { parse,  MathNode } from 'mathjs';
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

