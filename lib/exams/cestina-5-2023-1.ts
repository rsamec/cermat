import { AnswerBuilder, volba } from "../utils/quiz-specification";
const group = AnswerBuilder.group;

function anoNe(spravnaVolba: boolean) {
  return {
    verifyBy:
      { kind: "equalOption", args: spravnaVolba },
    points: 1,
    inputBy: {
      kind: 'bool'
    }
  } as const
}
function bodyMax2() {
  return {
    computeBy: {
      kind: 'group' as const, args: [{ points: 2, min: 4 }, { points: 1, min: 3 }]
    }
  }

}
function bodyMax3() {
  return {
    computeBy: {
      kind: 'group' as const, args: [{ points: 3, min: 3 }, { points: 2, min: 2 }, { points: 1, min: 1 }]
    }
  }
}

const pointOptions = [{ value: 0, name: "0 bodů" }, { value: 1, name: "1 bod" }, { value: 2, name: "2 body" }];

const form = group({
  1: { verifyBy: { kind: "equalOption", args: "A" }, points: 1, inputBy: { kind: 'options' } },
  2: volba("B"),
  3: volba("B"),
  4: volba("B"),
  5: group({
    5.1: anoNe(true),
    5.2: anoNe(false),
    5.3: anoNe(false),
    5.4: anoNe(true),
  }, bodyMax2()),
  6: group({
    6.1: volba("E"),
    6.2: volba("B"),
    6.3: volba("D"),
  }),
  7: group({
    7.1: { verifyBy: { kind: 'equalOption', args: 'podmět: kousky; přísudek: se objeví' }, points: 1, inputBy: { kind: 'text' } },
    7.2: { verifyBy: { kind: 'equalOption', args: 'podmět: deště (a) záplavy; přísudek: zničily' }, points: 1, inputBy: { kind: 'text' } },
  }),
  8: group({
    8.1: anoNe(false),
    8.2: anoNe(false),
    8.3: anoNe(false),
    8.4: anoNe(false),
  }),
  9: volba("D"),
  10: volba("B"),
  11: volba("A"),
  12: volba("C"),
  13: volba("A"),
  14: { verifyBy: { kind: 'selfEvaluate', args: { options: pointOptions } }, points: 1, inputBy: { kind: 'text' } },
  15: group({
    Prvníčást: volba("C"),
    Druháčást: volba("E"),
    Třetíčást: volba("B"),
    Čtvrtáčást: volba("D"),
    Pátáčást: volba("A"),
    Šestáčást: volba("F"),


  }),
  16: group({
    16.1: { verifyBy: { kind: 'equalOption', args: ' např. Až skončí trénink, půjdeme do parku. ' }, points: 1, inputBy: { kind: 'text' } },
    16.2: { verifyBy: { kind: 'equalOption', args: ' např. Rozhodl jsem se napsat román. ' }, points: 1, inputBy: { kind: 'text' } },
  }),
  17: { verifyBy: { kind: 'equalOption', args: ' čistota, důsledek, plavání ' }, points: 1, inputBy: { kind: 'text' } },
  18: { verifyBy: { kind: 'equalOption', args: ' vyzvídat, nerozuměl, autogramy, nejúžasnější ' }, points: 1, inputBy: { kind: 'text' } },
  19: group({
    19.1: anoNe(false),
    19.2: anoNe(false),
    19.3: anoNe(false),
    19.4: anoNe(true),
  }),
  20: { verifyBy: { kind: 'equalOption', args: ' kukátku, plánu, náhodě ' }, points: 1, inputBy: { kind: 'text' } },
  21: volba("D"),
  22: volba("C"),
  23: group({
    23.1: anoNe(true),
    23.2: anoNe(false),
    23.3: anoNe(false),
    23.4: anoNe(true),
  }),
  24: volba("C"),
  25: group({
    25.1: anoNe(true),
    25.2: anoNe(false),
    25.3: anoNe(false),
    25.4: anoNe(true),
  }),
  26: volba("D"),
  27: volba("A"),
  28: group({
    28.1: volba("D"),
    28.2: volba("C"),
    28.3: volba("A"),
    28.4: volba("E"),
  })
});
export default form