import { TreeNode } from "./tree.utils"
import { Option } from "./utils";


export type ComputeFunctionArgs<T> = { args: T }
export type GroupPoints<T> = { [key in keyof T]: number | undefined }

export type SumCompute = {
  kind: 'sum'
}
export type GroupCompute = {
  kind: 'group'
}
export type ComputeFunctionSpec = SumCompute | GroupCompute

export type ValidationFunctionArgs<T> = { args: T }
export type FractionEqualValidator = ValidationFunctionArgs<[number, number]> & {
  kind: "equalFraction"
}
export type EqualValidator<T> = ValidationFunctionArgs<T> & {
  kind: "equal"
}
export type EqualOptionValidator<T> = ValidationFunctionArgs<T> & {
  kind: "equalOption"
}
export type SelfEvaluateValidator = ValidationFunctionArgs<{ options: Option<number>[] }> & {
  kind: "selfEvaluate"
}
export type ValidationFunctionSpec<T> = EqualValidator<T> | EqualOptionValidator<T> | FractionEqualValidator | SelfEvaluateValidator;


export type MixedChildren<T> = { [K in keyof T]: T[K] extends AnswerGroup<any> ? T[K] : AnswerMetadata<any> };

export class AnswerBuilder {
  static group<T>(children: MixedChildren<T>, metadata?: AnswerGroupMetadata<T>) {
    return new AnswerGroup<T>(children, metadata);
  }
  static answer<T>(verifyBy: ValidationFunctionSpec<T>) {
    return { verifyBy };
  }
}

export interface AnswerMetadata<T> {
  verifyBy: ValidationFunctionSpec<T>
  points?: number
  inputType?: 'boolean' | 'number' | 'text' | 'options'
}

export interface AnswerGroupMetadata<T> {
  compute: ComputeFunctionSpec
}

export type AnswerNode<T> = AnswerGroup<T> | AnswerMetadata<T>;

export function isGroup<T>(node: AnswerNode<T>): node is AnswerGroup<T> {
  if (node instanceof AnswerGroup) return true;
  if (Object.keys((node as any)?.children ?? {}).length > 0) return true;
  return false;
}
export class AnswerGroup<T> {
  constructor(public children: MixedChildren<T>, public metadata?: AnswerGroupMetadata<T>) {
  }

  // Method to get all leaf nodes
  getAllLeafNodes() {
    const leafNodes: AnswerMetadata<any>[] = [];

    const traverse = (node: AnswerNode<any>) => {
      if (isGroup(node)) {
        for (const key in node.children) {
          if (!node.children.hasOwnProperty(key)) {
            continue;
          }
          traverse(node.children[key]);
        }

      } else {
        leafNodes.push(node);
      }
    };

    traverse(this);

    return leafNodes;
  }
}


export function convertTree<T>(tree: AnswerGroup<any>) {

  const traverse = (id: string, node: AnswerNode<any>): TreeNode<T> => {
    if (isGroup(node)) {
      const children = []
      for (let key in node.children) {
        children.push(traverse(key, node.children[key]));
      }
      return {
        data: { id, metadata: node.metadata } as T,
        children,
      }

    }
    else {
      return { data: { id, metadata: node } as T }
    }
  }
  return traverse("root", tree) as TreeNode<T>;
}


export class CoreVerifyiers {
  static EqualValidator<T>(value: T) {
    return (control: T) => {
      return control === value ? undefined : { '': 'This value is invalid' };
    }
  }
  static FractionEqualValidator(fraction: [number, number]) {
    return (control: string) => {
      return control === `${fraction[0]}/${fraction[1]}` ? undefined : { '': 'This value is invalid' };
    }
  }

  static EqualOptionValidator<T>(value: T) {
    return (control: Option<T>) => {
      return control.value === value ? undefined : { '': 'This value is invalid' };
    }
  }

  static SelfEvaluateValidator({options}: { options: Option<number>[] }) {
    return (control: Option<number>) => {
      return  options[options.length - 1].value == control.value ? null : control
    }
  }
}


export function getVerifyFunction<T>(spec: ValidationFunctionSpec<T>) {
  switch (spec.kind) {
    case 'equal':
      return CoreVerifyiers.EqualValidator(spec.args)
    case 'equalFraction':
      return CoreVerifyiers.FractionEqualValidator(spec.args);
    case 'equalOption':
      return CoreVerifyiers.EqualOptionValidator(spec.args);
    case 'selfEvaluate':
      return CoreVerifyiers.SelfEvaluateValidator(spec.args)
    default:
      throw new Error(`Function ${spec} not supported.`);
  }
}
