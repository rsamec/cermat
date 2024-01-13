'use client'
import * as React from "react";
import { Provider } from "react-redux";
import Stepper from "./stepper";
import { AnswerGroup } from "@/lib/utils/form-answers";
import { store } from "@/lib/store";
import { useEffect } from "react";
import { QuestionData } from "@/lib/models/quiz";
import StepRenderer from "./step-render";

export default function Wizard(props: { quiz: AnswerGroup<any>, leafs: QuestionData[]  }) {
  const { dispatch } = store;

  useEffect(() => {
    // Dispatch fetchData action when the component mounts    
    dispatch.quiz.init(props)
  }, [props.quiz, props.leafs]);
  
  
  return (
    <div>
      <Provider store={store}>
        <div className="flex flex-col gap-5">
        <Stepper></Stepper>
        <StepRenderer leafs={props.leafs}></StepRenderer>
        </div>
      </Provider>
    </div>
  )
}
