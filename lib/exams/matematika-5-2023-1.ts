import { AnswerBuilder } from "../utils/quiz-specification";

const group = AnswerBuilder.group;

const form = group({
  1: { verifyBy: { kind: "equal", args: 20 }, points: 1, inputBy: {kind: 'number'} },
  2: group({
    2.1: { verifyBy: { kind: "equal", args: 20 }, points: 2, },
    2.2: { verifyBy: { kind: "equal", args: 1_600_000 }, points: 1, },
  }),
  3: group({
    3.1: { verifyBy: { kind: 'equalMathExpression', args: "4/9" }, points: 1, inputBy: { kind: 'math', args: { hintType: 'fraction' } } },
    3.2: { verifyBy: { kind: 'equalMathExpression', args: "-2/7" }, points: 1, inputBy: { kind: 'math', args: { hintType: 'fraction' } } },
    3.3: {
      verifyBy: { kind: 'equalMathExpression', args: "5/14" },
      points: 2,
      inputBy: { kind: 'math', args: { hintType: 'fraction' } }
    }
  }),
  11: group({
    11.1: { verifyBy: { kind: 'equalOption', args: false } },
    11.2: { verifyBy: { kind: 'equalOption', args: true } },
    11.3: { verifyBy: { kind: 'equalOption', args: false } },
  }, {
    computeBy: {      
      kind: 'group', args: [{ points: 2, min: 2 }, { points: 4, min: 3 }]
    }
  }),
  12: { verifyBy: { kind: 'equalOption', args: 'B' }, points: 1 },
});
export default form;