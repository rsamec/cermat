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

export default function Wizard({ steps, tree, assetPath }: { steps: Question[], tree: TreeNode<Answer<any>>, assetPath: string[] }) {
  const { dispatch } = store;
  const [loaded, setLoaded] = React.useState(false);

  useEffect(() => {
    // Dispatch fetchData action when the component mounts    
    dispatch.wizard.init({ steps });
    dispatch.quiz.initAsync({ tree, assetPath }).then(() => setLoaded(true));
    //dispatch.timer.startTimer();
  }, [steps, tree, assetPath, dispatch.wizard, dispatch.quiz, dispatch.timer]);


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
