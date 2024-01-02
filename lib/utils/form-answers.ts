import { ComputeFunction, ComputePoints, ControlsConfig, FormControl, FormGroup, Validators } from "./form.utils";
import { CoreValidators } from "./validators";

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
}