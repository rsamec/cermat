import { normalizeToString } from "./math.utils"
import { removeSpaces, Option, areDeeplyEqual, isArraySame } from "./utils"

export type ValidationFunctionArgs<T> = { args: T }
export type EqualValidator<T> = ValidationFunctionArgs<T> & {
  kind: "equal"
}
export type MatchValidator = ValidationFunctionArgs<string> & {
  kind: "match"
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
export type EqualLatexExpressionValidator = ValidationFunctionArgs<string> & {
  kind: "equalLatexExpression"
}
export type EqualMathEquationValidator = ValidationFunctionArgs<string | boolean> & {
  kind: "equalMathEquation"
}

export type EqualSortedOptionsValidator = ValidationFunctionArgs<string[]> & {
  kind: "equalSortedOptions"
}
export type EqualStringCollectionValidator = ValidationFunctionArgs<string[]> & {
  kind: "equalStringCollection"
}
export type EqualNumberCollectionValidator = ValidationFunctionArgs<number[]> & {
  kind: "equalNumberCollection"
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
  | EqualMathEquationValidator | EqualStringCollectionValidator | EqualNumberCollectionValidator | EqualSortedOptionsValidator | MatchValidator | EqualLatexExpressionValidator;

export class CoreVerifyiers {
  static EqualTo<T>(value: T) {
    return (control: T) => {
      return control === value || areDeeplyEqual(control, value) ? undefined : { 'expected': value, 'actual': control };
    }
  }

  static MatchTo(pattern: string) {
    const regex = new RegExp(pattern);
    return (control: string) => {
      return regex.test(control) ? undefined : { 'expected': pattern, 'actual': control };
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

  static EqualStringCollectionTo(value: string[]) {
    return (control: string[]) => {
      return isArraySame(control.sort(), value.sort()) ? undefined : { 'expected': value, 'actual': control }
    }
  }

  static EqualNumberCollectionTo(value: number[]) {
    return (control: number[]) => {
      return isArraySame(control.sort((f, s) => f - s), value.sort((f, s) => f - s)) ? undefined : { 'expected': value, 'actual': control }
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
    case 'equalLatexExpression':
      return CoreVerifyiers.EqualTo(spec.args);
    case 'match':
      return CoreVerifyiers.MatchTo(spec.args);
    case 'equalRatio':
      return CoreVerifyiers.RatioEqualTo(spec.args);
    case 'equalStringCollection':
      return CoreVerifyiers.EqualStringCollectionTo(spec.args);
    case 'equalNumberCollection':
      return CoreVerifyiers.EqualNumberCollectionTo(spec.args);
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
