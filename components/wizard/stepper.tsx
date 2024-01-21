'use client'

import * as React from "react";
import { connect } from "react-redux";
import { RootState, Dispatch, store } from "../../lib/store";
import { Question } from "@/lib/models/quiz";
import { cls, filterSteps } from "@/lib/utils/utils";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import Badge from "../core/Badge";

const selection = store.select((models) => ({
  currentStepIndex: models.quiz.currentStepIndex,
  currentAnswerState: models.quiz.currentAnswerState,
  totalAnswers: models.quiz.totalAnswers,
}));

const mapState = (state: RootState) => ({
  ...state.quiz,
  ...selection(state as never),
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
  const steps = props.questions;
  const [maxVisibleSteps, setMaxVisibleSteps] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      const containerWidth = window.innerWidth;
      let stepsToShow = steps.length;

      // Adjust the number of steps based on the container width
      if (containerWidth < 640) {
        stepsToShow = 5;
      } else if (containerWidth < 768) {
        stepsToShow = 9;
      } else if (containerWidth < 1024) {
        stepsToShow = 13;
      } else {
        stepsToShow = 17;
      }

      setMaxVisibleSteps(stepsToShow);
    };

    // Initial call to set the visible steps
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [steps]);
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex gap-5 self-stretch">
        <div className="grow">
        <Badge text="Úlohy" badgeText={`${props.totalAnswers} z ${props.questions.length}`} type="Default" ></Badge>
        </div>
        <Badge text="Body" badgeText={props.totalPoints} type="Default" ></Badge>
      </div>
      <div className="hidden md:flex items-center gap-5">

        <button className="btn"
          onClick={() => props.back()}><FontAwesomeIcon icon={faAngleLeft} /></button>

        <div className="flex items-center gap-1">
          {filterSteps(steps, props.currentStepIndex, maxVisibleSteps).map((d, i) =>
            <div key={i} className="flex flex-col">
              <button className={cls(['btn', 'btn-outline', 'rounded-none', 'rounded-t-lg', d.id === props.currentStep?.id && 'btn-blue'])} onClick={() => props.goTo(d.id)} >{d.id}</button>
              <div className={cls(['min-h-2', props.corrections[d.id] === true && 'bg-green-300', props.corrections[d.id] === false && 'bg-red-300'])}></div>
            </div>)}
        </div>
        <button className="btn"
          onClick={() => props.next()}><FontAwesomeIcon icon={faAngleRight} /></button>

      </div>
    </div>
  );
}

export default connect(mapState, mapDispatch)(Stepper);

