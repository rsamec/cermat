import { FormControl } from "./form.utils";
import { Maybe, Option } from "./utils";

export type ValidationResult = Maybe<{ [key: string]: any }>;

export type ValidationFunction<T> = (control: FormControl<T>) => ValidationResult
export type Validators<T> = ValidationFunction<T>[] | ValidationFunction<T>
export type GroupValidationResult = { [key: string]: Maybe<GroupValidationResult> }


export class CoreValidators {
  static EqualValidator<T>(value: T) {
    return (control: FormControl<T>) => {
      return control.value === value ? undefined : { 'equal': 'This value is invalid' };
    }
  }
  static FractionEqualValidator(fraction: [number, number]) {
    return (control: FormControl<string>) => {
      return control.value === `${fraction[0]}/${fraction[1]}` ? undefined : { 'fractionEqual': 'This value is invalid' };
    }
  }

  static EqualOptionValidator<T>(value: T) {
    return (control: FormControl<Option<T>>) => {
      return control.value?.value === value ? undefined : { 'equalOption': 'This value is invalid' };
    }
  }
}