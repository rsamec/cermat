import { expect, test } from 'vitest'
import { FormControl, FormGroup, } from './form.utils';
import { CoreValidators } from './validators';

test('validate form', () => {
  const form = new FormGroup({
    1: new FormControl<number>(undefined, CoreValidators.EqualValidator(20)),
    2: new FormGroup({
      2.1: new FormControl<number>(undefined, CoreValidators.EqualValidator(1.2)),
      2.2: new FormControl<number>(undefined, CoreValidators.EqualValidator(1_600_000))
    })
  });
  // no answers
  expect(Object.keys(form.validate() ?? {})).toEqual(['1','2']);
  

  // Simulate changes answer 1
  form.controls[1].setValue(20);
  expect(Object.keys(form.validate() ?? {})).toEqual(['2']);


  // Simulate changes answer 2.1
  form.controls[2].controls['2.1'].setValue(1.2);  
  expect(Object.keys(form.controls[2].validate() ?? {})).toEqual(['2.2'])
  expect(Object.keys(form.validate() ?? {})).toEqual(['2']);

  // Simulate changes answer 2.2
  form.controls[2].controls['2.2'].setValue(1_600_000);
  expect(form.controls[2].validate()).toBeNull()
  expect(form.validate()).toBeNull();

})