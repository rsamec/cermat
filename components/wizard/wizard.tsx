'use client'
import * as React from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { useEffect } from "react";
import { Question } from "@/lib/models/wizard";
import StepRenderer from "./step-render";
import { TreeNode } from "@/lib/utils/tree.utils";
import { Answer } from "@/lib/utils/quiz-specification";
import LoadableBlock from "../LoadableBlock";

export default function Wizard({ steps, tree }: { steps: Question[], tree: TreeNode<Answer<any>> }) {
  const { dispatch } = store;
  const [loaded, setLoaded] = React.useState(false);

  useEffect(() => {
    // Dispatch fetchData action when the component mounts    
    dispatch.wizard.init({ steps });
    dispatch.quiz.init({ tree });
    //dispatch.timer.startTimer();
    setLoaded(true);
  }, [steps, tree, dispatch.wizard, dispatch.quiz, dispatch.timer]);


  return (
    <div>
      <Provider store={store}>
        <LoadableBlock isLoaded={loaded}>
          <StepRenderer></StepRenderer>
        </LoadableBlock>
      </Provider>
    </div>
  )
}
