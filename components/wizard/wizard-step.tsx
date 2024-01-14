'use client'
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "../../lib/store";
import { AnswerState, Question } from "@/lib/models/quiz";
import InputNumber from "../core/InputNumber";
import { FormControl } from "@/lib/utils/form.utils";
import TextInput from "../core/TextInput";
import { createBoolAnswer, createOptionAnswer } from "@/lib/utils/input-builder";
import { AnswerMetadata } from "@/lib/utils/form-answers";
import { useEffect, useState } from "react";
import Image from 'next/image';
import { extractContentInSquareBrackets } from "@/lib/utils/parser.utils";
import Badge from "../core/Badge";
import IconBadge from "../core/IconBadge";
import { faThumbsUp, faThumbsDown, faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const mapDispatch = (dispatch: Dispatch) => ({
  setAnswer: (args: { questionId: string, answer: any }) => dispatch.quiz.setAnswer(args),
  next: () => dispatch.quiz.goToNextStep(),
  back: () => dispatch.quiz.goToPreviousStep(),
});



type DispatchProps = ReturnType<typeof mapDispatch>;
type Props = { question: Question, answerState: AnswerState } & DispatchProps


function inputGroup(input: React.ReactNode, button: React.ReactNode, { prefix, suffix }: { prefix?: string, suffix?: string }) {
  return <div className="relative mb-4 flex flex-wrap items-stretch">
    {prefix != null ? <span
      className="flex items-center whitespace-nowrap rounded-l border border-r-0 border-solid border-neutral-300 px-3 py-[0.25rem] text-center text-base font-normal leading-[1.6] text-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"
    >{prefix}</span> : null}
    {input}

    {suffix != null ? <span
      className="flex items-center whitespace-nowrap rounded-r border border-l-0 border-solid border-neutral-300 px-3 py-[0.25rem] text-center text-base font-normal leading-[1.6] text-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"
    >{suffix}</span> : null}
    <div className="flex items-center">
      {button}
    </div>

  </div>

}

function renderInput(question: Question, control: FormControl<any, AnswerMetadata<any>>, setAnswer: any) {

  if (question.metadata.inputType === "number") {
    return inputGroup(
      <InputNumber control={control} className="relative m-0 block w-[1px] min-w-0 flex-auto rounded-r border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base text-right font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary" ></InputNumber>,
      <button className="btn btn-blue" onClick={() => setAnswer({ questionId: question.id, answer: control.value })}>Overit</button>,
      {})
  }
  else if (question.metadata.inputType === "text") {
    return inputGroup(<TextInput control={control} className="relative m-0 block w-[1px] min-w-0 flex-auto rounded-r border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base text-right font-normal leading-[1.6] text-neutral-700 outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-primary focus:text-neutral-700 focus:shadow-[inset_0_0_0_1px_rgb(59,113,202)] focus:outline-none dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200 dark:focus:border-primary"></TextInput>,
      <button className="btn btn-blue" onClick={() => setAnswer({ questionId: question.id, answer: control.value })}>Overit</button>,
      {})
  }
  else if (question.metadata.inputType === "boolean") {
    return createBoolAnswer(control, (value) => setAnswer({ questionId: question.id, answer: value }))
  }
  else if (question.metadata.inputType === "options") {
    return createOptionAnswer(control,
      question.data?.options != null ? question.data?.options?.map(d => ({ name: d, value: extractContentInSquareBrackets(d) })) : [],
      (value) => setAnswer({ questionId: question.id, answer: value }));
  }
  return null
}


const WizardStep: React.FC<Props> = ({ question, answerState, setAnswer, next, back }) => {

  const [flag, setFlag] = useState(false);
  const [error, setError] = useState(true);
  const { status, value } = answerState;
  const formControl = new FormControl(value);


  useEffect(() => {
    setFlag(false);
    setError(true);
  }, [question])



  const hasInput = question.metadata.inputType != null;

  const disabled = (status === "correct")

  return (
    <div className="flex flex-col gap-10" >

      <div
        className="prose lg:prose-xl bg-white p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 flex flex-col space-y-2"
        dangerouslySetInnerHTML={{ __html: question.data?.content }}
      />


      <div>

        {hasInput ? renderInput(question, formControl, setAnswer) : null}

        {!hasInput ?
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
                <div>{createOptionAnswer(formControl, question.metadata.verifyBy.args.options, (value) => {
                  if (value === undefined) return;
                  setAnswer({ questionId: question.id, answer: value });
                })}</div>
              </section>
            </details>
          </div> : null}
        <div className="flex">
          <div className="grow"> </div>
          <div className="grid grid-cols-3 gap-2">

            <div>
              {
                status === "incorrect" ? <IconBadge type="Danger" icon={faThumbsDown}></IconBadge> :
                  status === "correct" ? <IconBadge type="Success" icon={faThumbsUp}></IconBadge> : null
              }
            </div>
            <button className="btn"
              onClick={() => back()}><FontAwesomeIcon icon={faAngleLeft} /></button>
            <button className="btn"
              onClick={() => next()}><FontAwesomeIcon icon={faAngleRight} /></button>

          </div>
        </div>

      </div>

    </div>
  );
}

const WizardStepContainer = connect(null, mapDispatch)(WizardStep);
export default WizardStepContainer;