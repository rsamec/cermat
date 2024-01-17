import { BehaviorSubject, Observable } from "rxjs";
import { Maybe, Option } from "./utils";
import { CoreValidators, GroupValidationResult, ValidationFunction, Validators } from "./validators";

export interface AbstractControl<T> {
  isLeaf(): this is FormControl<T>
}
export class FormControl<T> implements AbstractControl<T> {
  private _value: BehaviorSubject<Maybe<T>>;
  private _validations: ValidationFunction<T>[] = [];

  constructor(value: Maybe<T>, validations?: Validators<T>) {
    this._value = new BehaviorSubject(value);
    this._validations = validations !== undefined ? Array.isArray(validations) ? validations : [validations] : []
  }

  get value(): Maybe<T> {
    return this._value.value;
  }
  get valueChanges(): Observable<Maybe<T>> {
    return this._value.asObservable()
  }

  setValue(value: Maybe<T>): void {
    if (this.value !== value) {
      this._value.next(value);
    }
  }

  validate() {
    for (const validation of this._validations) {
      const error = validation(this);
      if (error) {
        return error;
      }
    }
    return;
  }
  isLeaf() {
    return true;
  }
}

export type ControlsConfig<T> = { [K in keyof T]: T[K] };

export class FormGroup<T> implements AbstractControl<T> {
  controls: ControlsConfig<T>;

  constructor(controlsConfig: ControlsConfig<T>) {
    this.controls = controlsConfig;
  }

  // setValues(values: Partial<T>): void {
  //   for (const key in values) {
  //     if (values.hasOwnProperty(key)) {
  //       const control = this.controls[key as keyof T];
  //       if (control) {
  //         control.setValue(values[key]);
  //       }
  //     }
  //   }
  // }
  validate() {
    const childrenResult = {} as GroupValidationResult
    for (const key in this.controls) {
      if (this.controls.hasOwnProperty(key)) {
        const control = this.controls[key] as AbstractControl<T>;
        if (control) {
          if (control.isLeaf()) {
            // console.log(key, result, control.value);
            const result = control.validate()
            if (result != null) {
              childrenResult[key] = result
            }

          }
          else {
            //recursive calls
            const result = (control as FormGroup<T>).validate();
            if (result != null) {
              childrenResult[key] = result;
            }
          }
        }
      }
    }
    return Object.keys(childrenResult).length > 0 ? childrenResult: null;
  }

  isLeaf() {
    return false;
  }
}

export class FormBuilder {
  static group<T>(controlsConfig: ControlsConfig<T>): FormGroup<T> {
    return new FormGroup<T>(controlsConfig);
  }

  static answer<T>(validators: Validators<T>) {
    return new FormControl<T>(undefined, validators)
  }
  static answerValue<T>(value: T) {
    return new FormControl<T>(undefined, CoreValidators.EqualValidator(value))
  }
  static answerOption<T>(value: T) {
    return new FormControl<Option<T>>(undefined, control => {
      return control.value?.value === value ? undefined : { '': 'This value is invalid' };
    })
  }
}
