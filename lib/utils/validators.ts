import { FormControl } from "./form.utils";

export class CoreValidators {
  static EqualValidator<T>(value: T) {
    return (control: FormControl<T>) => {
      // returns null if value is valid, or an error message otherwise 
      return control.value === value ? null : { '': 'This value is invalid' };
    }
  }
  static FractionEqualValidator(fraction: [number, number]) {
    return (control: FormControl<string>) => {
      // returns null if value is valid, or an error message otherwise 
      return control.value === `${fraction[0]}/${fraction[1]}` ? null : { '': 'This value is invalid' };
    }
  }
}