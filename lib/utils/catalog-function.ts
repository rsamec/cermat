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

export type ValidationFunctionArgs<T> = { args: T }
export type FractionEqualValidator = ValidationFunctionArgs<[number, number]> & {
  kind: "equalFraction"
}
export type EqualValidator<T> = ValidationFunctionArgs<T> & {
  kind: "equal"
}
export type EqualOptionValidator<T> = ValidationFunctionArgs<T> & {
  kind: "equalOption"
}
export type EqualMathOptionValidator = ValidationFunctionArgs<string> & {
  kind: "equalMath"
}
export type EqualSortedOptionsValidator = ValidationFunctionArgs<string[]> & {
  kind: "equalSortedOptions"
}
export type EqualListValidator<T> = ValidationFunctionArgs<T[]> & {
  kind: "equalList"
}


export type SelfEvaluateValidator = ValidationFunctionArgs<{ options: Option<number>[] }> & {
  kind: "selfEvaluate"
}
export type ValidationFunctionSpec<T> = EqualValidator<T> | EqualOptionValidator<T> | FractionEqualValidator | SelfEvaluateValidator | EqualMathOptionValidator | EqualListValidator<T> | EqualSortedOptionsValidator;

export type ComponentFunctionArgs<T> = { args?: T }
export type MathExpressionHintType = 'fraction' | 'expression' | 'equation' | 'ratio';

export type BooleanComponentFunctionSpec = ComponentFunctionArgs<never> & {
  kind: 'bool'
}
export type TextComponentFunctionSpec = ComponentFunctionArgs<{ prefix?: string, suffix?: string }> & {
  kind: 'text'
}
export type NumberComponentFunctionSpec = ComponentFunctionArgs<{ prefix?: string, suffix?: string }> & {
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

export class CoreVerifyiers {
  static EqualValidator<T>(value: T) {
    return (control: T) => {
      return control === value ? undefined : { '': 'This value is invalid' };
    }
  }
  static FractionEqualValidator(fraction: [number, number]) {
    return (control: string) => {
      return control === `${fraction[0]}/${fraction[1]}` ? undefined : { '': 'This value is invalid' };
    }
  }

  static EqualOptionValidator<T>(value: T) {
    return (control: Option<T>) => {
      return control?.value === value ? undefined : { 'value': control?.value };
    }
  }

  static EqualSortedOptionsValidator(values: string[]) {
    return (control: Option<string>[]) => {
      const options = control ?? [];
      return values.length === options.length && values.join() === options.map(d => d.value).join() ? undefined : { 'value': options.map(d => d.value).join(",") };
    }
  }

  static SelfEvaluateValidator({ options }: { options: Option<number>[] }) {
    return (control: Option<number>) => {
      return options[options.length - 1].value == control.value ? null : control
    }
  }
}


export function getVerifyFunction<T>(spec: ValidationFunctionSpec<T>) {
  switch (spec.kind) {
    case 'equal':
      return CoreVerifyiers.EqualValidator(spec.args)
    case 'equalFraction':
      return CoreVerifyiers.FractionEqualValidator(spec.args);
    case 'equalOption':
      return CoreVerifyiers.EqualOptionValidator(spec.args);
    case 'selfEvaluate':
      return CoreVerifyiers.SelfEvaluateValidator(spec.args);
    case 'equalSortedOptions':
      return CoreVerifyiers.EqualSortedOptionsValidator(spec.args);
    default:
      throw new Error(`Function ${spec} not supported.`);
  }
}
