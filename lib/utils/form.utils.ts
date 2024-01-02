export type Maybe<T> = T | undefined;
export type ChildrenPoints<T> = { [key in keyof T]: Maybe<number> }
//type AbstractControlType<T> = FormControl<T> | FormGroup<T>;

export type ValidationFunction<T> = (control: FormControl<T, any>) => Object | null;
export type Validators<T> = ValidationFunction<T>[] | ValidationFunction<T>
export type ComputeFunction<T> = (controls: ChildrenPoints<T>) => number;
export interface AbstractControl<T> {
  //get<K extends keyof T>(key: K): AbstractControlType<T[K]>; 
  //validate(): string | null; 
  isLeaf(): this is FormControl<T, ComputePoints>
}
export type ComputePoints = { points?: number }
export class FormControl<T, M extends ComputePoints> implements AbstractControl<T> {
  private _value: Maybe<T>;
  private _validations: ValidationFunction<T>[] = [];

  constructor(value: Maybe<T>, validations?: Validators<T>, public config?: M) {
    this._value = value;
    this._validations = validations !== undefined ? Array.isArray(validations) ? validations : [validations] : []
  }

  get value(): Maybe<T> {
    return this._value;
  }

  setValue(value: T): void {
    if (this._value !== value) {
      this._value = value;
    }
  }

  validate() {
    for (const validation of this._validations) {
      const error = validation(this);
      if (error) {
        return error;
      }
    }
    return null;
  }
  isLeaf() {
    return true;
  }
}

function sum<T>(points: ChildrenPoints<T>) {
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

  compute() {
    const childrenPoints = {} as ChildrenPoints<T>

    for (const key in this.controls) {
      if (this.controls.hasOwnProperty(key)) {
        const control = this.controls[key] as AbstractControl<T>;
        if (control) {
          if (control.isLeaf()) {
            const result = control.validate();
            // console.log(key, result, control.value);
            childrenPoints[key] = result == null ? control.config?.points ?? 0 : undefined

          }
          else {
            //recursive calls
            childrenPoints[key] = (control as FormGroup<T>).compute()
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