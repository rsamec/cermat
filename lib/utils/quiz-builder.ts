import { JsonRegExp, SelfEvaluateImage, SelfEvaluateText, SelfEvaluateValidator } from "./assert";
import { ComponentFunctionSpec, LatexExpressionComponentFunctionArgs, MathExpressionComponentFunctionArgs, NumberComponentFunctionArgs, TextComponentFunctionArgs } from "./catalog-function";
import { AnswerGroupImpl, AnswerGroupMetadata, AnswerInfo, MixedChildren, Resources, ResourceTypes } from "./quiz-specification";
import { stringPatternToRegex } from "./utils";

export function rootGroup<T>(info: AnswerInfo, children: MixedChildren<T>) {
  return new AnswerGroupImpl<T>(children, { info });
}
type additionalConfig = { points?: number, resources?: Resources }
export function group<T>(children: MixedChildren<T>, metadata?: AnswerGroupMetadata<T>) {
  return new AnswerGroupImpl<T>(children, metadata);
}

export function number(value: number, args?: NumberComponentFunctionArgs, { points, resources }: additionalConfig = { points: 1 }) {
  points = points ?? 1;
  return { verifyBy: { kind: "equal", args: value }, points, resources, inputBy: { kind: 'number', args } } as const
}

export function mathExpr(value: string | number, args: MathExpressionComponentFunctionArgs, { points, resources }: additionalConfig = { points: 1 }) {
  points = points ?? 1;
  return { verifyBy: { kind: "equalMathExpression", args: value }, points, resources, inputBy: { kind: 'math' as const, args } } as const
}
export function latexExpr(value: string, args: LatexExpressionComponentFunctionArgs, { points, resources }: additionalConfig = { points: 1 }) {
  points = points ?? 1;
  return { verifyBy: { kind: "equalLatexExpression", args: value }, points, resources, inputBy: { kind: 'latex' as const, args } } as const
}

export function mathEquation(value: string | boolean, args: MathExpressionComponentFunctionArgs, { points, resources }: additionalConfig = { points: 1 }) {
  points = points ?? 1;
  return { verifyBy: { kind: 'equalMathEquation', args: value }, points, resources, inputBy: { kind: 'math', args } } as const
}
export function mathRatio(value: string, { points, resources }: additionalConfig = { points: 1 }) {
  points = points ?? 1;
  return { verifyBy: { kind: 'equalRatio', args: value }, points, resources, inputBy: { kind: 'text', args: { patternType: 'ratio' } } } as const
}

export function text(value: string, args: TextComponentFunctionArgs, { points, resources }: additionalConfig = { points: 1 }) {
  points = points ?? 1;
  return { verifyBy: { kind: "equal", args: value }, points, resources, inputBy: { kind: 'text', args } } as const
}
export const noPoints = {}
export const twoPoints = { points: 2 };
export const threePoints = { points: 3 };
export const fourPoints = { points: 4 };


export const video = (id: string) => ({ resources: [{ kind: "video" as const, id }] });
export const observableCells = (cells: string[]) => ({ resources: [{ kind: "observableHQ" as const, cells }] });

export function optionBool(spravnaVolba: boolean, { points, resources }: additionalConfig = { points: 1 }) {
  return {
    verifyBy:
      { kind: "equalOption", args: spravnaVolba },
    points,
    inputBy: {
      kind: 'bool'
    }
  } as const
}

export const tasks4Max2Points = {
  computeBy: {
    kind: 'group' as const, args: [{ points: 2, min: 4 }, { points: 1, min: 3 }]
  }
}
export const task3Max3Points = {
  computeBy: {
    kind: 'group' as const, args: [{ points: 3, min: 3 }, { points: 1, min: 2 }]
  }
}
export const task3Max4Points = {
  computeBy: {
    kind: 'group' as const, args: [{ points: 4, min: 3 }, { points: 2, min: 2 }]
  }
}
export const task3Max5Points = {
  computeBy: {
    kind: 'group' as const, args: [{ points: 5, min: 3 }, { points: 3, min: 2 }, { points: 1, min: 1 }]
  }
}
export const task3Max6Points = {
  computeBy: {
    kind: 'group' as const, args: [{ points: 2, min: 1 }, { points: 4, min: 2 }, { points: 6, min: 3 }]
  }
}

export const task2Max4Points = {
  computeBy: {
    kind: 'group' as const, args: [{ points: 4, min: 2 }, { points: 2, min: 1 }]
  }
}
export const task2Max3Points = {
  computeBy: {
    kind: 'group' as const, args: [{ points: 3, min: 2 }, { points: 2, min: 1 }]
  }
}

const points = [
  { value: 0, name: "0 bodů" }, { value: 1, name: "1 bod" }, { value: 2, name: "2 body" },
  { value: 3, name: "3 body" }, { value: 4, name: "4 body" }, { value: 5, name: "5 bodů" },
  { value: 6, name: "6 bodů" }, { value: 7, name: "7 bodů" }, { value: 8, name: "8 bodů" },
  { value: 9, name: "9 bodů" }, { value: 10, name: "10 bodů" }
]

function getPoints(max: number) {
  return points.slice(0, max + 1)
}
export function option(spravnaVolba: string, { points, resources }: additionalConfig = { points: 1 }) {
  points = points ?? 1;
  return {
    verifyBy:
      { kind: "equalOption", args: spravnaVolba },
    points,
    inputBy: {
      kind: 'options'
    }
  } as const
}

export function word(slovo: string, { points, resources }: additionalConfig = { points: 1 }) {
  points = points ?? 1;
  return {
    verifyBy:
      { kind: "equal", args: slovo },
    points,
    resources,
    inputBy: {
      kind: 'text'
    }
  } as const
}

export function match(pattern: RegExp, { points, resources }: additionalConfig = { points: 1 }) {
  points = points ?? 1;
  return {
    verifyBy:
    {
      kind: "match", args: {
        source: pattern.source,
        flags: pattern.flags
      }
    },
    points,
    resources,
    inputBy: {
      kind: 'text'
    }
  } as const
}


export function words(slova: string, { points, resources }: additionalConfig = { points: 1 }) {
  points = points ?? 1;
  const items = slova.split(",").map(d => d.trim())
  return {
    verifyBy:
      { kind: "equalStringCollection", args: items },
    points,
    inputBy: items.map(() => ({
      kind: 'text' as const
    }))
  } as const
}

export function numbers(items: number[], { points, resources }: additionalConfig = { points: 1 }) {
  points = points ?? 1;
  return {
    verifyBy:
      { kind: "equalNumberCollection", args: items },
    points,
    inputBy: items.map(() => ({
      kind: 'number' as const
    }))
  } as const
}

export function wordsGroup(slova: { [key: string]: string }, { points, resources }: additionalConfig = { points: 1 }) {
  points = points ?? 1;
  return {
    verifyBy: { kind: 'equal', args: slova },
    points,
    inputBy: Object.keys(slova).reduce((out: { [key: string]: ComponentFunctionSpec }, d) => {
      out[d] = { kind: 'text' as const };
      return out;
    }, {})
  } as const
}
export function wordsGroupPattern(slova: Record<string, string>, { points, resources }: additionalConfig = { points: 1 }) {
  points = points ?? 1;
  return {
    verifyBy: {
      kind: 'matchObjectValues',
      source: slova,
      args: Object.entries(slova).reduce((out, [key, pattern]) => {
        const regex = stringPatternToRegex(pattern);
        out[key] = {
          source: regex.source,
          flags: regex.flags
        };
        return out;
      }, {} as Record<string, JsonRegExp>)
    },
    points,
    inputBy: Object.keys(slova).reduce((out: { [key: string]: ComponentFunctionSpec }, d) => {
      out[d] = { kind: 'text' as const };
      return out;
    }, {})
  } as const
}
export function numbersGroup(numbers: { [key: string]: number }, { points, resources }: additionalConfig = { points: 1 }) {
  points = points ?? 1;
  return {
    verifyBy: { kind: 'equal', args: numbers },
    points,
    inputBy: Object.keys(numbers).reduce((out: { [key: string]: ComponentFunctionSpec }, d) => {
      out[d] = { kind: 'number' as const };
      return out;
    }, {})
  } as const
}


export function sortedOptions(sortedOptions: string[], { points, resources }: additionalConfig = { points: 1 }) {
  points = points ?? 1;
  return { verifyBy: { kind: 'equalSortedOptions', args: sortedOptions }, points, resources, inputBy: { kind: 'sortedOptions' } } as const
}

export function selfEvaluateImage(src: string, { points, resources }: additionalConfig = { points: 1 }) {
  points = points ?? 1;
  return selfEvaluate({ kind: 'image' as const, src }, { points, resources });
}
export function selfEvaluateText(content: string, { points, resources }: additionalConfig = { points: 1 }) {
  points = points ?? 1;
  return selfEvaluate({ kind: 'text' as const, content }, { points, resources });
}
export function selfEvaluate(hint: SelfEvaluateText | SelfEvaluateImage, { points, resources }: additionalConfig = { points: 1 }) {
  points = points ?? 1;
  const options = getPoints(points ?? 1)
  return {
    verifyBy: { kind: 'selfEvaluate', args: { options, hint } } as SelfEvaluateValidator,
    inputBy: { kind: 'options' as const, args: options },
    resources
  } as const
}
