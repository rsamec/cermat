'use client'
import * as React from "react";
import { Provider, connect } from "react-redux";
import { store, RootState, Dispatch } from "../../lib/store";
import Stepper from "./stepper";
import { cls } from "@/lib/utils/utils";
import withControl, { ValueProps } from "../core/WithFormControl";

const selection = store.select((models) => ({
  currentStepIndex: models.quiz.currentStepIndex,
  currentAnswer: models.quiz.currentAnswer,
  totalAnswers: models.quiz.totalAnswers,
}));

const mapState = (state: RootState) => ({
  ...state.quiz,
  ...selection(state),
  control: state.quiz.currentStep.control
})

const mapDispatch = (dispatch: Dispatch) => ({
  next: () => dispatch.quiz.next(),
  back: () => dispatch.quiz.back(),
  validate: () => dispatch.quiz.validate(),
});

type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
type Props = {contentChunks: string[] } & ValueProps<any> & StateProps & DispatchProps;

type AnswerState = "NoAnswer" | "Right" | "Wrong"

function WizardStep(props: Props) { 
  const answer = props.currentAnswer?.answer;

  const answerState: AnswerState = answer == null ? "NoAnswer" :  answer.error != null ? "Wrong" : "Right";
  const hasError = props.value == null;
  const disabled = hasError || (answerState !== "NoAnswer" && answer?.value === props.value)
  return (
    <div>
      {props.currentStep.renderComponent(props.contentChunks[props.currentStepIndex])}
      <div className={cls(['p-5',answerState === "Wrong" && 'bg-rose-200', answerState === "Right" && 'bg-green-200'])}>
        <button className="btn btn-blue" disabled={disabled} onClick={() => props.validate()}>Overit</button>
        <span>Total Answers:</span>{props.totalAnswers}
      </div>
    </div>
  );
}

const WizardStepContainer = connect(mapState, mapDispatch)(withControl(WizardStep));

export default function Wizard(props: { contentChunks: string[] }) {
 
  return (
    <div>
      <Provider store={store}>
        <Stepper></Stepper>
        <WizardStepContainer contentChunks={props.contentChunks}></WizardStepContainer>       
      </Provider>
    </div>
  )
}
