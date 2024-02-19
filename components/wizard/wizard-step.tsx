'use client'
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch, RootState, store } from "../../lib/store";
import { Question } from "@/lib/models/wizard";
import { convertToForm, getControl } from "@/lib/utils/form.utils";
import { createOptionAnswer, createBoolAnswer, renderControl } from "@/lib/utils/component.utils";
import { useState } from "react";
import Image from 'next/image';
import { faAngleLeft, faAngleRight, faInfoCircle, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { absoluteUrl, cls, format, formatTime, updateMap } from "@/lib/utils/utils";
import IconBadge from "../core/IconBadge";
import Badge from "../core/Badge";
import { FieldControl } from "@rx-form/core";
import { useControlValid } from "@rx-form/react";
import { ComponentFunctionSpec } from "@/lib/utils/catalog-function";
import ToggleSwitchBadge from "../core/ToggleSwitchBadge";
import DOMPurify from "dompurify";
import { toHtml } from "@/lib/utils/math.utils";
import TextBadge from "../core/TextBadge";

const mapDispatch = (dispatch: Dispatch) => ({
  setAnswer: (args: { questionId: string, answer: any }) => dispatch.quiz.submitQuizAnswer(args),
  next: () => dispatch.wizard.goToNextStep(),
  back: () => dispatch.wizard.goToPreviousStep(),
});


const selection = store.select((models) => ({
  totalAnswers: models.quiz.totalAnswers,
}));

const mapState = (state: RootState) => ({
  ...state.quiz,
  time: state.timer.time,
  ...selection(state as never),
})


type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
type Props = { step: Question } & StateProps & DispatchProps;




const WizardStep: React.FC<Props> = ({ questions, step, tree, corrections, time, setAnswer, next, back, totalAnswers, totalPoints, maxTotalPoints }) => {

  const stepId = step.id;
  const correction = corrections[stepId]
  const status = correction === true ? 'success' : correction === false ? 'danger' : undefined

  const [form] = useState(() => convertToForm(tree!))
  const [questionMap, setQuestionMap] = useState(new Map())
  const [headerMap, setHeaderMap] = useState(new Map())


  const formControl = getControl(form, stepId as any);
  const valid = useControlValid(formControl!);
  if (formControl == null) {
    return <div>Ooops...., problem with question: {stepId}</div>
  }



  const header = step.data?.header;
  const verifyBy = step.metadata.verifyBy;
  const maxPoints = verifyBy.kind == 'selfEvaluate' ? Math.max(...verifyBy.args.options.map(d => d.value)) : step.metadata.points;

  const isHeaderExpanded = headerMap.has(header?.title) ? headerMap.get(header?.title).expanded : true;
  const isQuestionAnswerExpanded = questionMap.has(stepId) ? questionMap.get(stepId).expanded : false;
  const toggleExpandableHeader = (title: string) => {
    setHeaderMap((previous) => updateMap(previous, title, { expanded: previous.has(title) ? !previous.get(title).expanded : false }))
  }
  const toggleExpandableAnswer = (questionId: string) => {
    setQuestionMap((previous) => updateMap(previous, questionId, { expanded: previous.has(questionId) ? !previous.get(questionId).expanded : true }))
  }


  const inputBy = (step.metadata.inputBy as ComponentFunctionSpec);

  const isSelfEvaluate = verifyBy.kind === "selfEvaluate";

  const stateVariants = {
    "success": 'bg-green-100 dark:bg-green-800 hover:bg-green-200 border-green-200 dark:border-green-400',
    "danger": 'bg-red-100 dark:bg-red-800 hover:bg-red-200 border-red-200 dark:border-red-400',
    "undefined": '-:dark:bg-slate-900 -:hover:bg-gray-50 -:dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700',
  }
  const checkButton = <button title="Ověřit zadanou hodnotu" className="btn btn-blue" disabled={!valid} onClick={() => setAnswer({ questionId: stepId, answer: formControl.value })}>Zkontrolovat</button>



  return (

    <div className="flex flex-col gap-2" >
      {/* <div>
        <Badge type="Gray">
           {formatTime(time)}
        </Badge>
      </div> */}
      {header != null ?
        <details className="[&_svg]:open:-rotate-180" open={isHeaderExpanded} >
          <summary className="text-xl font-bold" onClick={(e) => {
            e.preventDefault();
            toggleExpandableHeader(header.title);
          }}><div className="inline-flex items-start gap-2 w-[calc(100%-30px)]">
              <span className="grow">{header.title}</span>
              <button className="min-h-6 text-end text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">{isHeaderExpanded ? 'Skrýt' : 'Zobrazit'}</button>
            </div>
          </summary>
          <section>
            <div
              className={cls([
                "prose lg:prose-xl flex flex-col space-y-2",
                header.mutliColumnLayout && "[&_p]:indent-2 [&_blockquote]:sm:columns-2 [&_blockquote]:sm:text-justify [&_blockquote]:md:gap-8"
              ])}
              dangerouslySetInnerHTML={{ __html: header.content ?? '' }}
            />
          </section>
        </details>
        : null}

      <div
        className="prose lg:prose-xl flex flex-col space-y-2"
        dangerouslySetInnerHTML={{ __html: step.data?.content ?? '' }}
      />
      <div className="flex justify-end gap-2">
        {isSelfEvaluate && <IconBadge icon={faInfoCircle} text={`Vlastní vyhodnocení úlohy.`} />}
        {maxPoints != null && <IconBadge icon={faInfoCircle} text={`Max. bodů ${maxPoints}`} />}
      </div>

      <hr className="h-px mb-4 bg-gray-200 border-0 dark:bg-gray-700"></hr>


      <div className="flex flex-col gap-1">

        {!isSelfEvaluate ? <div className="flex flex-col gap-4">
          {
            inputBy.kind == "bool" ?
              createBoolAnswer(formControl as unknown as FieldControl, status,
                () => setAnswer({ questionId: stepId, answer: formControl.value })) :
              inputBy.kind == "options" ?
                createOptionAnswer(formControl as unknown as FieldControl, step.data?.options ?? [],
                  status, () => setAnswer({ questionId: stepId, answer: formControl.value })) :
                <div className="flex items-end flex-wrap gap-2">
                  {renderControl(formControl, step.metadata.inputBy!, { options: step.data?.options ?? [], status: status })}
                  {checkButton}
                </div>
          }
          {

            ((inputBy.kind != "bool" && ((correction === true && inputBy.kind !== 'options') || (correction === false)))) &&
            <div className={cls(["flex items-center gap-4 flex-wrap p-2 border shadow-sm", stateVariants[status != null ? status : "undefined"]])} >
              {(correction === true && inputBy.kind !== 'options') && <div className="flex items-center gap-2"><FontAwesomeIcon icon={faThumbsUp} size="xl"></FontAwesomeIcon><span>Správně</span></div>}
              {(correction === false) && <ToggleSwitchBadge text="Zobrazit správné řešení úlohy" value={isQuestionAnswerExpanded} onChange={() => toggleExpandableAnswer(stepId)} type="Success" > {
                inputBy?.kind === 'math' ?
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(toHtml(format(verifyBy.args))) }} /> :
                  <div>{format(verifyBy?.args)}</div>
              }
              </ToggleSwitchBadge>
              }
            </div>

          }
        </div> : null}

        {isSelfEvaluate ?

          <details className="[&_svg]:open:-rotate-180" open={isQuestionAnswerExpanded} >
            <summary className="text-xl font-bold" onClick={(e) => {
              e.preventDefault();
              toggleExpandableAnswer(stepId);
            }}>
              <div className="inline-flex items-start w-[calc(100%-30px)]">
                <span className="grow">Zobrazit řešení úlohy</span>
                <button className="min-h-6 text-end text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">{isQuestionAnswerExpanded ? 'Skrýt' : 'Zobrazit'}</button>
              </div>
            </summary>

            <section className="grid grid-cols-1 gap-2 py-5" >
              {verifyBy.args.hint.kind == 'image' &&
                <div className="relative w-full aspect-[4/3]">
                  <Image src={absoluteUrl(verifyBy.args.hint.src)} alt='Check result' fill className="object-contain object-center" />
                </div>
              }
              {verifyBy.args.hint.kind == 'text' && <div dangerouslySetInnerHTML={{ __html: verifyBy.args.hint.content }} />}

              <div>{createOptionAnswer(formControl as unknown as FieldControl, verifyBy.args.options, status, (value) => {
                if (value === undefined) return;
                setAnswer({ questionId: stepId, answer: value });
              })}</div>

            </section>
          </details> : null}
      </div>

      <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"></hr>

      <div className="flex">

        <div className="grow flex flex-wrap gap-2">
          <TextBadge text="Úlohy" type="Gray">{`${totalAnswers} / ${questions.length}`}</TextBadge>
          <TextBadge text="Body" type="Gray">{`${totalPoints} / ${maxTotalPoints}`}</TextBadge>
        </div>

        <div className="flex self-end gap-3">

          <button className="btn btn-blue"
            onClick={() => back()}><FontAwesomeIcon icon={faAngleLeft} size="2xl" /></button>
          <button className="btn btn-blue"
            onClick={() => next()}><FontAwesomeIcon icon={faAngleRight} size="2xl" /></button>

        </div>

      </div>
    </div>
  );
}

const WizardStepContainer = connect(mapState, mapDispatch)(WizardStep);
export default WizardStepContainer;