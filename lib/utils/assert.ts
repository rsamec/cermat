import { intersect } from "mathjs"
import { normalizeToString } from "./math.utils"
import { option } from "./quiz-builder"
import { removeSpaces, Option, areDeeplyEqual, isArraySame, intersection, normalizeToArray } from "./utils"

export type ValidationFunctionArgs<T> = { args: T }
export type EqualValidator<T> = ValidationFunctionArgs<T> & {
  kind: "equal"
}

export type JsonRegExp = { source: string, flags: string }
export type MatchValidator = ValidationFunctionArgs<JsonRegExp> & {
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
      return control === value || areDeeplyEqual(control, value) ? undefined : { 'expected': value, 'actual': control, errorCount: null };
    }
  }

  static MatchTo(pattern: JsonRegExp) {
    const regex = new RegExp(pattern.source,pattern.flags);
    return (control: string) => {
      return regex.test(control) ? undefined : { 'expected': pattern, 'actual': control, errorCount: null };
    }
  }

  static RatioEqualTo<T>(value: T) {
    return (control: T) => {
      return typeof control === 'string' && removeSpaces(control) === value ? undefined : { 'expected': value, 'actual': control, errorCount: null };
    }
  }

  static MathExpressionEqualTo(value: string | number) {
    return (control: string) => {
      return normalizeToString(control) === value ? undefined : { 'expected': value, 'actual': control, errorCount: null };
    }
  }

  static MathEquationEqualTo(value: string | boolean) {
    return (control: string | boolean) => {
      if (typeof value === 'boolean') {
        return value === control ? undefined : { 'expected': value, 'actual': control, errorCount: null };
      }
      else {
        const controlValue = normalizeToString(control?.toString());
        return value === removeSpaces(controlValue) ? undefined : { 'expected': value, 'actual': control, errorCount: null };
      }
    }
  }

  static OptionEqualTo<T>(value: T) {
    return (control: Option<T>) => {
      return control?.value === value || (value === true && control?.value === 'A') || (value === false && control?.value === 'N') ? undefined : { 'expected': value, 'actual': control, errorCount: null }
    }
  }

  static EqualStringCollectionTo(value: string[]) {
    return (control: string[] | string) => {
      const controlValue = normalizeToArray(control).map(d => d?.trim())
      const errorCount = controlValue.length - intersection(controlValue, value) + Math.max(value.length - controlValue.length, 0);
      return errorCount === 0 ? undefined : { 'expected': value, 'actual': controlValue, errorCount }
    }
  }

  static EqualNumberCollectionTo(value: number[]) {
    return (control: number[] | string) => {
      const controlValue = normalizeToArray(control).map(d => parseInt(d));
      const errorCount = Array.isArray(controlValue) ? controlValue.length - intersection(controlValue, value) + Math.max(value.length - controlValue.length, 0) : null;
      return Array.isArray(controlValue) && errorCount === 0 ? undefined : { 'expected': value, 'actual': controlValue, errorCount }
    }
  }


  static SortedOptionsEqualTo(values: string[]) {
    return (control: Option<string>[] | string[] | string) => {
      const options = normalizeToArray(control);      
      return Array.isArray(options) && values.length === options.length && values.join() === options.map((d:any) => d.value ?? d).map(d => d?.trim()).join() ? undefined :
        { 'expected': values, 'actual': options, errorCount: null }      
    }
  }

  static SelfEvaluateTo({ options }: { options: Option<number>[] }) {
    return (control: Option<number>) => {
      return options[options.length - 1].value == control?.value ? null : { expected: options, actual: control, errorCount: null }
    }
  }
}


export function getVerifyFunction<T>(spec: ValidationFunctionSpec<T>)
//: (values: any) => ({ expected: any, actual: any } | undefined)
{
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
