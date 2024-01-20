import { AnswerBuilder } from "../utils/quiz-specification";
const group = AnswerBuilder.group;
const form = group({
  1: { verifyBy: { kind: "equalOption", args: "D" }, points: 1, inputBy: { kind: 'options' } },
  2: { verifyBy: { kind: "equalOption", args: "B" }, points: 1, inputBy: { kind: 'options' } },
  3: { verifyBy: { kind: "equalOption", args: "C" }, points: 1, inputBy: { kind: 'options' } },
  4: { verifyBy: { kind: "equalOption", args: "D" }, points: 1, inputBy: { kind: 'options' } },
  5: { verifyBy: { kind: "equalOption", args: "C" }, points: 1, inputBy: { kind: 'options' } },
  6: group({
    6.1: { verifyBy: { kind: 'equalOption', args: 'E' }, points: 1, inputBy: { kind: 'options' } },
    6.2: { verifyBy: { kind: 'equalOption', args: 'C' }, points: 1, inputBy: { kind: 'options' } },
    6.3: { verifyBy: { kind: 'equalOption', args: 'A' }, points: 1, inputBy: { kind: 'options' } },
  }),
  7: group({
    7.1: { verifyBy: { kind: 'equalOption', args: 'řeč' }, points: 1, inputBy: { kind: 'text' } },
    7.2: { verifyBy: { kind: 'equalOption', args: 'srovnání' }, points: 1, inputBy: { kind: 'text' } },
  }),
  8: group({
    8.1: { verifyBy: { kind: 'equalOption', args: false }, points: 1, inputBy: { kind: 'bool' } },
    8.2: { verifyBy: { kind: 'equalOption', args: false }, points: 1, inputBy: { kind: 'bool' } },
    8.3: { verifyBy: { kind: 'equalOption', args: false }, points: 1, inputBy: { kind: 'bool' } },
    8.4: { verifyBy: { kind: 'equalOption', args: false }, points: 1, inputBy: { kind: 'bool' } },
  },{
    computeBy: {
      kind: 'group', args: [{ points: 2, min: 4 }, { points: 1, min: 3 }]
    }
  }),


});
export default form;