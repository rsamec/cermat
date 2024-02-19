'use client'
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { AnswerMetadataTreeNode } from "@/lib/utils/quiz-specification";
import { getAllLeafsWithAncestors } from "@/lib/utils/tree.utils";
import { convertToForm, getControl, markAsDirty } from "@/lib/utils/form.utils";
import { renderControl } from "@/lib/utils/component.utils";
import { ParsedQuestion } from "@/lib/utils/parser.utils";
import { GroupControl } from "@rx-form/core";
import { store, RootState, Dispatch } from "@/lib/store";
import { connect } from "react-redux";
import { toHtml } from "@fortawesome/fontawesome-svg-core";
import DOMPurify from "dompurify";
import { format } from "mathjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown } from "@fortawesome/free-solid-svg-icons";
import Badge from "../core/Badge";
import TextBadge from "../core/TextBadge";

const mapDispatch = (dispatch: Dispatch) => ({
  submitQuiz: (args: Record<string, any>) => dispatch.quiz.submitQuiz(args),
});


const selection = store.select((models) => ({
  totalAnswers: models.quiz.totalAnswers,

}));

const mapState = (state: RootState) => ({
  ...state.quiz,
  ...selection(state as never),
})

type StateProps = ReturnType<typeof mapState>;
type DispatchProps = ReturnType<typeof mapDispatch>;
type Props = { headersAndOptions: Pick<ParsedQuestion, 'header' | 'options'>[] } & StateProps & DispatchProps;

const QuizForm: React.FC<Props> = ({ headersAndOptions, tree, submitQuiz, corrections, questions, totalAnswers, totalPoints, maxTotalPoints }) => {
  const [form] = useState(() => convertToForm(tree!));
  const leafs = getAllLeafsWithAncestors(tree!).map((d, i) => {
    const options = headersAndOptions[i]?.options;
    const leaf = d.leaf.data as AnswerMetadataTreeNode<any>;
    return { leaf, options };
  })

  const [verified, setVerified] = useState(false);
  const [invalid, setInvalid] = useState(true);


  useEffect(() => {
    const subscription = form.valueChange.subscribe((v) => {
      setVerified(false);
      setInvalid(form.invalid);
      console.log(form.invalid)
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [form]);

  const submitQuizHandler = () => {
    const value = form.value;
    const answers = Object.entries(value).flatMap(([key, value]) => value != null && Object.keys(value).some(d => d.startsWith(key)) ? Object.entries(value).map(([key, value]) => ({ key, value })) : { key, value });
    submitQuiz(answers.reduce((out, { key, value }) => {
      out[key] = value;
      return out;
    }, {} as Record<string, any>))
    setVerified(true)
  }

  return (
    <div className="flex flex-col gap-2">
      {leafs.map(({ leaf, options }) => {
        const { id, node } = leaf;
        const control = getControl(form, id as any)
        const correction = corrections[id];
        return node.inputBy && (
          <div className="flex flex-wrap gap-10" key={`${id}`}>
            <div className="flex gap-5 grow">
              <span className="min-w-8" >{id}</span>
              {renderControl(control!, node.inputBy, { options: options.map(d => ({ value: d.value, name: '' })) })}
              <div className="flex items-center gap-4">
                {verified && correction === true && <FontAwesomeIcon icon={faThumbsUp} size="xl" className="text-green-600"></FontAwesomeIcon>}
                {verified && correction === false && <FontAwesomeIcon icon={faThumbsDown} size="xl" className="text-red-600"></FontAwesomeIcon>}
                {verified && correction !== true && <Badge type="Success">{
                  (node.inputBy as any)?.kind === 'math' ?
                    <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(toHtml(format(node.verifyBy.args))) }} /> :
                    <div>{format(node.verifyBy?.args)}</div>
                }
                </Badge>}
              </div>
            </div>
          </div>
        )
      })}
      <br />
      <div className="flex gap-4">
        <button className="btn btn-blue" onClick={() => markAsDirty(form)}>
          Zkontrolovat
        </button>
        <button className="btn btn-blue" disabled={invalid} onClick={submitQuizHandler}>
          Odeslat
        </button>
        <button className="btn btn-red" disabled={!invalid} onClick={submitQuizHandler}>
          Odeslat nekompletní
        </button>
      </div>
      {verified &&
        <div className="grow flex flex-wrap gap-2">
          <TextBadge text="Úlohy" type="Gray">{`${totalAnswers} / ${questions.length}`}</TextBadge>
          <TextBadge text="Body" type="Gray">{`${totalPoints} / ${maxTotalPoints}`}</TextBadge>
        </div>
      }

    </div>
  )
}

const QuizFormContainer = connect(mapState, mapDispatch)(QuizForm);
export default QuizFormContainer;