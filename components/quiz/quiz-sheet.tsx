'use client'
import * as React from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { useEffect } from "react";
import { TreeNode } from "@/lib/utils/tree.utils";
import { Answer } from "@/lib/utils/quiz-specification";
import QuizForm from "./quiz-form";
import { ParsedQuestion } from "@/lib/utils/parser.utils";
import LoadableBlock from "../LoadableBlock";

export default function QuizSheet({ tree, headersAndOptions, assetPath }: { headersAndOptions: Pick<ParsedQuestion, 'header' | 'options'>[], tree: TreeNode<Answer<any>>, assetPath: string[] }) {
  const { dispatch } = store;
  const [loaded, setLoaded] = React.useState(false);

  useEffect(() => {
    dispatch.quiz.init({ tree, assetPath })
    setLoaded(true);
  }, [tree, dispatch.quiz, assetPath]);


  return (
    <div>
      <Provider store={store}>
        <LoadableBlock isLoaded={loaded}>
          <QuizForm headersAndOptions={headersAndOptions}></QuizForm>
        </LoadableBlock>
      </Provider>
    </div>
  )
}
