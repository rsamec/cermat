import { test, expect } from "vitest";
import { calculateMaxTotalPoints, convertTree } from "./quiz-specification";
import { getAllLeafsWithAncestors } from "./tree.utils";
import { group } from "./quiz-builder";
import { quizSchema } from "./zod.utils";

test('get all leafs with ancestors', () => {

  const form = group({
    1: { verifyBy: { kind: "equal", args: 20 }, points: 1 },
    2: group({
      2.1: { verifyBy: { kind: "equal", args: 20 }, points: 2, },
      2.2: { verifyBy: { kind: "equal", args: 1_600_000 }, points: 1, },
    }),
    3: group({
      3.1: { verifyBy: { kind: 'equal', args: [4, 9] }, points: 1 },
      3.2: { verifyBy: { kind: 'equal', args: [-2, 7] }, points: 1 },
      3.3: {
        verifyBy: { kind: 'equal', args: [5, 14] },
        points: 2,
      }
    }),
    11: group({
      11.1: { verifyBy: { kind: 'equalOption', args: false } },
      11.2: { verifyBy: { kind: 'equalOption', args: true } },
      11.3: { verifyBy: { kind: 'equalOption', args: false } },
    }, {
      computeBy: {
        kind: 'group',
        args: []
      }
    }),
    12: { verifyBy: { kind: 'equalOption', args: 'B' }, points: 1 },
  });


  const leafs = form.getAllLeafNodes();
  expect(leafs.length).toBe(10)
})


test('convert answer tree', () => {

  const form = group({
    1: { verifyBy: { kind: "equal", args: 20 }, points: 1, inputBy: { kind: 'number' } },
    2: group({
      2.1: { verifyBy: { kind: "equal", args: 20 }, points: 2, },
      2.2: { verifyBy: { kind: "equal", args: 1_600_000 }, points: 1, },
    }),
    3: group({
      3.1: { verifyBy: { kind: 'equal', args: [4, 9] }, points: 1 },
      3.2: { verifyBy: { kind: 'equal', args: [-2, 7] }, points: 1 },
      3.3: {
        verifyBy: { kind: 'equal', args: [5, 14] },
        points: 2,
      }
    }),
    11: group({
      11.1: { verifyBy: { kind: 'equalOption', args: false }, inputBy: { kind: 'bool' } },
      11.2: { verifyBy: { kind: 'equalOption', args: true } },
      11.3: { verifyBy: { kind: 'equalOption', args: false } },
    }, {
      computeBy: {
        kind: 'group',
        args: []
      }
    }),
    12: { verifyBy: { kind: 'equalOption', args: 'B' }, points: 1 },
  });


  const tree = convertTree(form);

  expect(tree.children?.length).toBe(5);
  expect(tree.children?.[0].children).toBeUndefined();
  expect(tree.children?.[1].children?.length).toBe(2);

  const leafs = getAllLeafsWithAncestors(tree);


  expect(leafs.length).toBe(10);
})

test('compute max points', () => {
  const verifyBy = { kind: 'equal', args: 20 } as const;
  const form = group({
    1: { verifyBy, points: 1 },
    2: group({
      2.1: { verifyBy, points: 2, },
      2.2: { verifyBy, points: 1, },
    }),
    3: group({
      3.1: { verifyBy, points: 1 },
      3.2: { verifyBy, points: 1 },
      3.3: { verifyBy, points: 2, }
    }),
    11: group({
      11.1: { verifyBy },
      11.2: { verifyBy },
      11.3: { verifyBy },
    }, {
      computeBy: {
        kind: 'group',
        args: [{
          points: 1,
          min: 2
        }, {
          points: 11,
          min: 2
        }, {
          points: 2,
          min: 2
        }]
      }
    }),
    12: { verifyBy, points: 1 },
  });

  const tree = convertTree(form);
  const maxPoints = calculateMaxTotalPoints(tree);

  expect(maxPoints).toBe(20);
})

test('compute max points by children', () => {
  const verifyBy = { kind: 'equal', args: 20 } as const;
  const form = group({
    1: { verifyBy, points: 1 },
    2: group({
      2.1: { verifyBy, points: 2, },
      2.2: { verifyBy, points: 1, },
    }),
    3: group({
      3.1: { verifyBy, points: 1 },
      3.2: { verifyBy, points: 1 },
      3.3: { verifyBy, points: 2, }
    }),
    11: group({
      11.1: { verifyBy },
      11.2: { verifyBy },
      11.3: { verifyBy },
    }, {
      computeBy: {
        kind: 'group',
        args: [{
          points: 1,
          min: 2
        }, {
          points: 11,
          min: 2
        }, {
          points: 2,
          min: 2
        }]
      }
    }),
    12: { verifyBy, points: 1 },
  });

  const tree = convertTree(form);
  const maxPoints = tree.children?.reduce((out, d) => out + calculateMaxTotalPoints(d), 0);
  expect(maxPoints).toBe(20);
})

test('check answers to schema', () => {
  const form = group({
    1: { verifyBy: { kind: "equal", args: 20 } },
    2: group({
      2.1: { verifyBy: { kind: "equal", args: 20 }, },
      2.2: { verifyBy: { kind: "equal", args: 1_600_000 }, },
    }),
    3: group({
      3.1: { verifyBy: { kind: 'equalMathExpression', args: "4/9" } },
    }),
    11: group({
      11.1: { verifyBy: { kind: 'equalOption', args: false } },
      11.2: { verifyBy: { kind: 'equalOption', args: true } },
      11.3: { verifyBy: { kind: 'equalOption', args: false } },
    }),
    12: { verifyBy: { kind: 'equalOption', args: 'B' } },
    14: { verifyBy: { kind: 'equalSortedOptions', args: ['A', 'B', 'C'] } },
    15: { verifyBy: { kind: 'equalStringCollection', args: ['hi', 'yes'] } },
    16: { verifyBy: { kind: 'equalNumberCollection', args: [2, 3] } },
    17: { verifyBy: { kind: 'equal', args: { podmet: 'materiály', prisudek: 'budou vytvořeny' } } }
  });

  const schema = quizSchema(form)

  const res = schema.safeParse(Object.fromEntries(Object.entries({
    "1": 1,
    "2.1": 1,
    "2.2": 1,
    "3.1": "1/1",
    "11.1": { value: false },
    "11.2": { value: false },
    "11.3": { value: false },
    "12": { value: "B" },
    "14": ["A", "B"],
    "15": ["ahoj", "je"],
    "16": [4, 5],
    "17": { podmet: 'materiály', prisudek: 'budou vytvořeny' }
  })
  // .map(([key, value]) => [key, {
  //   final_answer: value,
  //   explanation: ''
  // }])
));

  expect(res.success, res.error?.toString()).toBe(true)

})