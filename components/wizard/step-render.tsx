'use client'
import * as React from "react";
import WizardStep from "./wizard-step";
import { RootState, store } from "@/lib/store";
import { connect } from "react-redux";
import Stepper from "./stepper";


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

const StepsRenderer: React.FC<StateProps> = ({ currentStep, currentAnswerState }) => {
  if (currentStep == null) {
    return <div>Loading....</div>
  }
  return <>
    <Stepper></Stepper>
    <WizardStep question={currentStep} answerState={currentAnswerState} ></WizardStep>
  </>
};


const StepsRendererContainer = connect(mapState)(StepsRenderer);
export default StepsRendererContainer;