'use client'
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "../../lib/store";
import { cls } from "@/lib/utils/utils";
import { AnswerState, Question } from "@/lib/models/quiz";
import InputNumber from "../core/InputNumber";
import { FormControl } from "@/lib/utils/form.utils";
import TextInput from "../core/TextInput";
import { createBoolAnswer, createOptionAnswer } from "@/lib/utils/input-builder";
import { AnswerMetadata } from "@/lib/utils/form-answers";
import { useEffect, useState } from "react";
import Image from 'next/image';

const mapDispatch = (dispatch: Dispatch) => ({
  setAnswer: (args: { questionId: string, answer: string }) => dispatch.quiz.setAnswer(args),
  next: () => dispatch.quiz.goToNextStep(),
  back: () => dispatch.quiz.goToPreviousStep(),
});



type DispatchProps = ReturnType<typeof mapDispatch>;
type Props = { question: Question, answerState: AnswerState } & DispatchProps


function renderInput(currentStep: Question, control: FormControl<any, AnswerMetadata<any>>, onChange?: (value: any) => void) {
  if (currentStep.metadata.inputType === "number") {
    return <InputNumber control={control} onChange={onChange} ></InputNumber>
  }
  else if (currentStep.metadata.inputType === "text") {
    return <TextInput control={control} onChange={onChange} ></TextInput>
  }
  else if (currentStep.metadata.inputType === "boolean") {
    return createBoolAnswer(control, onChange)
  }
  else if (currentStep.metadata.inputType === "options") {
    return createOptionAnswer(control, currentStep.data?.options != null ? currentStep.data?.options?.map(d => ({ name: d, value: d })) : [], onChange);
  }
  return null
}


const WizardStep: React.FC<Props> = ({ question, answerState, setAnswer }) => {

  const [flag, setFlag] = useState(false);
  const [error, setError] = useState(true);
  const { status, value } = answerState;
  const formControl = new FormControl(value);


  useEffect(() => {
    setFlag(false);
    setError(true);
  }, [question])



  const hasInput = question.metadata.inputType != null;


  console.log(formControl.value, error);
  const disabled = (status === "correct")
  return (
    <div>
      <div className="max-w-2xl mx-auto">
        <div
          className="prose lg:prose-xl flex flex-col space-y-2"
          dangerouslySetInnerHTML={{ __html: question.data?.content }}
        />
      </div>
      <div>

        {hasInput ? renderInput(question, formControl) : null}
        {(!hasInput) ?
          <div>


            <details className="py-5 [&_svg]:open:-rotate-180" open={flag} >
              <summary className="text-xl font-bold" onClick={(e) => {
                e.preventDefault();
                setFlag(!flag);
              }}>Zobrazit výsledek</summary>
              <section className="grid grid-cols-1 py-5" >
                <div className="relative w-full aspect-[4/3]">
                  <Image src={"/math/2013/9/9-result.jpeg"} alt='Check result' fill className="object-cover object-center" />
                </div>
                <div>{createOptionAnswer(formControl, question.metadata.verifyBy.args.options)}</div>
              </section>
            </details>




          </div> : null}
      </div>
      <div className={cls(['p-5', status === "incorrect" && 'bg-rose-200', status === "correct" && 'bg-green-200'])}>
        <div className="grid md:grid-cols-3 gap-8">
          <button className="btn btn-blue" disabled={disabled} onClick={() => setAnswer({ questionId: question.id, answer: formControl.value })}>Overit</button>
          <span>Body: {question.metadata.points}</span>
        </div>
      </div>
    </div>
  );
}

const WizardStepContainer = connect(null, mapDispatch)(WizardStep);
export default WizardStepContainer;