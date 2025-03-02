import { SubjectType } from "@/components/utils/exam";
import { ValidationFunctionSpec } from "./assert";
import { ComponentFunctionSpec, ComputeFunctionSpec } from "./catalog-function";
import { TreeNode } from "./tree.utils"


export type MixedChildren<T> = { [K in keyof T]: T[K] extends AnswerGroup<any> ? T[K] : AnswerMetadata<any> };
export type ResourceTypes = "video"

export type ComponentFunctionArgs<T> = { args?: T }
export type VideoResource = { kind: 'video', id: string };
export type ObservableHQResource = { kind: 'observableHQ', cells: string[] }
export type Resource = VideoResource | ObservableHQResource
export type Resources = Resource[]
export type AnswerInputBy = ComponentFunctionSpec | ComponentFunctionSpec[] | { [index: string]: ComponentFunctionSpec }
export interface AnswerMetadata<T> {
  verifyBy: ValidationFunctionSpec<T>
  points?: number
  inputBy?: AnswerInputBy
  resources?: Resources
}

export interface AnswerInfo {
  code: string,
  maxPoints: number
  questions: {
    opened: number,
    closed: number,
  }
}
export interface AnswerGroupMetadata<T> {
  computeBy?: ComputeFunctionSpec,
  info?: AnswerInfo
  inline?: boolean
}

export type AnswerNode<T> = AnswerGroup<T> | AnswerMetadata<T>;

export function isGroup<T>(node: AnswerNode<T>): node is AnswerGroup<T> {
  if (node instanceof AnswerGroupImpl) return true;
  if (Object.keys((node as any)?.children ?? {}).length > 0) return true;
  return false;
}
export interface AnswerGroup<T> {
  children: MixedChildren<T>
  metadata?: AnswerGroupMetadata<T>
}
export class AnswerGroupImpl<T> {
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


export function convertTree<T>(tree: AnswerGroup<T>) {
  const traverse = (id: string, node: AnswerNode<T>): TreeNode<Answer<T>> => {
    if (isGroup(node)) {
      const children = []
      for (let key in node.children) {
        children.push(traverse(key, node.children[key]));
      }
      return {
        data: { id, node } as Answer<T>,
        children,
      }
    }
    else {
      return { data: { id, node } as Answer<T> }
    }
  }
  return traverse("root", tree) as TreeNode<Answer<T>>;
}

export type Answer<T> = AnswerTreeNode<AnswerNode<T>>
export type AnswerMetadataTreeNode<T> = AnswerTreeNode<AnswerMetadata<T>>
export type AnswerGroupTreeNode<T> = AnswerTreeNode<AnswerGroup<T>>
export interface AnswerTreeNode<T> {
  id: string
  node: T
}

export function calculatePoints<T>(tree: TreeNode<AnswerTreeNode<T>>,
  calculate: (computeBy: ComputeFunctionSpec | null, leafs: AnswerMetadataTreeNode<any>[]) => number) {

  const traverse = (node: TreeNode<AnswerTreeNode<T>>, leafs: AnswerMetadataTreeNode<T>[], level: number = 0) => {
    let total = 0;

    // Check if the current node is a leaf (no children)
    if (!node.children || node.children.length === 0) {
      leafs.push(node.data as AnswerMetadataTreeNode<T>);
      return level === 0 ? calculate(null, leafs) : 0;
    }
    else {
      const group = node.data as AnswerGroupTreeNode<T>;
      //clear leafs for each composite node
      leafs = []
      // Recursively calculate total points for each child node						
      for (const childNode of node.children) {
        const points = traverse(childNode, leafs, level + 1);
        total += points;
        //if (level == 0) console.log(childNode.data.id, points)
      }
      //points for leafs    
      //if (level == 0) console.log(leafs.map(d => d.id))
      total += leafs.length > 0 ? calculate(group.node.metadata?.computeBy!, leafs) : 0;
    }
    return total
  }

  const totalPoints = traverse(tree, [])
  return totalPoints;
}

export function calculateMaxTotalPoints<T>(tree: TreeNode<AnswerTreeNode<T>>) {
  let totalPoints = 0;
  if (tree == null) return totalPoints;

  const calculateSum = (children: AnswerMetadataTreeNode<T>[]) => children.reduce((out, d) => {
    const verifyBy = d.node.verifyBy;

    const maxPoints = verifyBy.kind == "selfEvaluate" ?
      verifyBy.args.options.reduce((out, d) => out = out > d.value ? out : d.value, 0) :
      d.node.points ?? 0
    out += maxPoints;
    return out;
  }, 0)

  const calculate = (computeBy: ComputeFunctionSpec | null, leafs: AnswerMetadataTreeNode<any>[]) => {

    const res = computeBy != null && computeBy.kind == "group" ?
      computeBy.args.reduce((out, d) => out = out > d.points ? out : d.points, 0)
      : calculateSum(leafs);
    return res;
  }

  totalPoints = calculatePoints(tree, calculate)

  return totalPoints;

};

export type QuizQuestionCode = `${number}${'.' | ''}${number | ''}${'.' | ''}${number | ''}`;
export function isComponentFunctionSpec(spec: AnswerInputBy): spec is ComponentFunctionSpec {
  return (spec as any).kind != null
}

function parseQuestionCodeToNumbers(number: QuizQuestionCode) {
  return number.split(".").map(d => parseInt(d, 10));
}

export function getChildrenIdsByGroup(metaData: AnswerGroup<any>, ids: number[]) {
  return ids.flatMap(id => Object.keys((metaData.children[id] as any)?.children ?? {})).map(d => parseQuestionCodeToNumbers(d as QuizQuestionCode)[1])
}