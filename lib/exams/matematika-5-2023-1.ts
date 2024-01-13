import { AnswerBuilder } from "../utils/form-answers";

const group = AnswerBuilder.group;

const form = group({
  1: { verifyBy: { kind: "equal", args: 20 }, points: 1, inputType: 'number' },
  2: group({
    2.1: { verifyBy: { kind: "equal", args: 20 }, points: 2, },
    2.2: { verifyBy: { kind: "equal", args: 1_600_000 }, points: 1, },
  }),
  3: group({
    3.1: { verifyBy: { kind: 'equalFraction', args: [4, 9] }, points: 1 },
    3.2: { verifyBy: { kind: 'equalFraction', args: [-2, 7] }, points: 1 },
    3.3: {
      verifyBy: { kind: 'equalFraction', args: [5, 14] },
      points: 2,
    }
  }),
  11: group({
    11.1: { verifyBy: { kind: 'equalOption', args: false } },
    11.2: { verifyBy: { kind: 'equalOption', args: true } },
    11.3: { verifyBy: { kind: 'equalOption', args: false } },
  }, {
    compute: {
      kind: 'group'
    }
  }),
  12: { verifyBy: { kind: 'equalOption', args: 'B' }, points: 1 },
});
export default form;