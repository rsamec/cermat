'use client'
import * as React from "react";
import WizardStep from "./wizard-step";
import { Dispatch, RootState, store } from "@/lib/store";
import { connect } from "react-redux";
import Stepper from "./stepper";
import { useSwipeable } from "react-swipeable";
import { useState } from "react";
import { faTrashCan, faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TextBadge from "../core/TextBadge";
import { updateMap } from "@/lib/utils/utils";
import TransitionStep from "./transition-step";

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

const StepsRenderer: React.FC<StateProps & DispatchProps> = ({ previousStepIndex, currentStepIndex, currentStep, next, back, resetAnswers, questions, totalAnswers, totalPoints, maxTotalPoints }) => {
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
  return <div  {...handlers} className="min-h-screen">
    <div className="flex flex-col gap-4">
      <Stepper></Stepper>
      <TransitionStep direction={previousStepIndex <= currentStepIndex ? 'next' : 'back'}>
        {step}
      </TransitionStep>

      <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700"></hr>

      <div className="flex">

        <div className="grow flex flex-wrap gap-2">
          <TextBadge text="Úlohy" type="Gray">{`${totalAnswers} / ${questions.length}`}</TextBadge>
          <TextBadge text="Body" type="Gray">{`${totalPoints} / ${maxTotalPoints}`}</TextBadge>
        </div>

        <div className="flex self-end gap-3">
          <button className="btn btn-red"
            onClick={() => resetAnswers()}><FontAwesomeIcon icon={faTrashCan} size="2xl"></FontAwesomeIcon>
          </button>

          <button className="btn btn-blue"
            onClick={() => back()}><FontAwesomeIcon icon={faAngleLeft} size="2xl" /></button>
          <button className="btn btn-blue"
            onClick={() => next()}><FontAwesomeIcon icon={faAngleRight} size="2xl" /></button>
        </div>
      </div>


    </div>
  </div>
};


const StepsRendererContainer = connect(mapState, mapDispatch)(StepsRenderer);
export default StepsRendererContainer;