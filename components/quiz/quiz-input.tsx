'use client'
import * as React from "react";
import { useEffect, useRef } from "react";
import { Answer, AnswerMetadataTreeNode } from "@/lib/utils/quiz-specification";
import { TreeNode, getAllLeafsWithAncestors } from "@/lib/utils/tree.utils";
import { convertToForm, getControl } from "@/lib/utils/form.utils";
import { renderControl } from "@/lib/utils/component.utils";
import { ParsedQuestion } from "@/lib/utils/parser.utils";

// const mapDispatch = (dispatch: Dispatch) => ({
//   setAnswer: (args: { questionId: string, answer: any }) => dispatch.quiz.setAnswer(args),

// });


// const selection = store.select((models) => ({
//   totalAnswers: models.quiz.totalAnswers,
// }));

// const mapState = (state: RootState) => ({
//   ...state.quiz,
//   ...selection(state as never),
// })


// type StateProps = ReturnType<typeof mapState>;
// type DispatchProps = ReturnType<typeof mapDispatch>;
type Props = { quizTree: TreeNode<Answer<any>>, questions: Pick<ParsedQuestion,'header' | 'options'>[] } //& StateProps & DispatchProps;

const QuizInput: React.FC<Props> = ({ quizTree, questions }) => {

  const groupControlRef = useRef(convertToForm(quizTree))
  //const leafs = getAllLeafsWithAncestors(quizTree).map(d => d.leaf.data as AnswerMetadataTreeNode<any>)
  const leafs = getAllLeafsWithAncestors(quizTree).map((d, i) => {

    const options = questions[i]?.options;
    const leaf = d.leaf.data as AnswerMetadataTreeNode<any>;

    return { leaf, options };
  })



  // useEffect(() => {
  //   const subscription = groupControlRef.current.valueChange.subscribe((v) => {
  //     // eslint-disable-next-line no-console
  //     console.log('value changed', v);
  //   });

  //   return () => {
  //     subscription.unsubscribe();
  //   };
  // }, []);



  return (
    <>
      {leafs.map(({ leaf, options }) => {
        const { id, node } = leaf;
        const control = getControl(groupControlRef.current, id as any)
        //console.log(id, control != null, control?.controls != null, control)
        return node.inputBy && (
          <div key={`${id}`}>
            <span>{id}</span>
            {renderControl(control, node.inputBy, { options })}
          </div>
        )
      })}
      <br />
      <br />
      <br />
      <button onClick={() => {
        // eslint-disable-next-line no-console
        console.log(groupControlRef.current.value);
      }}>
        Log
      </button>
    </>
  )
}

export default QuizInput;
//const QuizFormContainer = connect(mapState, mapDispatch)(QuizForm);
//export default QuizFormContainer;