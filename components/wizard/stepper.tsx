'use client'

import * as React from "react";
import { connect } from "react-redux";
import { RootState, Dispatch, store } from "../../lib/store";
import { Question } from "@/lib/models/wizard";
import { cls, filterSteps } from "@/lib/utils/utils";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight, faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import TextBadge from "../core/Badge";

const selection = store.select((models) => ({
  currentStepIndex: models.wizard.currentStepIndex,
  totalAnswers: models.quiz.totalAnswers,
}));

const mapState = (state: RootState) => ({
  ...state.wizard,
  corrections: state.quiz.corrections,
  ...selection(state as never),
})

const mapDispatch = (dispatch: Dispatch) => ({
  next: () => dispatch.wizard.goToNextStep(),
  back: () => dispatch.wizard.goToPreviousStep(),
  start: () => dispatch.wizard.goToFirstStep(),
  end: () => dispatch.wizard.goToLastStep(),
  goTo: (id: string) => dispatch.wizard.goToStep(id),
});

type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
type Props = { questions: Question[] } & StateProps & DispatchProps;


function Stepper(props: Props) {
  const steps = props.steps;
  const [maxVisibleSteps, setMaxVisibleSteps] = useState(5);

  useEffect(() => {
    const handleResize = () => {
      const containerWidth = window.innerWidth;
      let stepsToShow = steps.length;

      // Adjust the number of steps based on the container width
      if (containerWidth < 640) {
        stepsToShow = 5;
      } else if (containerWidth < 768) {
        stepsToShow = 7;
      } else if (containerWidth < 1024) {
        stepsToShow = 9;
      } else if (containerWidth < 1200) {
        stepsToShow = 11;
      } else {
        stepsToShow = 13;
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

    <div className="hidden md:flex flex-col items-center">
      <div className="flex items-center gap-5">
        <div className="flex items-center">
          <button className="btn"
            onClick={() => props.start()}><FontAwesomeIcon icon={faAnglesLeft} /></button>
          <button className="btn"
            onClick={() => props.back()}><FontAwesomeIcon icon={faAngleLeft} /></button>
        </div>
        <div className="flex items-center gap-1">
          {filterSteps(steps, props.currentStepIndex, maxVisibleSteps).map((d, i) => {
            const selected = d.id === props.currentStep?.id;
            const correct = props.corrections[d.id] === true;
            const incorrect = props.corrections[d.id] === false;

            return (<div key={i} className="flex flex-col">
              <button className={cls([
                'border font-medium rounded-full text-sm px-5 py-2.5 me-1',
                'text-gray-900 dark:text-white',
                '--:bg-white --:dark:bg-gray-800  --:border-gray-300 --:dark:border-gray-600 --:hover:bg-gray-200 --:dark:hover:bg-gray-700',
                selected && '-:bg-gray-200 -:dark:bg-gray-700',
                correct && 'border-green-200 -:bg-green-100 -:dark:bg-green-800 hover:bg-green-300 hover:dark:bg-green-500',
                correct && selected && 'bg-green-300 dark:bg-green-500',
                incorrect && 'border-red-200 -:bg-red-100 -:dark:bg-red-800 hover:bg-red-300 hover:dark:bg-red-500',
                incorrect && selected && 'bg-red-300 dark:bg-red-500',
              ])} onClick={() => props.goTo(d.id)} >{d.id}</button>
            </div>)
          }
          )}

        </div>
        <div className="flex items-center gap">
          <button className="btn"
            onClick={() => props.next()}><FontAwesomeIcon icon={faAngleRight} /></button>
          <button className="btn"
            onClick={() => props.end()}><FontAwesomeIcon icon={faAnglesRight} /></button>
        </div>
      </div>
    </div>
  );
}

export default connect(mapState, mapDispatch)(Stepper);


