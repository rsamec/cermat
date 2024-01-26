import { test, expect } from "vitest";
import { AnswerBuilder, AnswerGroup, calculateMaxTotalPoints, convertTree } from "./quiz-specification";
import { getAllLeafsWithAncestors } from "./tree.utils";

test('get all leafs with ancestors', () => {

  const form = AnswerBuilder.group({
    1: { verifyBy: { kind: "equal", args: 20 }, points: 1 },
    2: AnswerBuilder.group({
      2.1: { verifyBy: { kind: "equal", args: 20 }, points: 2, },
      2.2: { verifyBy: { kind: "equal", args: 1_600_000 }, points: 1, },
    }),
    3: AnswerBuilder.group({
      3.1: { verifyBy: { kind: 'equal', args: [4, 9] }, points: 1 },
      3.2: { verifyBy: { kind: 'equal', args: [-2, 7] }, points: 1 },
      3.3: {
        verifyBy: { kind: 'equal', args: [5, 14] },
        points: 2,
      }
    }),
    11: AnswerBuilder.group({
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

  const form = AnswerBuilder.group({
    1: { verifyBy: { kind: "equal", args: 20 }, points: 1, inputBy: { kind: 'number' } },
    2: AnswerBuilder.group({
      2.1: { verifyBy: { kind: "equal", args: 20 }, points: 2, },
      2.2: { verifyBy: { kind: "equal", args: 1_600_000 }, points: 1, },
    }),
    3: AnswerBuilder.group({
      3.1: { verifyBy: { kind: 'equal', args: [4, 9] }, points: 1 },
      3.2: { verifyBy: { kind: 'equal', args: [-2, 7] }, points: 1 },
      3.3: {
        verifyBy: { kind: 'equal', args: [5, 14] },
        points: 2,
      }
    }),
    11: AnswerBuilder.group({
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
  const form = AnswerBuilder.group({
    1: { verifyBy, points: 1 },
    2: AnswerBuilder.group({
      2.1: { verifyBy, points: 2, },
      2.2: { verifyBy, points: 1, },
    }),
    3: AnswerBuilder.group({
      3.1: { verifyBy, points: 1 },
      3.2: { verifyBy, points: 1 },
      3.3: { verifyBy, points: 2, }
    }),
    11: AnswerBuilder.group({
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