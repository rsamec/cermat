'use client'
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "../../lib/store";
import { AnswerState, AnswerStatus, Question } from "@/lib/models/quiz";
import InputNumber from "../core/InputNumber";
import { FormControl } from "@/lib/utils/form.utils";
import TextInput from "../core/TextInput";
import { createBoolAnswer, createOptionAnswer } from "@/lib/utils/component.utils";
import { useEffect, useState } from "react";
import Image from 'next/image';
import IconBadge from "../core/IconBadge";
import { faThumbsUp, faThumbsDown, faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cls } from "@/lib/utils/utils";

const mapDispatch = (dispatch: Dispatch) => ({
  setAnswer: (args: { questionId: string, answer: any }) => dispatch.quiz.setAnswer(args),
  next: () => dispatch.quiz.goToNextStep(),
  back: () => dispatch.quiz.goToPreviousStep(),
});



type DispatchProps = ReturnType<typeof mapDispatch>;
type Props = { question: Question, answerState: AnswerState } & DispatchProps


function inputGroup(input: React.ReactNode, button: React.ReactNode, { prefix, suffix }: { prefix?: string, suffix?: string }) {
  return <div className="max-w-lg relative mb-4 flex flex-wrap items-stretch">
    {prefix != null ? <span
      className="flex items-center whitespace-nowrap rounded-l border border-r-0 border-solid border-neutral-300 px-3 py-[0.25rem] text-center text-base font-normal leading-[1.6] text-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"
    >{prefix}</span> : null}
    {input}

    {suffix != null ? <span
      className="flex items-center whitespace-nowrap rounded-r border border-l-0 border-solid border-neutral-300 px-3 py-[0.25rem] text-center text-base font-normal leading-[1.6] text-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"
    >{suffix}</span> : null}

    <div className="flex items-center ml-2">
      {button}
    </div>

  </div>

}
function statusInput(status: AnswerStatus) {
  return status == "correct" ?
    "bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-green-500"
    : status === "incorrect" ?
      "bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500" :
      'text-gray-900 border border-gray-300 bg-gray-50';
}
function renderInput(question: Question, control: FormControl<any>, status: AnswerStatus, setAnswer: any) {

  const inputBy = question.metadata.inputBy;
  if (inputBy == null) return null;

  if (inputBy.kind === "number") {

    return inputGroup(
      <InputNumber control={control} className={cls(["relative m-0 block w-[1px] min-w-0 flex-auto p-2 ", statusInput(status)])} ></InputNumber>,
      <button className={cls(["btn btn-blue"])} onClick={() => setAnswer({ questionId: question.id, answer: control.value })}>Overit</button>,
      inputBy.args ?? {})
  }
  else if (inputBy.kind === "text") {
    return inputGroup(<TextInput control={control} className={cls(["relative m-0 block w-[1px] min-w-0 flex-auto p-2", statusInput(status)])}></TextInput>,
      <button className={cls(["btn btn-blue"])} onClick={() => setAnswer({ questionId: question.id, answer: control.value })}>Overit</button>,
      inputBy.args ?? {})
  }
  else if (inputBy.kind === "math") {


    const input = inputGroup(<TextInput control={control} className={cls(["relative m-0 block w-[1px] min-w-0 flex-auto p-2", statusInput(status)])}></TextInput>,
      <button className={cls(["btn btn-blue"])} onClick={() => setAnswer({ questionId: question.id, answer: control.value })}>Overit</button>,
      inputBy.args ?? {})
    return inputBy.args?.hintType != null ? <div>
      {input}
      {inputBy.args.hintType == "expression" ?
        <span>
          x2 zapište jako x2.
          Výsledek s násobením závorek zapište jako x(x+1).</span>
        : inputBy.args.hintType == "fraction" ?
          <span>Zlomkovou čáru zapište pomocí /.</span>
          : inputBy.args.hintType == "equation" ?
            <span>Nemá řešení zapište NŘ, nekonečno mnoho řešení zapište NM, jinak zapište číslo.</span>
            : inputBy.args.hintType == "ratio" ?
              <span>Poměr zapište jako 1:1.</span> : null
      }
    </div> : input
  }
  else if (inputBy.kind === "bool") {
    return createBoolAnswer(control, status, (value) => setAnswer({ questionId: question.id, answer: value }))
  }
  else if (inputBy.kind === "options") {
    return createOptionAnswer(control,
      question.data?.options ?? [],
      status,
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



  const hasInput = question.metadata.inputBy != null;

  const disabled = (status === "correct")

  return (
    <div className="flex flex-col gap-10" >

      <div
        className="prose lg:prose-xl flex flex-col space-y-2"
        dangerouslySetInnerHTML={{ __html: question.data?.content ?? '' }}
      />


      <div  className="flex flex-col gap-2">
        
        {hasInput ? renderInput(question, formControl as any, status, setAnswer) : null}

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
              </section>
            </details>

            <div>{createOptionAnswer(formControl, question.metadata.verifyBy.args.options, status, (value) => {
              if (value === undefined) return;
              setAnswer({ questionId: question.id, answer: value });
            })}</div>

          </div> : null}

        <div className="flex">
          <div className="grow"> </div>
          <div className="grid grid-cols-2 gap-3">

            <button className="btn btn-blue"
              onClick={() => back()}><FontAwesomeIcon icon={faAngleLeft} /></button>
            <button className="btn btn-blue"
              onClick={() => next()}><FontAwesomeIcon icon={faAngleRight} /></button>

          </div>
        </div>

      </div>

    </div>
  );
}

const WizardStepContainer = connect(null, mapDispatch)(WizardStep);
export default WizardStepContainer;