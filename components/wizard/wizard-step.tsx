'use client'
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch, RootState, store } from "../../lib/store";
import { AnswerState, AnswerStatus, Question } from "@/lib/models/quiz";
import InputNumber from "../core/InputNumber";
import { FormControl } from "@/lib/utils/form.utils";
import TextInput from "../core/TextInput";
import { createBoolAnswer, createOptionAnswer } from "@/lib/utils/component.utils";
import { useState } from "react";
import Image from 'next/image';
import { faAngleLeft, faAngleRight, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cls, updateMap } from "@/lib/utils/utils";
import IconBadge from "../core/IconBadge";
import Badge from "../core/Badge";
import SortableList from "../core/SortableList";
import MathInput from "../core/MathInput";
import { toHtml } from "@/lib/utils/math.utils";
import DOMPurify from "dompurify";

const mapDispatch = (dispatch: Dispatch) => ({
  setAnswer: (args: { questionId: string, answer: any }) => dispatch.quiz.setAnswer(args),
  next: () => dispatch.quiz.goToNextStep(),
  back: () => dispatch.quiz.goToPreviousStep(),
});


const selection = store.select((models) => ({
  currentStepIndex: models.quiz.currentStepIndex,
  currentAnswerState: models.quiz.currentAnswerState,
  totalAnswers: models.quiz.totalAnswers,
}));

const mapState = (state: RootState) => ({
  ...state.quiz,
  ...selection(state as never),
})


type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
type Props = { question: Question, answerState: AnswerState } & StateProps & DispatchProps;



function inputGroup({ input, confirmButton, verifyResult, inputBy }: { input: React.ReactNode, confirmButton: React.ReactNode, verifyResult: React.ReactNode, inputBy: { kind: 'number' | 'text' | 'math', args?: { prefix?: string, suffix?: string } } }) {
  const { prefix, suffix } = inputBy.args ?? {};
  return <div>
    <div className={`${cls(["max-w-lg relative mb-4 flex flex-wrap", inputBy.kind === "math" ? "items-start" : "items-stretch"])}`}>
      {prefix != null ? <span
        className="flex items-center whitespace-nowrap rounded-l border border-r-0 border-solid border-neutral-300 px-3 py-[0.25rem] text-center text-base font-normal leading-[1.6] text-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"
      >{prefix}</span> : null}
      {input}

      {suffix != null ? <span
        className="flex items-center whitespace-nowrap rounded-r border border-l-0 border-solid border-neutral-300 px-3 py-[0.25rem] text-center text-base font-normal leading-[1.6] text-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"
      >{suffix}</span> : null}

      <div className="flex items-center ml-2">
        {confirmButton}
      </div>
    </div>
    <div>
      {verifyResult}
    </div>
  </div>

}
function statusInput(status: AnswerStatus) {
  return status == "correct" ?
    "bg-green-50 border border-green-500 text-green-900 text-sm focus:ring-green-500 focus:border-green-500 dark:border-green-500"
    : status === "incorrect" ?
      "bg-red-50 border border-red-500 text-red-900 text-sm focus:ring-red-500 focus:border-red-500 dark:border-red-500" :
      'text-gray-900 border border-gray-300 bg-gray-50';
}


function renderInput(question: Question, control: FormControl<any>, status: AnswerStatus, setAnswer: any) {

  const inputBy = question.metadata.inputBy;
  const confirmButton = <button className={cls(["btn btn-blue"])} onClick={() => setAnswer({ questionId: question.id, answer: control.value })}>Zkontrolovat</button>
  if (inputBy == null) return null;

  const verifyResult = status == "incorrect" ?
    question.metadata.inputBy?.kind === 'math' ?
      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(toHtml(question.metadata.verifyBy.args)) }} /> :
      <div>{question.metadata.verifyBy?.args}</div> : null

  if (inputBy.kind === "number") {

    return inputGroup(
      {
        input: <InputNumber control={control} step={inputBy.args?.step} className={cls(["relative m-0 block w-[1px] min-w-0 flex-auto p-2 dark:bg-gray-700 dark:text-white", statusInput(status)])} ></InputNumber>,
        confirmButton,
        verifyResult,
        inputBy
      })
  }
  else if (inputBy.kind === "text") {
    return inputGroup({
      input: <TextInput control={control} className={cls(["relative m-0 block w-[1px] min-w-0 flex-auto p-2 dark:bg-gray-700 dark:text-white", statusInput(status)])}></TextInput>,
      confirmButton,
      verifyResult,
      inputBy
    })
  }
  else if (inputBy.kind === "math") {

    const hintClass = 'italic text-sm'
    const input = inputGroup({
      input: <MathInput control={control} className={cls(["relative m-0 block  min-w-0 flex-auto p-2 dark:bg-gray-700 dark:text-white", statusInput(status)])}></MathInput>,
      confirmButton,
      verifyResult,
      inputBy
    })
    return inputBy.args?.hintType != null ? <div>
      {input}
      <span className={hintClass}>
        Násobení např.2x, x(x+1). Dělení a zlomek x/2, 1/(3+2). Mocninu x<sup>2</sup> zapište jako x^2.
      </span>
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
  else if (inputBy.kind == "sortedOptions") {
    return <div className="flex flex-col gap-4">
      <SortableList control={control}></SortableList>
      {confirmButton}
    </div>
  }
  return null
}


const WizardStep: React.FC<Props> = ({ question, answerState, setAnswer, next, back, totalAnswers, totalPoints, maxTotalPoints, questions }) => {

  const { status, value } = answerState;
  
  
  const [questionMap, setQuestionMap] = useState(new Map())
  const [headerMap, setHeaderMap] = useState(new Map())


  const hasInput = question.metadata.inputBy != null;

  const header = question.data?.header;
  const verifyBy = question.metadata.verifyBy;
  const maxPoints = verifyBy.kind == 'selfEvaluate' ? Math.max(...verifyBy.args.options.map(d => d.value)) : question.metadata.points;

  const isHeaderExpanded = headerMap.has(header?.title) ? headerMap.get(header?.title).expanded : true;
  const isQuestionAnswerExpanded = questionMap.has(question.id) ? questionMap.get(question.id).expanded : false;
  const toggleExpandableHeader = (title: string) => {
    setHeaderMap((previous) => updateMap(previous, title, { expanded: previous.has(title) ? !previous.get(title).expanded : false }))
  }
  const toggleExpandableAnswer = (questionId: string) => {
    setQuestionMap((previous) => updateMap(previous, questionId, { expanded: previous.has(questionId) ? !previous.get(questionId).expanded : true }))
  }

  const formControl = new FormControl(question.metadata.inputBy?.kind === "sortedOptions" ? (value ?? question.data?.options) : value);
  return (

    <div className="flex flex-col gap-2 px-3" >
      <div>

        {header != null ?
          <details className="py-5 [&_svg]:open:-rotate-180" open={isHeaderExpanded} >
            <summary className="text-xl font-bold" onClick={(e) => {
              e.preventDefault();
              toggleExpandableHeader(header.title);
            }} >{header.title}</summary>
            <section>
              <div
                className={cls([
                  "prose lg:prose-xl flex flex-col space-y-2",
                  header.mutliColumnLayout && "[&_blockquote]:sm:columns-2 [&_blockquote]:sm:text-justify [&_blockquote]:md:gap-8"
                ])}
                dangerouslySetInnerHTML={{ __html: header.content ?? '' }}
              />
            </section>
          </details>
          : null}

        <div
          className="prose lg:prose-xl flex flex-col space-y-2"
          dangerouslySetInnerHTML={{ __html: question.data?.content ?? '' }}
        />
      </div>


      <div className="flex flex-col gap-1">

        {hasInput ? renderInput(question, formControl as any, status, setAnswer) : null}

        {!hasInput ?
          <div>
            <details className="py-5 [&_svg]:open:-rotate-180" open={isQuestionAnswerExpanded} >
              <summary className="text-xl font-bold" onClick={(e) => {
                e.preventDefault();
                toggleExpandableAnswer(question.id);
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
        {maxPoints != null ? <div> <IconBadge icon={faInfoCircle} text={`Max. bodů ${maxPoints}`} /></div> : null}
      </div>

      <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"></hr>

      <div className="flex">

        <div className="grow flex flex-wrap gap-2">
          <Badge text="Úlohy" badgeText={`${totalAnswers} / ${questions.length}`} type="Gray" ></Badge>
          <Badge text="Body" badgeText={`${totalPoints} / ${maxTotalPoints}`} type="Gray" ></Badge>
        </div>

        <div className="flex self-end gap-3">

          <button className="btn btn-blue"
            onClick={() => back()}><FontAwesomeIcon icon={faAngleLeft} /></button>
          <button className="btn btn-blue"
            onClick={() => next()}><FontAwesomeIcon icon={faAngleRight} /></button>

        </div>

      </div>
    </div>
  );
}

const WizardStepContainer = connect(mapState, mapDispatch)(WizardStep);
export default WizardStepContainer;