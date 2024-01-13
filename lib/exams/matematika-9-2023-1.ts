import { AnswerBuilder } from "../utils/form-answers";

const group = AnswerBuilder.group;
const pointOptions = [{ value: 0, name: "0 bodů" }, { value: 1, name: "1 bod" }, { value: 2, name: "2 body" }];
const form = group({
  1: { verifyBy: { kind: "equal", args: 20 }, points: 1, inputType: 'number' },
  2: group({
    2.1: { verifyBy: { kind: "equal", args: 20 }, points: 2, inputType: 'number' },
    2.2: { verifyBy: { kind: "equal", args: 1_600_000 }, points: 1, inputType: 'number' },
  }),
  3: group({
    3.1: { verifyBy: { kind: 'equalFraction', args: [4, 9] }, points: 1, inputType: 'text' },
    3.2: { verifyBy: { kind: 'equalFraction', args: [-2, 7] }, points: 1, inputType: 'text' },
    3.3: {
      verifyBy: { kind: 'equalFraction', args: [5, 14] },
      points: 2,
      inputType: 'text'
    }
  }),
  4: group({
    4.1: { verifyBy: { kind: 'equalFraction', args: [4, 9] }, points: 1, inputType: 'text' },
    4.2: { verifyBy: { kind: 'equalFraction', args: [-2, 7] }, points: 1, inputType: 'text' },
    4.3: { verifyBy: { kind: 'equalFraction', args: [5, 14] }, points: 2, inputType: 'text' }
  }),
  5: group({
    5.1: { verifyBy: { kind: 'equalFraction', args: [4, 9] }, points: 1, inputType: 'text' },
    5.2: { verifyBy: { kind: 'equalFraction', args: [-2, 7] }, points: 1, inputType: 'text' },
  }),
  6: group({
    6.1: { verifyBy: { kind: 'equalFraction', args: [4, 9] }, points: 1, inputType: 'text' },
    6.2: { verifyBy: { kind: 'equalFraction', args: [-2, 7] }, points: 1, inputType: 'text' },
  }),
  7: group({
    7.1: { verifyBy: { kind: 'equalFraction', args: [4, 9] }, points: 1, inputType: 'text' },
    7.2: { verifyBy: { kind: 'equalFraction', args: [-2, 7] }, points: 1, inputType: 'text' },
    7.3: { verifyBy: { kind: 'equalFraction', args: [5, 14] }, points: 2, inputType: 'text' }
  }),
  8: group({
    8.1: { verifyBy: { kind: 'equalFraction', args: [4, 9] }, points: 1, inputType: 'text' },
    8.2: { verifyBy: { kind: 'equalFraction', args: [-2, 7] }, points: 1, inputType: 'text' },
    8.3: { verifyBy: { kind: 'equalFraction', args: [5, 14] }, points: 2, inputType: 'text' }
  }),
  9: {
    verifyBy: { kind: 'selfEvaluate', args: { options: pointOptions } }, points: 1
  },
  10: { verifyBy: { kind: "selfEvaluate", args: { options: pointOptions } }, points: 1 },
  11: group({
    11.1: { verifyBy: { kind: 'equalOption', args: false }, inputType: 'boolean' },
    11.2: { verifyBy: { kind: 'equalOption', args: true }, inputType: 'boolean' },
    11.3: { verifyBy: { kind: 'equalOption', args: false }, inputType: 'boolean' },
  }, {
    compute: {
      kind: 'group'
    }
  }),
  12: { verifyBy: { kind: 'equalOption', args: 'B' }, points: 1, inputType: 'options' },
});
export default form;