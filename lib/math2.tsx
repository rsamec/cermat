'use client'
import { ReactNode } from "react";
import InputNumber from "@/components/core/InputNumber";
import TextInput from "@/components/core/TextInput";


import { FormAnswerMetadata, FormBuilder, FormControl } from "./utils/form.utils";
import { createBoolAnswer, createOptionAnswer, createQuestion } from "./utils/input-builder";
import { CoreValidators } from "./utils/validators";
import { LeafWithAncestors } from "./utils/tree.utils";
import { ParsedQuestion } from "./utils/parser.utils";
import { Maybe, Option } from "./utils/utils";


export const form = FormBuilder.group({
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
    })
  }),
  11: FormBuilder.group({
    11.1: FormBuilder.answerOption(false),
    11.2: FormBuilder.answerOption(true),
    11.3: FormBuilder.answerOption(false),
  }, points => {
    const arr = Object.entries(points).map(([, d]) => d as Maybe<number>);
    const succesAnswersCount = arr.filter(d => d).length;
    return succesAnswersCount === 0 ? 0 : succesAnswersCount === arr.length ? 2 : 1
  }),
  12: FormBuilder.answerOption("B", { points: 1 }),
});

const steps: { id: string, ctrl: FormControl<any, any>, input: (ctrl: FormControl<any, any>, options: Option<any>[]) => ReactNode }[] = [
  { id: "1", ctrl: form.controls[1], input: ctrl => <InputNumber control={ctrl} min={0} max={100} /> },
  { id: "2.1", ctrl: form.controls[2].controls['2.1'], input: ctrl => <InputNumber control={ctrl} min={0} max={100} /> },
  { id: "2.2", ctrl: form.controls[2].controls['2.1'], input: ctrl => <InputNumber control={ctrl} min={0} max={100} /> },
  { id: "3.1", ctrl: form.controls[3].controls['3.1'], input: ctrl => <TextInput control={ctrl} /> },
  { id: "3.2", ctrl: form.controls[3].controls['3.2'], input: ctrl => <TextInput control={ctrl} /> },
  { id: "3.3", ctrl: form.controls[3].controls['3.3'], input: ctrl => <TextInput control={ctrl} /> },
  { id: "4.1", ctrl: form.controls[3].controls['3.1'], input: ctrl => <TextInput control={ctrl} /> },
  { id: "4.2", ctrl: form.controls[3].controls['3.2'], input: ctrl => <TextInput control={ctrl} /> },
  { id: "4.3", ctrl: form.controls[3].controls['3.3'], input: ctrl => <TextInput control={ctrl} /> },
  { id: "5.1", ctrl: form.controls[3].controls['3.1'], input: ctrl => <TextInput control={ctrl} /> },
  { id: "5.2", ctrl: form.controls[3].controls['3.2'], input: ctrl => <TextInput control={ctrl} /> },
  { id: "6.1", ctrl: form.controls[3].controls['3.1'], input: ctrl => <TextInput control={ctrl} /> },
  { id: "6.2", ctrl: form.controls[3].controls['3.2'], input: ctrl => <TextInput control={ctrl} /> },
  { id: "7.1", ctrl: form.controls[3].controls['3.1'], input: ctrl => <TextInput control={ctrl} /> },
  { id: "7.2", ctrl: form.controls[3].controls['3.2'], input: ctrl => <TextInput control={ctrl} /> },
  { id: "7.3", ctrl: form.controls[3].controls['3.1'], input: ctrl => <TextInput control={ctrl} /> },
  { id: "8.1", ctrl: form.controls[3].controls['3.2'], input: ctrl => <TextInput control={ctrl} /> },
  { id: "8.2", ctrl: form.controls[3].controls['3.1'], input: ctrl => <TextInput control={ctrl} /> },
  { id: "8.3", ctrl: form.controls[3].controls['3.2'], input: ctrl => <TextInput control={ctrl} /> },
  { id: "11.1", ctrl: form.controls[11].controls['11.1'], input: ctrl => createBoolAnswer(ctrl) },
  { id: "11.2", ctrl: form.controls[11].controls['11.2'], input: ctrl => createBoolAnswer(ctrl) },
  { id: "11.3", ctrl: form.controls[11].controls['11.3'], input: ctrl => createBoolAnswer(ctrl) },
  { id: "12", ctrl: form.controls[12], input: (ctrl, options) => createOptionAnswer(ctrl, options) },
];

export function createSteps(leafs: LeafWithAncestors<ParsedQuestion & { headerHtml?: string, contentHtml?: string }>[]) {
  return steps.map((d, i) => {
    const matchedLeaf = leafs[i];
    return createStep(d.id, d.ctrl, 
      (ctrl) => d.input(ctrl, matchedLeaf.leaf.data.options.map(d => ({ name: d, value: d.substring(1, 3) }))),
      matchedLeaf.ancestors.map(d => d.data.headerHtml! + d.data.contentHtml!).join("")
      );
  })
}
function createStep<T>(id: string,
  control: FormControl<T, FormAnswerMetadata>,
  input: (control: FormControl<T, FormAnswerMetadata>, options?: T[]) => ReactNode,
  output: string) {
  return {
    id,
    control,
    renderComponent: () => <div>
      {createQuestion(output)}
      {/* {input(control)} */}
    </div>
  }
}

export default steps;