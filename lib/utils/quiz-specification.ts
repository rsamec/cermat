import { ComponentFunctionSpec, ComputeFunctionSpec, ValidationFunctionSpec } from "./catalog-function";
import { TreeNode } from "./tree.utils"


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
  inputBy?: ComponentFunctionSpec
}

export interface AnswerGroupMetadata<T> {
  computeBy?: ComputeFunctionSpec
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