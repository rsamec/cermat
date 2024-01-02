import { expect, test } from 'vitest'
import { Maybe } from './form.utils';
import { CoreValidators } from './validators';
import { FormBuilder } from './form-answers';

test('compute exam form ', () => {
  // Usage

// Usage
const form = FormBuilder.group({
  1: FormBuilder.answerValue(20, { points: 1 }),
  2: FormBuilder.group({
    2.1: FormBuilder.answerValue(1.2, {
      points: 2, deductions: [[1, "Správná číselná hodnota je uvedena s chybnou jednotkou, např. 1,2 hodiny"]]
    }),
    2.2: FormBuilder.answerValue(1_600_000, { points: 1 }),
  }),
  3: FormBuilder.group({
    3.1: FormBuilder.answer(CoreValidators.FractionEqualValidator([4, 9]), { points: 1 }),
    3.2: FormBuilder.answer(CoreValidators.FractionEqualValidator([-2, 7]), { points: 1 }),
    3.3: FormBuilder.answer(CoreValidators.FractionEqualValidator([5, 14]), {
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
    11: FormBuilder.group({
      11.1: FormBuilder.answerValue(false),
      11.2: FormBuilder.answerValue(true),
      11.3: FormBuilder.answerValue(false),
    }, points => {
      const arr = Object.entries(points).map(([, d]) => d as Maybe<number>);
      const succesAnswersCount = arr.filter(d => d).length;
      return succesAnswersCount === 0 ? 0 : succesAnswersCount === arr.length ? 2 : 1
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