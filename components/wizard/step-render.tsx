'use client'
import * as React from "react";
import WizardStep from "./wizard-step";
import { Dispatch, RootState } from "@/lib/store";
import { connect } from "react-redux";
import Stepper from "./stepper";
import { useSwipeable } from "react-swipeable";

const mapDispatch = (dispatch: Dispatch) => ({
  next: () => dispatch.wizard.goToNextStep(),
  back: () => dispatch.wizard.goToPreviousStep(),
});

const mapState = (state: RootState) => ({
  ...state.wizard,
})

type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;

const StepsRenderer: React.FC<StateProps & DispatchProps> = ({ currentStep, next, back }) => {
  const handlers = useSwipeable({
    onSwipedLeft: () => next(),
    onSwipedRight: () => back(),
  });



  return <div  {...handlers} className="min-h-screen">
    <div className="flex flex-col gap-4">
      <Stepper></Stepper>
      <WizardStep step={currentStep}></WizardStep>
    </div>
  </div>
};


const StepsRendererContainer = connect(mapState, mapDispatch)(StepsRenderer);
export default StepsRendererContainer;