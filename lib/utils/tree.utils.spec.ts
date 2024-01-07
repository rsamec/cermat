import { expect, test } from 'vitest'
import { TreeNode, createTree, getAllLeafsWithAncestors } from './tree.utils';

interface NodeData {
  name: string
}
test('crete tree from sorted list based on leading spaces', () => {
  function countLeadingSpaces(input: string): number {
    const leadingSpaces = input.match(/^\s*/)?.[0] || '';
    return leadingSpaces.length;
  }
  // Example usage
  const sortedList: TreeNode<NodeData>[] = [
    { data: { name: 'Root 1' } },
    { data: { name: ' Child 1-1' } },
    { data: { name: ' Child 1-2' } },
    { data: { name: ' Child 1-3' } },
    { data: { name: 'Root 2' } },
    { data: { name: ' Child 2-1' } },
    { data: { name: ' Child 2-2' } },
  ];

  const tree = createTree(sortedList, (child: NodeData, potentialParent: NodeData) => {
    // Check if the child node has a greater depth (more leading spaces) than the potential parent
    return child.name.startsWith(' '.repeat(countLeadingSpaces(potentialParent.name) + 1));
  });

  expect(tree.length).toBe(2);
  expect(tree[0].children?.length).toBe(3);
  expect(tree[1].children?.length).toBe(2);

})

test('crete tree from sorted list based on specific names', () => {

  // Example usage
  const sortedList: TreeNode<NodeData>[] = [
    { data: { name: 'Root' } },
    { data: { name: 'Child' } },
    { data: { name: 'Child' } },
    { data: { name: 'Child' } },
    { data: { name: 'Root' } },
    { data: { name: 'Child' } },
    { data: { name: 'Child' } },
  ];

  function order(name: string) {
    if (name == "Root") return 1;
    if (name == "Child") return 2;
    return 0;
  }

  const tree = createTree(sortedList, (child, potentialParent) => order(child.name) > order(potentialParent.name));

  expect(tree.length).toBe(2);
  expect(tree[0].children?.length).toBe(3);
  expect(tree[1].children?.length).toBe(2);

})

test('get all leafs with ancestors', () => {
  const tree: TreeNode<NodeData> = {
    data: { name: 'Root' },
    children: [
      {
        data: { name: 'Child 1' },
        children: [
          { data: { name: 'Leaf 1-1' } },
          { data: { name: 'Leaf 1-2' } },
        ],
      },
      {
        data: { name: 'Child 2' },
        children: [
          { data: { name: 'Leaf 2-1' } },
          { data: { name: 'Leaf 2-2' } },
        ],
      },
    ],
  };

  const leafs = getAllLeafsWithAncestors(tree);
  expect(leafs.length).toBe(4)
})


