'use client'

import * as React from "react";
import { connect } from "react-redux";
import { RootState, Dispatch, store } from "../../lib/store";
import { Question } from "@/lib/models/quiz";
import { cls, filterSteps } from "@/lib/utils/utils";


const selection = store.select((models) => ({
  currentStepIndex: models.quiz.currentStepIndex,
  currentAnswerState: models.quiz.currentAnswerState,
  totalAnswers: models.quiz.totalAnswers,
}));

const mapState = (state: RootState) => ({
  ...state.quiz,
  ...selection(state),
})

const mapDispatch = (dispatch: Dispatch) => ({
  next: () => dispatch.quiz.goToNextStep(),
  back: () => dispatch.quiz.goToPreviousStep(),
  goTo: (id: string) => dispatch.quiz.goToStep(id),
});

type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
type Props = { questions: Question[] } & StateProps & DispatchProps;


function Stepper(props: Props) {
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex gap-5 self-stretch">
        <div className="grow">
          <span>Počet úloh:</span>
          <span>{props.totalAnswers}/{props.questions.length}</span></div>
        <div className="">Body:</div>
      </div>
      <div className="flex items-center gap-5">
        <button className="btn btn-blue"
          onClick={() => props.back()}>back</button>

        <div className="flex items-center gap-1">
          {filterSteps(props.questions, props.currentStepIndex, 15).map((d, i) =>
            <button className={cls(['btn', d.id === props.currentStep?.id && 'btn-blue', props.corrections[d.id] === true && 'btn-green', props.corrections[d.id] === false && 'btn-red'])} key={i} onClick={() => props.goTo(d.id)} >{d.id}</button>)}
        </div>
        <button className="btn btn-blue"
          onClick={() => props.next()}>next</button>

      </div>
    </div>
  );
}

export default connect(mapState, mapDispatch)(Stepper);

