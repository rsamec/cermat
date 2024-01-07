import { BehaviorSubject, Observable } from "rxjs";
import { Maybe, Option } from "./utils";
import { ComputeFunction, CoreValidators, GroupPoints, GroupValidationResult, ValidationFunction, Validators } from "./validators";

export interface AbstractControl<T> {
  isLeaf(): this is FormControl<T, ComputePoints>
}
export type ComputePoints = { points?: number }
export class FormControl<T, M extends ComputePoints> implements AbstractControl<T> {
  private _value: BehaviorSubject<Maybe<T>>;
  private _validations: ValidationFunction<T>[] = [];

  constructor(value: Maybe<T>, validations?: Validators<T>, public config?: M) {
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

function sum<T>(points: GroupPoints<T>) {
  return Object.entries(points).map(([, d]) => d as number).filter(d => d != null).reduce((out, d) => out += d, 0);
}
export type ControlsConfig<T> = { [K in keyof T]: T[K] };

export class FormGroup<T> implements AbstractControl<T> {
  controls: ControlsConfig<T>;
  private _compute: ComputeFunction<T>;

  constructor(controlsConfig: ControlsConfig<T>, compute: ComputeFunction<T> = sum) {
    this.controls = controlsConfig;
    this._compute = compute;
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
            childrenResult[key] = control.validate()

          }
          else {
            //recursive calls
            childrenResult[key] = (control as FormGroup<T>).validate()
          }
        }
      }
    }
    return childrenResult;
  }

  validateAndCompute() {
    const result = this.validate();
    console.log(result)
    return this.compute(result);
  }

  compute(validationResult: GroupValidationResult) {
    const childrenPoints = {} as GroupPoints<T>

    for (const key in this.controls) {
      if (this.controls.hasOwnProperty(key)) {
        const control = this.controls[key] as AbstractControl<T>;
        const result = validationResult[key];
        if (control) {

          if (control.isLeaf()) {
            // console.log(key, result, control.value);
            childrenPoints[key] = result == null ? control.config?.points ?? 0 : undefined

          }
          else if (result != null) {
            //recursive calls
            childrenPoints[key] = (control as FormGroup<T>).compute(result)
          }
        }
      }
    }
    return this._compute(childrenPoints);

  }
  isLeaf() {
    return false;
  }
}


export type FormAnswerMetadata = ComputePoints & {
  deductions?: [number, string][]
}

export class FormBuilder {
  
  static group<T>(controlsConfig: ControlsConfig<T>, compute?: ComputeFunction<T>): FormGroup<T> {
      return new FormGroup<T>(controlsConfig, compute);
  }  
  
  static answer<T>(validators: Validators<T>, metaData?: FormAnswerMetadata) {
    return new FormControl<T, FormAnswerMetadata>(undefined, validators, metaData)
  }
  static answerValue<T>(value: T, metaData?: FormAnswerMetadata) {    
    return new FormControl<T, FormAnswerMetadata>(undefined, CoreValidators.EqualValidator(value), metaData)
  }
  static answerOption<T>(value: T, metaData?: FormAnswerMetadata) {    
    return new FormControl<Option<T>, FormAnswerMetadata>(undefined, control => {
      // returns null if value is valid, or an error message otherwise 
      return control.value?.value === value ? undefined : { '': 'This value is invalid' };
    })
  }
}