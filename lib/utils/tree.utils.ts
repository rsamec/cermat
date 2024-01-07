export interface TreeNode<T> {
  data: T
  children?: TreeNode<T>[];
}
export interface Node<T> extends TreeNode<T> {

}

export function createTree<T>(sortedList: TreeNode<T>[], isChild: (child: T, potentialParent: T) => boolean): TreeNode<T>[] {
  const tree: TreeNode<T>[] = [];
  let currentDepthNodes: TreeNode<T>[] = tree;

  sortedList.forEach((item) => {
    const node: TreeNode<T> = { ...item, children: [] };

    // Find the appropriate level in the tree based on the depth of indentation
    while (currentDepthNodes.length > 0 && !isChild(node.data, currentDepthNodes[currentDepthNodes.length - 1].data)) {
      currentDepthNodes.pop();
    }

    if (currentDepthNodes.length === 0) {
      tree.push(node);
      currentDepthNodes = [node];
    } else {
      currentDepthNodes[currentDepthNodes.length - 1].children!.push(node);
      currentDepthNodes.push(node);
    }
  });

  return tree;
}


export interface LeafWithAncestors<T> {
  leaf: TreeNode<T>;
  ancestors: TreeNode<T>[];
}

export function getAllLeafsWithAncestors<T>(tree: TreeNode<T>): LeafWithAncestors<T>[] {
  const result: LeafWithAncestors<T>[] = [];

  function traverse(node: TreeNode<T>, ancestors: TreeNode<T>[] = []) {
    const currentAncestors = [...ancestors, node];

    if (!node.children || node.children.length === 0) {
      // Node is a leaf
      result.push({ leaf: node, ancestors: currentAncestors });
    } else {
      // Node has children, continue traversal
      node.children.forEach((child) => traverse(child, currentAncestors));
    }
  }

  traverse(tree);

  return result;
}