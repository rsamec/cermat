import { expect, test } from 'vitest'
import { FormControl, FormGroup, Maybe } from './form.utils';
import { CoreValidators } from './validators';

// Usage
const form = new FormGroup({
  1: new FormControl<number>(undefined, CoreValidators.EqualValidator(20), {
    points: 1
  }),
  2: new FormGroup({
    2.1: new FormControl<number>(undefined, CoreValidators.EqualValidator(1.2), {
      poinst: 2, deductions: [[1, "Správná číselná hodnota je uvedena s chybnou jednotkou, např. 1,2 hodiny"]]
    }),
    2.2: new FormControl<number>(undefined, CoreValidators.EqualValidator(1_600_000), {
      poinst: 1
    })
  }),
  3: new FormGroup({
    3.1: new FormControl<string>(undefined, CoreValidators.FractionEqualValidator([4, 9]), { points: 1 }),
    3.2: new FormControl<string>(undefined, CoreValidators.FractionEqualValidator([-2, 7]), { points: 1 }),
    3.3: new FormControl<string>(undefined, CoreValidators.FractionEqualValidator([5, 14]), {
      points: 2,
      deductions: [
        [1, `Postup řešení obsahuje právě jeden z následujících nedostatků:
- výsledný zlomek není v základním tvaru,
- jedna operace je provedena s numerickou chybou,
- teprve po uvedení správného výsledku je provedena nadbytečná chybná úprava.
`],
        [0, `Postup řešení obsahuje kterékoli z následujících nedostatků:
- je použita algoritmicky chybná operace se zlomky,
- číselný výraz je chybně upraven (např. je vynásoben společným jmenovatelem),
- řešení obsahuje více než jednu chybu.`
        ]]
    }),
    11: new FormGroup({
      11.1: new FormControl<boolean>(undefined, CoreValidators.EqualValidator(false)),
      11.2: new FormControl<boolean>(undefined, CoreValidators.EqualValidator(true)),
      11.3: new FormControl<boolean>(undefined, CoreValidators.EqualValidator(false)),
    }, points => {
      const arr = Object.entries(points).map(([, d]) => d as Maybe<number>);
      const succesAnswersCount = arr.filter(d => d).length;
      return succesAnswersCount === 0 ? 0 : succesAnswersCount === arr.length ? 2 : 1
    })
  })
});

test('compute points', () => {
  const form = new FormGroup({
    1: new FormControl<number>(undefined, CoreValidators.EqualValidator(20), {
      points: 1
    }),
    2: new FormGroup({
      2.1: new FormControl<number>(undefined, CoreValidators.EqualValidator(1.2), {
        points: 2, deductions: [[1, "Správná číselná hodnota je uvedena s chybnou jednotkou, např. 1,2 hodiny"]]
      }),
      2.2: new FormControl<number>(undefined, CoreValidators.EqualValidator(1_600_000), {
        points: 1
      })
    })
  });
  // no answers
  expect(form.compute()).toBe(0);

  // Simulate changes answer 1
  form.controls[1].setValue(20);
  expect(form.compute()).toBe(1);


  // Simulate changes answer 2.1
  form.controls[2].controls['2.1'].setValue(1.2);
  expect(form.controls[2].compute()).toBe(2)
  expect(form.compute()).toBe(3);

  // Simulate changes answer 2.2
  form.controls[2].controls['2.2'].setValue(1_600_000);
  expect(form.controls[2].compute()).toBe(3)
  expect(form.compute()).toBe(4);

})

test('compute points - custom compute', () => {
  const form = new FormGroup({
    11.1: new FormControl<boolean>(undefined, CoreValidators.EqualValidator(false)),
    11.2: new FormControl<boolean>(undefined, CoreValidators.EqualValidator(true)),
    11.3: new FormControl<boolean>(undefined, CoreValidators.EqualValidator(false)),
  }, points => {
    const arr = Object.entries(points).map(([, d]) => d as Maybe<number>);
    const succesAnswersCount = arr.filter(d => d != null).length;
    return succesAnswersCount <= 1 ? 0 : succesAnswersCount === arr.length ? 4 : 2
  })


   // no correct answers - 0 points
   expect(form.compute()).toBe(0);

   // one correct answers - 0 points
   form.controls['11.2'].setValue(true);
   expect(form.compute()).toBe(0);
 
 
   // two correct answers - 2 points
   form.controls['11.1'].setValue(false);
   expect(form.compute()).toBe(2);
 
   // all correct answers - 4 points
   form.controls['11.3'].setValue(false);
   expect(form.compute()).toBe(4);

})
