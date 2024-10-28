'use client'
import * as React from "react";
import WizardStep from "./wizard-step";
import { Dispatch, RootState, store } from "@/lib/store";
import { connect } from "react-redux";
import Stepper from "./stepper";
import { useSwipeable } from "react-swipeable";
import { useState } from "react";
import { faTrashCan, faAngleLeft, faAngleRight, faComment, faRuler, faCompass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextBadge from "../core/TextBadge";
import { isEmptyOrWhiteSpace, normalizeImageUrlsToAbsoluteUrls, updateMap } from "@/lib/utils/utils";
import TransitionStep from "./transition-step";
import Link from "next/link";
import chatGTPImage from '../../public/chatgpt-icon.webp';
import Image from "next/image";
import MathSolverLinkComponent from "../math-solver/MathSolverLinkComponent";

const mapDispatch = (dispatch: Dispatch) => ({
  next: () => dispatch.wizard.goToNextStep(),
  back: () => dispatch.wizard.goToPreviousStep(),
  resetAnswers: () => dispatch.quiz.resetQuizAnswers(),
});


const selection = store.select((models) => ({
  totalAnswers: models.quiz.totalAnswers,
  currentStepIndex: models.wizard.currentStepIndex,
  previousStepIndex: models.wizard.previousStepIndex,

}));

const mapState = (state: RootState) => ({
  ...state.wizard,
  ...state.quiz,
  ...selection(state as never),
})


type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;

const StepsRenderer: React.FC<StateProps & DispatchProps> = ({ previousStepIndex, currentStepIndex, assetPath, currentStep, next, back, resetAnswers, questions, totalAnswers, totalPoints, maxTotalPoints }) => {
  const handlers = useSwipeable({
    onSwipedLeft: () => next(),
    onSwipedRight: () => back(),

  });

  const [questionMap, setQuestionMap] = useState(new Map())
  const [headerMap, setHeaderMap] = useState(new Map())
  const toggleExpandableHeader = (title: string) => {
    setHeaderMap((previous) => updateMap(previous, title, { expanded: previous.has(title) ? !previous.get(title).expanded : false }))
  }
  const toggleExpandableAnswer = (questionId: string) => {
    setQuestionMap((previous) => updateMap(previous, questionId, { expanded: previous.has(questionId) ? !previous.get(questionId).expanded : true }))
  }

  const step = React.cloneElement(<WizardStep step={currentStep} headerMap={headerMap} toggleExpandableHeader={toggleExpandableHeader} questionMap={questionMap} toggleExpandableAnswer={toggleExpandableAnswer} ></WizardStep>, { key: currentStep?.id });

  const stepData = currentStep?.data;
  const showMathSolverButton = (currentStep?.metadata?.inputBy as any)?.kind == "math";

  //const observableCells = currentStep?.metadata?.observableCells ?? [];
  //const showObservableCellsButton = observableCells.length > 0;

  const rawContent = stepData != null ? normalizeImageUrlsToAbsoluteUrls([
    stepData.header?.rawContent,
    stepData.rawContent,
    stepData.options?.length != null ? stepData.options?.map(opt => `- ${opt.value}) ${opt.name}`).join('\n') : ''
  ].filter(d => !isEmptyOrWhiteSpace(d)).join('\n'), ['https://www.eforms.cz'].concat(...assetPath ?? [])) : undefined

  return <div  {...handlers} className="min-h-screen">
    <div className="flex flex-col gap-4">
      <Stepper></Stepper>
      <TransitionStep direction={previousStepIndex <= currentStepIndex ? 'next' : 'back'}>
        {step}
      </TransitionStep>

      <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"></hr>

      <div className="flex">

        <div className="grow flex flex-wrap gap-2">
          {showMathSolverButton && rawContent && <MathSolverLinkComponent className="inline-flex items-center gap-2 justify-center p-2 text-base font-medium text-gray-500 rounded-lg bg-gray-50 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white">
            <Image alt="Zkus Microsoft Math Solver" src='data:image/png;base64,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' width={32} height={32} title="Zkus Microsoft Math Solver"></Image>
            <span className="w-full">Microsoft Math</span>
            <svg className="w-4 h-4 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
            </svg>
          </MathSolverLinkComponent>}

          {rawContent && <Link href={`https://chat.openai.com/?q=${encodeURIComponent(rawContent)}`} className="inline-flex items-center gap-2 justify-center p-2 text-base font-medium text-gray-500 rounded-lg bg-gray-50 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700 dark:hover:text-white" target="_blank">
            <Image alt="Zkus ChatGTP" src={chatGTPImage} width={32} height={32} title="Zkus ChatGTP"></Image>
            <span className="w-full">ChatGTP</span>
            <svg className="w-4 h-4 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
            </svg>
          </Link>}


          <TextBadge text="Úlohy" type="Gray">{`${totalAnswers} / ${questions.length}`}</TextBadge>
          <TextBadge text="Body" type="Gray">{`${totalPoints} / ${maxTotalPoints}`}</TextBadge>
        </div>

        <div className="flex justify-end flex-wrap gap-5">
          <div className="flex gap-3">
            <button className="btn btn-red"
              onClick={() => resetAnswers()}><FontAwesomeIcon icon={faTrashCan} size="2xl"></FontAwesomeIcon>
            </button>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-blue"
              onClick={() => back()}><FontAwesomeIcon icon={faAngleLeft} size="2xl" /></button>
            <button className="btn btn-blue"
              onClick={() => next()}><FontAwesomeIcon icon={faAngleRight} size="2xl" /></button>
          </div>

        </div>
      </div>


    </div>
  </div>
};


const StepsRendererContainer = connect(mapState, mapDispatch)(StepsRenderer);
export default StepsRendererContainer;