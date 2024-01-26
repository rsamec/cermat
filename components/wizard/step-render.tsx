'use client'
import * as React from "react";
import WizardStep from "./wizard-step";
import { Dispatch, RootState, store } from "@/lib/store";
import { connect } from "react-redux";
import Stepper from "./stepper";
import { useSwipeable } from "react-swipeable";


const selection = store.select((models) => ({
  currentStepIndex: models.quiz.currentStepIndex,
  currentAnswerState: models.quiz.currentAnswerState,
  totalAnswers: models.quiz.totalAnswers,
}));

const mapDispatch = (dispatch: Dispatch) => ({
  next: () => dispatch.quiz.goToNextStep(),
  back: () => dispatch.quiz.goToPreviousStep(),
});

const mapState = (state: RootState) => ({
  ...state.quiz,
  ...selection(state as never),
})

type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;

const StepsRenderer: React.FC<StateProps & DispatchProps> = ({ currentStep, currentAnswerState, next, back }) => {
  const handlers = useSwipeable({
    onSwipedLeft: () => next(),
    onSwipedRight: () => back(),
  });



  return <div  {...handlers} className="min-h-screen">
    {currentStep == null ?
      <div>Loading...</div> :
      <div className="max-w-6xl mx-auto">
        <Stepper></Stepper>
        <WizardStep question={currentStep} answerState={currentAnswerState}></WizardStep>
      </div>}
  </div>
};


const StepsRendererContainer = connect(mapState, mapDispatch)(StepsRenderer);
export default StepsRendererContainer;