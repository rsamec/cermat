
import { ComputeFunction, ValidationFunction } from "./validators";
export type MixedChildren<T> = { [K in keyof T]: T[K] extends AnswerGroup<any> ? T[K] : AnswerMetadata<any> };

export class AnswerBuilder {
  static group<T>(children: MixedChildren<T>, metadata?: AnswerGroupMetadata<T>) {
    return new AnswerGroup<T>(children, metadata);
  }
  static answer<T>(verifyBy: ValidationFunction<T>) {
    return { verifyBy };
  }
}

export interface AnswerMetadata<T> {
  verifyBy: ValidationFunction<T>
  points?: number
  inputType?: 'boolean' | 'number' | 'text'
}

interface AnswerGroupMetadata<T> {
  compute: ComputeFunction<T>
}

type AnswerNode<T> = AnswerGroup<T> | AnswerMetadata<T>;

function isGroup<T>(node: AnswerNode<T>): node is AnswerGroup<T> {
  if (node instanceof AnswerGroup) return true;
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

