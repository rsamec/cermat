import { normalizeToString } from "./math.utils"
import { removeSpaces, Option, areDeeplyEqual } from "./utils"

export type ValidationFunctionArgs<T> = { args: T }
export type EqualValidator<T> = ValidationFunctionArgs<T> & {
  kind: "equal"
}

export type EqualRatioValidator<T> = ValidationFunctionArgs<T> & {
  kind: "equalRatio"
}

export type EqualOptionValidator<T> = ValidationFunctionArgs<T> & {
  kind: "equalOption"
}
export type EqualMathOptionValidator = ValidationFunctionArgs<string | number> & {
  kind: "equalMathExpression"
}
export type EqualMathEquationValidator = ValidationFunctionArgs<string | boolean> & {
  kind: "equalMathEquation"
}

export type EqualSortedOptionsValidator = ValidationFunctionArgs<string[]> & {
  kind: "equalSortedOptions"
}
export type EqualListValidator<T> = ValidationFunctionArgs<T[]> & {
  kind: "equalList"
}

export type SelfEvaluateText = {
  kind: 'text',
  content: string
}

export type SelfEvaluateImage = {
  kind: 'image'
  src: string
}

export type SelfEvaluateValidator = ValidationFunctionArgs<{ options: Option<number>[], hint: SelfEvaluateText | SelfEvaluateImage }> & {
  kind: "selfEvaluate"
}
export type ValidationFunctionSpec<T> = EqualValidator<T> | EqualRatioValidator<T> | EqualOptionValidator<T> | SelfEvaluateValidator | EqualMathOptionValidator
  | EqualMathEquationValidator | EqualListValidator<T> | EqualSortedOptionsValidator;

export class CoreVerifyiers {
  static EqualTo<T>(value: T) {
    return (control: T) => {
      return control === value || areDeeplyEqual(control, value) ? undefined : { 'expected': value, 'actual': control };
    }
  }

  static RatioEqualTo<T>(value: T) {
    return (control: T) => {
      return typeof control === 'string' && removeSpaces(control) === value ? undefined : { 'expected': value, 'actual': control };
    }
  }

  static MathExpressionEqualTo(value: string | number) {
    return (control: string) => {

      return normalizeToString(control) === value ? undefined : { 'expected': value, 'actual': control };
    }
  }

  static MathEquationEqualTo(value: string | boolean) {
    return (control: string | boolean) => {
      if (typeof value === 'boolean') {
        return value === control ? undefined : { 'expected': value, 'actual': control };
      }
      else {
        const controlValue = normalizeToString(control?.toString());        
        return value === removeSpaces(controlValue) ? undefined : { 'expected': value, 'actual': control };
      }
    }
  }

  static OptionEqualTo<T>(value: T) {
    return (control: Option<T>) => {
      return control?.value === value ? undefined : { 'expected': value, 'actual': control }
    }
  }

  static SortedOptionsEqualTo(values: string[]) {
    return (control: Option<string>[]) => {
      const options = control ?? [];
      return values.length === options.length && values.join() === options.map(d => d.value).join() ? undefined :
        { 'expected': values, 'actual': options.map(d => d.value) }
    }
  }

  static SelfEvaluateTo({ options }: { options: Option<number>[] }) {
    return (control: Option<number>) => {
      return options[options.length - 1].value == control?.value ? null : control
    }
  }
}


export function getVerifyFunction<T>(spec: ValidationFunctionSpec<T>) {
  switch (spec.kind) {
    case 'equal':
      return CoreVerifyiers.EqualTo(spec.args);
    case 'equalRatio':
      return CoreVerifyiers.RatioEqualTo(spec.args);
    case 'equalMathExpression':
      return CoreVerifyiers.MathExpressionEqualTo(spec.args);
    case 'equalMathEquation':
      return CoreVerifyiers.MathEquationEqualTo(spec.args);
    case 'equalOption':
      return CoreVerifyiers.OptionEqualTo(spec.args);
    case 'selfEvaluate':
      return CoreVerifyiers.SelfEvaluateTo(spec.args);
    case 'equalSortedOptions':
      return CoreVerifyiers.SortedOptionsEqualTo(spec.args);
    default:
      throw new Error(`Function ${spec} not supported.`);
  }
}
