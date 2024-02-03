import { expect, test } from 'vitest'
import { GroupControl, FieldControl, requiredValidator, patternValidator } from '@rx-form/core'

import { Maybe } from './utils';
import { AnswerBuilder, convertTree } from './quiz-specification';
import { convertToForm, getControlChildren, patternCatalog } from './form.utils';
import { TextComponentFunctionSpec } from './catalog-function';

test('validate form', () => {
  const form = new GroupControl({
    1: new FieldControl<Maybe<number>>(undefined, { validators: [requiredValidator] }),
    2: new GroupControl({
      2.1: new FieldControl<Maybe<number>>(undefined, { validators: [requiredValidator] }),
      2.2: new FieldControl<Maybe<number>>(undefined, { validators: [requiredValidator] })
    })
  });
  // no answers
  expect(form.valid).toBe(false)


  // Simulate changes answer 1
  form.get("1").setValue(20);
  expect(form.get("1").valid).toBe(true)


  // // Simulate changes answer 2.1
  // form.controls[get("2").get("2.1").setValue(20)
  // expect(Object.keys(form.controls[2].validate() ?? {})).toEqual(['2.2'])
  // expect(Object.keys(form.validate() ?? {})).toEqual(['2']);

  // // Simulate changes answer 2.2
  // form.controls[2].controls['2.2'].setValue(1_600_000);
  // expect(form.controls[2].validate()).toBeNull()
  // expect(form.validate()).toBeNull();

})

test('convert answer tree to form tree', () => {

  const inputBy = { kind: 'number' as const };

  const quizSpec = AnswerBuilder.group({
    1: { verifyBy: { kind: "equal", args: 20 }, points: 1, inputBy },
    2: AnswerBuilder.group({
      2.1: { verifyBy: { kind: "equal", args: 20 }, points: 2, inputBy },
      2.2: { verifyBy: { kind: "equal", args: 1_600_000 }, points: 1, inputBy },
    }),
  })

  const quizTree = convertTree(quizSpec);
  const quizForm = convertToForm(quizTree);

  expect(getControlChildren(quizForm).length).toBe(2)
  expect(getControlChildren(quizForm, "1").length).toBe(0)

  expect(getControlChildren(quizForm, "2").length).toBe(2)
  expect(getControlChildren(quizForm, "2.1").length).toBe(0)
  expect(getControlChildren(quizForm, "2.2").length).toBe(0)
})

test('convert answer tree to form tree inputs as arrays', () => {
  const inputBy = [{ kind: 'number' as const }, { kind: 'number' as const }, { kind: 'number' as const }]

  const quizSpec = AnswerBuilder.group({
    1: { verifyBy: { kind: "equal", args: 20 }, points: 1, inputBy },
    2: AnswerBuilder.group({
      2.1: { verifyBy: { kind: "equal", args: 20 }, points: 2, inputBy },
      2.2: { verifyBy: { kind: "equal", args: 1_600_000 }, points: 1, inputBy },
    }),
  })

  const quizTree = convertTree(quizSpec);
  const quizForm = convertToForm(quizTree);

  expect(getControlChildren(quizForm).length).toBe(2)
  expect(getControlChildren(quizForm, "1").length).toBe(3)

  expect(getControlChildren(quizForm, "2").length).toBe(2)
  expect(getControlChildren(quizForm, "2.1").length).toBe(3)
  expect(getControlChildren(quizForm, "2.2").length).toBe(3)

})

test('convert answer tree to form tree inputs as object', () => {
  const inputBy = {
    a: { kind: 'number' as const },
    b: { kind: 'number' as const },
    c: { kind: 'number' as const },
  }

  const quizSpec = AnswerBuilder.group({
    1: { verifyBy: { kind: "equal", args: 20 }, points: 1, inputBy },
    2: AnswerBuilder.group({
      2.1: { verifyBy: { kind: "equal", args: 20 }, points: 2, inputBy },
      2.2: { verifyBy: { kind: "equal", args: 1_600_000 }, points: 1, inputBy },
    }),
  })

  const quizTree = convertTree(quizSpec);
  const quizForm = convertToForm(quizTree);

  expect(getControlChildren(quizForm).length).toBe(2)

  expect(getControlChildren(quizForm, "1").length).toBe(3)

  expect(getControlChildren(quizForm, "2").length).toBe(2)
  expect(getControlChildren(quizForm, "2.1").length).toBe(3)
  expect(getControlChildren(quizForm, "2.2").length).toBe(3)

})
test('pattern regex - ratio', () => {  
  const regex = new RegExp(patternCatalog.ratio.regex)
  //matched
  expect("1:1".match(regex)).not.toBeNull()
  expect("1:2:3".match(regex)).not.toBeNull()
  expect("12:234:3456".match(regex)).not.toBeNull()
  //spaces allowed
  expect(" 12 : 234 : 3456 ".match(regex)).not.toBeNull()

  //unmatched
  expect("1".match(regex)).toBeNull()
  expect("1:1:".match(regex)).toBeNull()
  expect("a".match(regex)).toBeNull()
})