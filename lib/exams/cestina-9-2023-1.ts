import { AnswerBuilder } from "../utils/quiz-specification";

let adresa = {
  street: 101,
  city: 'dolni hbity'
}
interface Osoba {
  firstName: string
  lastName: string
  vek: number,
  adresa: {
    street: number
    city: string
  }
}


let osoba = {
  firstName: 'Roman',
  lastName: 'Samec',
  vek: 45,
  adresa: adresa
}
let osoba2 = {
  firstName: 'Jan',
  lastName: 'Samec',
  vek: 12,
  adresa: adresa
}

function vypisOsoby(item: Osoba) {
  return item.firstName + item.lastName + item.vek + item.adresa.city + item.adresa.street;
}
function volba(spravnaVolba: string) {
  return {
    verifyBy:
      { kind: "equalOption", args: spravnaVolba },
    points: 1,
    inputBy: {
      kind: 'options'
    }
  } as const
}


console.log(vypisOsoby(osoba))
console.log(vypisOsoby(osoba2))


const group = AnswerBuilder.group;

const form = group({
  1: volba("D"),
  2: volba("B"),
  3: { verifyBy: { kind: "equalOption", args: "C" }, points: 1, inputBy: { kind: 'options' } },
  4: { verifyBy: { kind: "equalOption", args: "D" }, points: 1, inputBy: { kind: 'options' } },
  5: { verifyBy: { kind: "equalOption", args: "C" }, points: 1, inputBy: { kind: 'options' } },
  6: group({
    6.1: { verifyBy: { kind: 'equalOption', args: 'E' }, points: 1, inputBy: { kind: 'options' } },
    6.2: { verifyBy: { kind: 'equalOption', args: 'C' }, points: 1, inputBy: { kind: 'options' } },
    6.3: { verifyBy: { kind: 'equalOption', args: 'A' }, points: 1, inputBy: { kind: 'options' } },
  }),
  7: group({
    7.1: { verifyBy: { kind: 'equal', args: 'řeč' }, points: 1, inputBy: { kind: 'text' } },
    7.2: { verifyBy: { kind: 'equal', args: 'srovnání' }, points: 1, inputBy: { kind: 'text' } },
  }),
  8: group({
    8.1: { verifyBy: { kind: 'equalOption', args: false }, points: 1, inputBy: { kind: 'bool' } },
    8.2: { verifyBy: { kind: 'equalOption', args: false }, points: 1, inputBy: { kind: 'bool' } },
    8.3: { verifyBy: { kind: 'equalOption', args: false }, points: 1, inputBy: { kind: 'bool' } },
    8.4: { verifyBy: { kind: 'equalOption', args: false }, points: 1, inputBy: { kind: 'bool' } },
  }, {
    computeBy: {
      kind: 'group', args: [{ points: 2, min: 4 }, { points: 1, min: 3 }]
    }
  }),
  9: { verifyBy: { kind: "equal", args: "je,vaše" }, points: 1, inputBy: { kind: 'text' } },
  10: { verifyBy: { kind: "equalOption", args: "A" }, points: 1, inputBy: { kind: 'options' } },
  11: { verifyBy: { kind: "equalOption", args: "D" }, points: 1, inputBy: { kind: 'options' } },
  12: { verifyBy: { kind: "equalOption", args: "C" }, points: 1, inputBy: { kind: 'options' } },
  13: group({
    13.1: { verifyBy: { kind: 'equalOption', args: false }, points: 1, inputBy: { kind: 'bool' } },
    13.2: { verifyBy: { kind: 'equalOption', args: true }, points: 1, inputBy: { kind: 'bool' } },
    13.3: { verifyBy: { kind: 'equalOption', args: true }, points: 1, inputBy: { kind: 'bool' } },
    13.4: { verifyBy: { kind: 'equalOption', args: true }, points: 1, inputBy: { kind: 'bool' } },
  }, {
    computeBy: {
      kind: 'group', args: [{ points: 2, min: 4 }, { points: 1, min: 3 }]
    }
  }),
  14: group({
    14.1: { verifyBy: { kind: 'equal', args: 'zvyklému' }, points: 1, inputBy: { kind: 'text' } },
    14.2: { verifyBy: { kind: 'equal', args: 'prožitého' }, points: 1, inputBy: { kind: 'text' } },
  }),
  15: { verifyBy: { kind: 'equalSortedOptions', args: ['B', 'A', 'F', 'C', 'E', 'D'] }, points: 1, inputBy: { kind: 'sortedOptions' } },
  16: group({
    16.1: { verifyBy: { kind: 'equalOption', args: 'podmět: závan; přísudek: byl osvěžující' }, points: 1, inputBy: { kind: 'text' } },
    16.2: { verifyBy: { kind: 'equalOption', args: 'podmět: lidé; přísudek: by mohli žít' }, points: 1, inputBy: { kind: 'text' } },
  }),
  17: { verifyBy: { kind: "equalOption", args: "A" }, points: 1, inputBy: { kind: 'options' } },
  18: { verifyBy: { kind: "equal", args: "nejvýznamnějším, spjatý, tradičně, knihomoly" }, points: 1, inputBy: { kind: 'text' } },
  19: group({
    19.1: { verifyBy: { kind: "equalOption", args: true }, inputBy: { kind: 'bool' } },
    19.2: { verifyBy: { kind: "equalOption", args: true }, inputBy: { kind: 'bool' } },
    19.3: { verifyBy: { kind: "equalOption", args: false }, inputBy: { kind: 'bool' } },
    19.4: { verifyBy: { kind: "equalOption", args: true }, inputBy: { kind: 'bool' } }
  }, {
    computeBy: {
      kind: "group", args: [{
        min: 3, points: 1
      }, {
        min: 4, points: 2
      }]
    }
  }),
  20: { verifyBy: { kind: "equalOption", args: "A" }, points: 1, inputBy: { kind: 'options' } },
  21: { verifyBy: { kind: "equalOption", args: "A" }, points: 1, inputBy: { kind: 'options' } },
  22: { verifyBy: { kind: "equalOption", args: "B" }, points: 1, inputBy: { kind: 'options' } },
  23: { verifyBy: { kind: "equalOption", args: "C" }, points: 1, inputBy: { kind: 'options' } },
  24: { verifyBy: { kind: "equalOption", args: "B" }, points: 1, inputBy: { kind: 'options' } },
  25: group({
    25.1: { verifyBy: { kind: "equalOption", args: true }, inputBy: { kind: 'bool' } },
    25.2: { verifyBy: { kind: "equalOption", args: false }, inputBy: { kind: 'bool' } },
    25.3: { verifyBy: { kind: "equalOption", args: true }, inputBy: { kind: 'bool' } },
    25.4: { verifyBy: { kind: "equalOption", args: false }, inputBy: { kind: 'bool' } },
  }, {
    computeBy: {
      kind: "group", args: [{
        min: 3, points: 1
      }, {
        min: 4, points: 2
      }]
    },}),
    26: { verifyBy: { kind: "equal", args: "dějinách, úklidu, trhu" }, points: 3, inputBy: { kind: 'text' } },

    27: { verifyBy: { kind: "equalOption", args: "B" }, points: 1, inputBy: { kind: 'options' } },
    28: { verifyBy: { kind: "equalOption", args: "D" }, points: 1, inputBy: { kind: 'options' } },
    29: { verifyBy: { kind: "equalOption", args: "C" }, points: 1, inputBy: { kind: 'options' } },

    30.1: { verifyBy: { kind: "equalOption", args: "A" }, points: 1, inputBy: { kind: 'options' } },
    30.2: { verifyBy: { kind: "equalOption", args: "D" }, points: 1, inputBy: { kind: 'options' } },
    30.3: { verifyBy: { kind: "equalOption", args: "E" }, points: 1, inputBy: { kind: 'options' } },
    30.4: { verifyBy: { kind: "equalOption", args: "C" }, points: 1, inputBy: { kind: 'options' } },

  

});

export default form;