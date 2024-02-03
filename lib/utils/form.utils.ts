import { BehaviorSubject, Observable } from "rxjs";
import { Maybe, Option, isEmptyOrWhiteSpace } from "./utils";
import { CoreValidators, GroupValidationResult, ValidationFunction, Validators } from "./validators";
import { TreeNode } from "./tree.utils";
import { FormGroupControlsConfig, GroupControl, FieldControl, ListControl, requiredValidator, ValidatorFn, patternValidator } from '@rx-form/core'
import { AnswerMetadataTreeNode, AnswerTreeNode, QuizQuestionCode, isComponentFunctionSpec } from "./quiz-specification";
import { str2sym } from "./math.utils";
import { ComponentFunctionSpec } from "./catalog-function";

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
    return Object.keys(childrenResult).length > 0 ? childrenResult : null;
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

export const patternCatalog = {
  'ratio': {
    regex: /^\s*\d+\s*(?::\s*\d+\s*)+$/,
    hint: "poměr zapiště pomocí ':' např. 2:5"
  }
} as const

export function convertToForm<T>(tree: TreeNode<AnswerTreeNode<T>>) {
  const validatorsBySpec = (spec: ComponentFunctionSpec, required?: boolean) => {
    return [
      ...(required ? [requiredValidator] : []),
      ...(spec.kind === 'math' ? [mathExpressionValidator] : []),
      ...(spec.kind === 'text' && spec.args?.patternType === 'ratio' ? [patternValidator(new RegExp(patternCatalog.ratio.regex))] : [])
    ]
  }
  const traverse = (node: TreeNode<AnswerTreeNode<T>>) => {

    // Check if the current node is a leaf (no children)

    if (!node.children || node.children.length === 0) {
      const data = node.data as AnswerMetadataTreeNode<T>;
      const inputBy = data.node.inputBy;
      if (inputBy == null) {
        return;
      }
      else if (isComponentFunctionSpec(inputBy)) {
        return new FieldControl<any>(undefined, {
          validators: validatorsBySpec(inputBy, true)
        });
      }
      else if (Array.isArray(inputBy)) {
        return new ListControl(inputBy.map(d => new FieldControl(undefined, { validators: validatorsBySpec(d) })))
      }
      else {
        return new GroupControl(Object.entries(inputBy).reduce((out, [key, d]) => {
          out[key] = new FieldControl(undefined, { validators: validatorsBySpec(d) })
          return out;
        }, {} as FormGroupControlsConfig))
      }
    }
    else {
      const fields: FormGroupControlsConfig = {}
      for (const childNode of node.children) {
        const node = traverse(childNode);
        if (node != null) {
          fields[childNode.data.id] = node
        }
      }
      return new GroupControl(fields);

    }
  }

  return traverse(tree) as GroupControl<any>
}

export function getControl(control: GroupControl, code: QuizQuestionCode) {
  const parts = code.split('.');
  const names = parts.reduce((out, part) => {
    const currentPart = out.length ? `${out[out.length - 1]}.${part}` : part;
    out.push(currentPart);
    return out;
  }, [] as string[]);
  try {
   return names.reduce((out, d) => out?.get(d), control)
  }
  catch (e){
    console.log(names, control)
  }
  return null;
}
export function getControlChildren(control: GroupControl, code?: QuizQuestionCode) {
  if (code == null) return Object.values(control.controls ?? {});
  const ctrl = getControl(control, code)
  return ctrl != null ? Object.values(ctrl.controls ?? {}) : []
}
export const mathExpressionValidator: ValidatorFn = (control) => {
  if (isEmptyOrWhiteSpace(control.value)) {
    return null;
  }
  try {
    str2sym(control.value)
  }
  catch (error) {
    return {
      mathExpression: {
        expression: control.value
      }
    }
  }
  return null;
};
