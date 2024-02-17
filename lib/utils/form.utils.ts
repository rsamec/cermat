import { isEmptyOrWhiteSpace } from "./utils";
import { TreeNode } from "./tree.utils";
import { FormGroupControlsConfig, GroupControl, AbstractControl, FieldControl, ListControl, requiredValidator, ValidatorFn, patternValidator } from '@rx-form/core'
import { AnswerMetadataTreeNode, AnswerTreeNode, QuizQuestionCode, isComponentFunctionSpec } from "./quiz-specification";
import { str2sym } from "./math.utils";
import { ComponentFunctionSpec } from "./catalog-function";

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
        return new ListControl(inputBy.map(d => new FieldControl(undefined, { validators: validatorsBySpec(d, true) })))
      }
      else {
        return new GroupControl(Object.entries(inputBy).reduce((out, [key, d]) => {
          out[key] = new FieldControl(undefined, { validators: validatorsBySpec(d, true) })
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
  catch (e) {
    console.log(names, control)
  }
  return null;
}
export function getControlChildren(control: GroupControl, code?: QuizQuestionCode) {
  if (code == null) return Object.values(control.controls ?? {});
  const ctrl = getControl(control, code)
  return ctrl != null ? Object.values(ctrl.controls ?? {}) : []
}
function isGroupControl(control: AbstractControl): control is GroupControl {
  const children = (control as GroupControl).controls;
  return children != null && Object.keys(children).length > 0
}
export function markAsDirty(control: GroupControl) {
  const children = Object.values(control.controls ?? {});
  for (const child of children) {
    if (isGroupControl(child)) {
      markAsDirty(child)
    }
    else {
      child.markAsDirty()
    }
  }
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
