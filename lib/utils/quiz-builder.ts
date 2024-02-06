import { SelfEvaluateImage, SelfEvaluateText, SelfEvaluateValidator } from "./assert";
import { ComponentFunctionSpec, MathExpressionComponentFunctionArgs, NumberComponentFunctionArgs, TextComponentFunctionArgs } from "./catalog-function";
import { AnswerGroupImpl, AnswerGroupMetadata, MixedChildren } from "./quiz-specification";

export function group<T>(children: MixedChildren<T>, metadata?: AnswerGroupMetadata<T>) {
  return new AnswerGroupImpl<T>(children, metadata);
}

export function number(value: number, args?: NumberComponentFunctionArgs, { points }: { points?: number } = { points: 1 }) {
  return { verifyBy: { kind: "equal", args: value }, points, inputBy: { kind: 'number', args } } as const
}
export function mathExpr(value: string | number, args: MathExpressionComponentFunctionArgs, { points }: { points?: number } = { points: 1 }) {
  return { verifyBy: { kind: "equalMathExpression", args: value }, points, inputBy: { kind: 'math' as const, args } } as const
}
export function mathEquation(value: string | boolean, args: MathExpressionComponentFunctionArgs, { points }: { points?: number } = { points: 1 }) {
  return { verifyBy: { kind: 'equalMathEquation', args: value }, points, inputBy: { kind: 'math', args } } as const
}
export function mathRatio(value: string, { points }: { points?: number } = { points: 1 }) {
  return { verifyBy: { kind: 'equalRatio', args: value }, points, inputBy: { kind: 'text', args: { patternType: 'ratio' } } } as const
}

export function text(value: string, args: TextComponentFunctionArgs, { points }: { points?: number } = { points: 1 }) {
  return { verifyBy: { kind: "equal", args: value }, points, inputBy: { kind: 'text', args } } as const
}
export const noPoints = {}
export const twoPoints = { points: 2 };
export const threePoints = { points: 3 };
export const fourPoints = { points: 4 };
export function optionBool(spravnaVolba: boolean, { points }: { points?: number } = { points: 1 }) {
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
    kind: 'group' as const, args: [{ points: 3, min: 3 }, { points: 2, min: 2 }, { points: 1, min: 1 }]
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


const points = [
  { value: 0, name: "0 bodů" }, { value: 1, name: "1 bod" }, { value: 2, name: "2 body" },
  { value: 3, name: "3 body" }, { value: 4, name: "4 body" }, { value: 5, name: "5 bodů" },
  { value: 6, name: "6 bodů" }, { value: 7, name: "7 bodů" }, { value: 8, name: "8 bodů" },
  { value: 9, name: "9 bodů" }, { value: 10, name: "10 bodů" }
]
function getPoints(max: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10) {
  return points.slice(0, max + 1)
}
export function option(spravnaVolba: string, { points }: { points?: number } = { points: 1 }) {
  return {
    verifyBy:
      { kind: "equalOption", args: spravnaVolba },
    points,
    inputBy: {
      kind: 'options'
    }
  } as const
}

export function word(slovo: string,{ points }: { points: number } = { points: 1 }) {
  return {
    verifyBy:
      { kind: "equal", args: slovo },
    points,
    inputBy: {
      kind: 'text'
    }
  } as const
}
export function words(slova: string, { points }: { points?: number } = { points: 1 }) {
  const items = slova.split(",")
  return {
    verifyBy:
      { kind: "equal", args: items },
    points,
    inputBy: items.map(() => ({
      kind: 'text' as const
    }))
  } as const
}

export function wordsGroup(slova: { [key: string]: string }, { points }: { points?: number } = { points: 1 }) {
  return {
    verifyBy: { kind: 'equal', args: slova },
    points,
    inputBy: Object.keys(slova).reduce((out: { [key: string]: ComponentFunctionSpec }, d) => {
      out[d] = { kind: 'text' as const };
      return out;
    }, {})
  } as const
}

export function sortedOptions(sortedOptions: string[], { points }: { points?: number } = { points: 1 }) {
  return { verifyBy: { kind: 'equalSortedOptions', args: sortedOptions }, points, inputBy: { kind: 'sortedOptions' } } as const
}

export function selfEvaluateImage(max: 0 | 1 | 2 | 3 | 4, src: string) {
  return selfEvaluate(max, { kind: 'image' as const, src });
}
export function selfEvaluateText(max: 0 | 1 | 2 | 3 | 4, content: string) {
  return selfEvaluate(max, { kind: 'text' as const, content });
}
export function selfEvaluate(max: 0 | 1 | 2 | 3 | 4, hint: SelfEvaluateText | SelfEvaluateImage) {
  const options = getPoints(max)
  return {
    verifyBy: { kind: 'selfEvaluate', args: { options, hint } } as SelfEvaluateValidator, inputBy: { kind: 'options' as const, args: options }

  } as const
}
