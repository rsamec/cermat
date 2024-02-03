'use client'
import * as React from "react";
import { useEffect, useRef } from "react";
import { Answer, AnswerMetadata } from "@/lib/utils/quiz-specification";
import { TreeNode, getAllLeafsWithAncestors } from "@/lib/utils/tree.utils";
import { convertToForm } from "@/lib/utils/form.utils";
import { Group, Field, List } from "@rx-form/react";
import { Maybe, cls } from "@/lib/utils/utils";
import { FieldControl, GroupControl, ListControl, GroupChildControls } from "@rx-form/core";

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
type Props = { quizTree: TreeNode<Answer<any>> } //& StateProps & DispatchProps;

const QuizForm: React.FC<Props> = ({ quizTree }) => {

  const groupControlRef = useRef(convertToForm(quizTree))

  useEffect(() => {
    const subscription = groupControlRef.current.valueChange.subscribe((v) => {
      // eslint-disable-next-line no-console
      console.log('value changed', v);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const renderInput = ({ label, value, setValue }: { label?: string, value: any, setValue: (value: any) => void }) => {
    return <div className="mb-6">
      {label && <label htmlFor="default-input" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</label>}
      <input
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        value={value as Maybe<string>}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  }


  const renderGroup = (childControls: GroupChildControls, level: number) => {
    return Object.entries(childControls).map(([name, control], i) => {
      const isGroup = control instanceof GroupControl;
      const isList = control instanceof ListControl;
      const node = isGroup ? <ul key={`${name}-${i}`} className={cls(["text-gray-500 dark:text-gray-400", `px-${level * 4}`])}>
        <Group control={control}>
          {
            ({ childControls: subChildControls }) => (
              <>
                {renderGroup(subChildControls ?? {}, level++)}
              </>)
          }

        </Group></ul> : isList ?
        renderList(control as ListControl, name)
        : renderField(control as FieldControl, name);

      return <li key={`${name}-${i}`}>{node}</li>;
    })
  }

  const renderField = (control: FieldControl, name: string) => (
    <Field control={control as FieldControl}>
      {({ value, setValue }) =>
        <>{renderInput({ label: name, value, setValue })}</>
      }
    </Field>)

  const renderList = (control: ListControl, name: string) => (
    <>
      <span>{name}</span>
      <ol className="ps-5 mt-2 space-y-1 list-decimal list-inside">

        <List control={control}>
          {({ childControls, ...rest }) => {
            return (
              <>
                {childControls!.map((control, i) => {
                  return (
                    <li key={`key${i}`}>

                      <Field name={`${i}`}>
                        {({ value, setValue }) =>
                          <>{renderInput({  value, setValue })}</>
                        }
                      </Field>
                    </li>
                  );
                })}
              </>
            );
          }}
        </List>
      </ol>
    </>)

  return (
    <Group control={groupControlRef.current}>
      {({ childControls }) => (<>
        <ul className="px-4 space-y-4 text-gray-500 dark:text-gray-400">
          {renderGroup(childControls ?? {}, 1)}
        </ul>
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
    </Group >
  );
}
export default QuizForm;
//const QuizFormContainer = connect(mapState, mapDispatch)(QuizForm);
//export default QuizFormContainer;