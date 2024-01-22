import { AnswerBuilder } from "../utils/quiz-specification";

const group = AnswerBuilder.group;
const pointOptions = [{ value: 0, name: "0 bodů" }, { value: 1, name: "1 bod" }, { value: 2, name: "2 body" }];
const form = group({
  1: { verifyBy: { kind: "equal", args: 20 }, points: 1, inputBy: { kind: 'number', args: { suffix: 'minut' } } },
  2: group({
    2.1: { verifyBy: { kind: "equal", args: 1.2 }, points: 2, inputBy: { kind: 'math', args: { suffix: 'litru', hintType: 'fraction' } } },
    2.2: { verifyBy: { kind: "equal", args: 1_600_000 }, points: 1, inputBy: { kind: 'number', args: { suffix: 'krychliček' } } },
  }),
  3: group({
    3.1: { verifyBy: { kind: 'equalFraction', args: [4, 9] }, points: 1, inputBy: { kind: 'math', args: { hintType: 'fraction' } } },
    3.2: { verifyBy: { kind: 'equalFraction', args: [-2, 7] }, points: 1, inputBy: { kind: 'math', args: { hintType: 'fraction' } } },
    3.3: {
      verifyBy: { kind: 'equalFraction', args: [5, 14] },
      points: 2,
      inputBy: { kind: 'math', args: { hintType: 'fraction' } }
    }
  }),
  4: group({
    4.1: { verifyBy: { kind: 'equalMath', args: 'x(2x-1)' }, points: 1, inputBy: { kind: 'math', args: { hintType: 'expression' } } },
    4.2: { verifyBy: { kind: 'equalMath', args: '4/9a2-4a+9' }, points: 1, inputBy: { kind: 'math', args: { hintType: 'expression' } } },
    4.3: { verifyBy: { kind: 'equalMath', args: 'n2+19n+7' }, points: 2, inputBy: { kind: 'math', args: { hintType: 'expression' } } }
  }),
  5: group({
    5.1: { verifyBy: { kind: 'equalFraction', args: [4, 9] }, points: 2, inputBy: { kind: 'math', args: { hintType: 'equation' } } },
    5.2: { verifyBy: { kind: 'equalFraction', args: [-2, 7] }, points: 2, inputBy: { kind: 'math', args: { hintType: 'equation' } } },
  }),
  6: group({
    6.1: { verifyBy: { kind: 'equal', args: 24 }, points: 1, inputBy: { kind: 'number', args: { suffix: 'cm^2' } } },
    6.2: { verifyBy: { kind: 'equal', args: 64 }, points: 1, inputBy: { kind: 'number', args: { suffix: 'cm^2' } } },
  }),
  7: group({
    7.1: { verifyBy: { kind: 'equal', args: 25 }, points: 1, inputBy: { kind: 'number', args: { prefix: 'o', suffix: '%' } } },
    7.2: { verifyBy: { kind: 'equal', args: 21 }, points: 1, inputBy: { kind: 'number', args: { suffix: 'žáků' } } },
    7.3: { verifyBy: { kind: 'equalMath', args: "3:7" }, points: 1, inputBy: { kind: 'math', args: { hintType: 'ratio' } } }
  }),
  8: group({
    8.1: { verifyBy: { kind: 'equalMath', args: "0.75a" }, points: 1, inputBy: { kind: 'math', args: { hintType: 'ratio', hint: 'Odpověď zapište s proměnnou a.' } } },
    8.2: { verifyBy: { kind: 'equal', args: 40 }, points: 2, inputBy: { kind: 'number', args: { prefix: 'a = ', suffix: 'm' } } },
    8.3: { verifyBy: { kind: 'equal', args: 100 }, points: 1, inputBy: { kind: 'number', args: { prefix: 'o', suffix: 'm^2' } } }
  }),
  9: {
    verifyBy: { kind: 'selfEvaluate', args: { options: pointOptions } }
  },
  10: { verifyBy: { kind: "selfEvaluate", args: { options: pointOptions.concat({ value: 3, name: '3 body' }) } }},
  11: group({
    11.1: { verifyBy: { kind: 'equalOption', args: false }, inputBy: { kind: 'bool' } },
    11.2: { verifyBy: { kind: 'equalOption', args: true }, inputBy: { kind: 'bool' } },
    11.3: { verifyBy: { kind: 'equalOption', args: false }, inputBy: { kind: 'bool' } },
  }, {
    computeBy: {
      kind: 'group', args: [{ points: 2, min: 2 }, { points: 4, min: 3 }]
    }
  }),
  12: { verifyBy: { kind: 'equalOption', args: 'C' }, points: 2, inputBy: { kind: 'options' } },
  13: { verifyBy: { kind: 'equalOption', args: 'D' }, points: 2, inputBy: { kind: 'options' } },
  14: { verifyBy: { kind: 'equalOption', args: 'B' }, points: 2, inputBy: { kind: 'options' } },
  15: group({
    15.1: { verifyBy: { kind: 'equalOption', args: 'E' }, inputBy: { kind: 'options' } },
    15.2: { verifyBy: { kind: 'equalOption', args: 'C' }, inputBy: { kind: 'options' } },
    15.3: { verifyBy: { kind: 'equalOption', args: 'A' }, inputBy: { kind: 'options' } },
  }, {
    computeBy: {
      kind: 'group', args: [{ points: 2, min: 1 }, { points: 4, min: 2 }, { points: 6, min: 3 }]
    }
  }),
  16: group({
    16.1: { verifyBy: { kind: 'equal', args: 81 }, points: 1, inputBy: { kind: 'number', args: { suffix: 'bílých trojúhelníků' } } },
    16.2: { verifyBy: { kind: 'equal', args: 364 }, points: 1, inputBy: { kind: 'number', args: { suffix: 'šedých trojúhelníků' } } },
    16.3: { verifyBy: { kind: 'equal', args: 19_683 }, points: 2, inputBy: { kind: 'number', args: { suffix: 'bílých trojúhelníků' } } }
  }),

});
export default form;