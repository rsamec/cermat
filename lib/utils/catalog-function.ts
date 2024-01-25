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
export type MathExpressionHintType = 'fraction' | 'expression' | 'equation' | 'ratio';

export type BooleanComponentFunctionSpec = ComponentFunctionArgs<never> & {
  kind: 'bool'
}
export type TextComponentFunctionSpec = ComponentFunctionArgs<{ prefix?: string, suffix?: string }> & {
  kind: 'text'
}
export type NumberComponentFunctionSpec = ComponentFunctionArgs<{ prefix?: string, suffix?: string, step?: number }> & {
  kind: 'number'
}
export type MathExpressionComponentFunctionSpec = ComponentFunctionArgs<{ prefix?: string, suffix?: string, hintType?: MathExpressionHintType | MathExpressionHintType[], hint?: string }> & {
  kind: 'math'
}
export type OptionsComponentFunctionSpec = ComponentFunctionArgs<undefined> & {
  kind: 'options'
}
export type SortedOptionsComponentFunctionSpec = ComponentFunctionArgs<undefined> & {
  kind: 'sortedOptions'
}


export type ComponentFunctionSpec = BooleanComponentFunctionSpec | TextComponentFunctionSpec | NumberComponentFunctionSpec | OptionsComponentFunctionSpec | MathExpressionComponentFunctionSpec | SortedOptionsComponentFunctionSpec
