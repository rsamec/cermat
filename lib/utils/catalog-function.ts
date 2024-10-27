import { Option } from "./utils";

export type ComputeFunctionArgs<T> = { args: T }
export type GroupPoints<T> = { [key in keyof T]: number | undefined }

export type SumCompute = {
  kind: 'sum'
}
export type GroupCompute = ComputeFunctionArgs<{ points: number, min: number }[]> & {
  kind: 'group'
}
export type ComputeFunctionSpec = SumCompute | GroupCompute



export type ComponentFunctionArgs<T> = { args?: T }
export type MathExpressionSolver = { latexId?: string }
export type MathExpressionHintType = 'fraction' | 'expression' | 'equation';

export type BooleanComponentFunctionSpec = ComponentFunctionArgs<never> & {
  kind: 'bool'
}
export type TextComponentFunctionArgs = { prefix?: string, suffix?: string, patternType?: 'ratio' };
export type TextComponentFunctionSpec = ComponentFunctionArgs<TextComponentFunctionArgs> & {
  kind: 'text'
}
export type NumberComponentFunctionArgs = { prefix?: string, suffix?: string, step?: number } & MathExpressionSolver
export type NumberComponentFunctionSpec = ComponentFunctionArgs<NumberComponentFunctionArgs> & {
  kind: 'number'
}
export type MathExpressionComponentFunctionArgs = { prefix?: string, suffix?: string, hintType?: MathExpressionHintType | MathExpressionHintType[], hint?: string } & MathExpressionSolver
export type MathExpressionComponentFunctionSpec = ComponentFunctionArgs<MathExpressionComponentFunctionArgs> & {
  kind: 'math'
}
export type LatexExpressionComponentFunctionArgs = { prefix?: string, suffix?: string, hint?: string }
export type LatexExpressionComponentFunctionSpec = ComponentFunctionArgs<LatexExpressionComponentFunctionArgs> & {
  kind: 'latex'
}

export type OptionsComponentFunctionSpec<T> = ComponentFunctionArgs<Option<T>[]> & {
  kind: 'options'
}
export type SortedOptionsComponentFunctionSpec = ComponentFunctionArgs<undefined> & {
  kind: 'sortedOptions'
}


export type ComponentFunctionSpec = BooleanComponentFunctionSpec | TextComponentFunctionSpec | NumberComponentFunctionSpec | OptionsComponentFunctionSpec<any> | MathExpressionComponentFunctionSpec | LatexExpressionComponentFunctionSpec | SortedOptionsComponentFunctionSpec
