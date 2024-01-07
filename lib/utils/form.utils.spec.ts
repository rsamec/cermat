import { expect, test } from 'vitest'
import { ComputePoints, FormControl, FormGroup, } from './form.utils';
import { CoreValidators } from './validators';
import { Maybe } from './utils';
import { AnswerBuilder } from './form-answers';

test('compute points', () => {
  const form = new FormGroup({
    1: new FormControl<number, ComputePoints>(undefined, CoreValidators.EqualValidator(20), {
      points: 1
    }),
    2: new FormGroup({
      2.1: new FormControl<number, ComputePoints>(undefined, CoreValidators.EqualValidator(1.2), {
        points: 2
      }),
      2.2: new FormControl<number, ComputePoints>(undefined, CoreValidators.EqualValidator(1_600_000), {
        points: 1
      })
    })
  });
  // no answers
  expect(form.validateAndCompute()).toBe(0);

  // Simulate changes answer 1
  form.controls[1].setValue(20);
  expect(form.validateAndCompute()).toBe(1);


  // Simulate changes answer 2.1
  form.controls[2].controls['2.1'].setValue(1.2);
  expect(form.controls[2].validateAndCompute()).toBe(2)
  expect(form.validateAndCompute()).toBe(3);

  // Simulate changes answer 2.2
  form.controls[2].controls['2.2'].setValue(1_600_000);
  expect(form.controls[2].validateAndCompute()).toBe(3)
  expect(form.validateAndCompute()).toBe(4);

})

test('compute points - custom compute', () => {
  const form = new FormGroup({
    11.1: new FormControl<boolean, ComputePoints>(undefined, CoreValidators.EqualValidator(false)),
    11.2: new FormControl<boolean, ComputePoints>(undefined, CoreValidators.EqualValidator(true)),
    11.3: new FormControl<boolean, ComputePoints>(undefined, CoreValidators.EqualValidator(false)),
  }, points => {
    const arr = Object.entries(points).map(([, d]) => d as Maybe<number>);
    const succesAnswersCount = arr.filter(d => d != null).length;
    return succesAnswersCount <= 1 ? 0 : succesAnswersCount === arr.length ? 4 : 2
  })


  // no correct answers - 0 points
  expect(form.validateAndCompute()).toBe(0);

  // one correct answers - 0 points
  form.controls['11.2'].setValue(true);
  expect(form.validateAndCompute()).toBe(0);


  // two correct answers - 2 points
  form.controls['11.1'].setValue(false);
  expect(form.validateAndCompute()).toBe(2);

  // all correct answers - 4 points
  form.controls['11.3'].setValue(false);
  expect(form.validateAndCompute()).toBe(4);
})