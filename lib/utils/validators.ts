import { FormControl } from "./form.utils";
import { Maybe } from "./utils";

type Option<T> = { name: string, value: T };
export type ValidationResult = Maybe<{ [key: string]: any }>;

export type ValidationFunction<T> = (control: FormControl<T, any>) => ValidationResult
export type Validators<T> = ValidationFunction<T>[] | ValidationFunction<T>
export type ComputeFunction<T> = (controls: GroupPoints<T>) => number;
export type GroupPoints<T> = { [key in keyof T]: Maybe<number> }
export type GroupValidationResult = { [key: string]: Maybe<GroupValidationResult> }



export class CoreValidators {
  static EqualValidator<T>(value: T) {
    return (control: FormControl<T, any>) => {
      // returns null if value is valid, or an error message otherwise 
      return control.value === value ? undefined : { '': 'This value is invalid' };
    }
  }
  static FractionEqualValidator(fraction: [number, number]) {
    return (control: FormControl<string, any>) => {
      // returns null if value is valid, or an error message otherwise 
      return control.value === `${fraction[0]}/${fraction[1]}` ? undefined : { '': 'This value is invalid' };
    }
  }

  static EqualOptionValidator<T>(value: T) {
    return (control: FormControl<Option<T>, any>) => {
      // returns null if value is valid, or an error message otherwise 
      return control.value?.value === value ? undefined : { '': 'This value is invalid' };
    }
  }

  static SelfEvaluateValidator(value:string, options:{point: number, name:string }[] ) {
    return (control: FormControl<string, any>) => {
      // returns null if value is valid, or an error message otherwise 
      return control.value === value ? undefined : { '': 'This value is invalid' };
    }
  }
}