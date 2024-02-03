import ToggleButtonGroup, { Option } from '@/components/core/ToggleButtonGroup';
import { Maybe, cls, strToSimpleHtml } from './utils';
import { AnswerStatus } from '../models/quiz';
import { ComponentFunctionSpec } from './catalog-function';
import InputNumber from '@/components/core/InputNumber';
import MathInput from '@/components/core/MathInput';
import SortableList from '@/components/core/SortableList';
import TextInput from '@/components/core/TextInput';
import { Field, List, Error } from "@rx-form/react";
import { FieldControl, AbstractControl, GroupControl, ListControl } from "@rx-form/core";
import { AnswerInputBy } from './quiz-specification';
import { patternCatalog } from './form.utils';
import MathEquationInput from '@/components/core/MathEquationInput';


export function createOptionAnswer<T>(control: FieldControl<Option<T>>, options: Option<T>[], status: AnswerStatus, onChange?: (value: Maybe<Option<T>>) => void) {
  return <ToggleButtonGroup
    control={control}
    options={options}
    format={(option) => option.name}
    badge={(option) => option.value === true ? "A" : option.value === false ? 'N' : option.value}
    type={status == "correct" ? 'success' : status == 'incorrect' ? "danger" : undefined}
    isSame={(selected, option) => selected != null && selected.value == option.value}
    onChange={onChange}
  />
}

export function createBoolAnswer(control: FieldControl<Option<boolean>>, status: AnswerStatus, onChange?: (value: Maybe<Option<boolean>>) => void) {
  return createOptionAnswer<boolean>(control, [
    { name: 'Ano', value: true },
    { name: 'Ne', value: false }], status, onChange)
}

function statusInput({ dirty, invalid }: { dirty: boolean, invalid: boolean }) {
  //return status == "error" ?
  //"bg-green-50 border border-green-500 text-green-900 text-sm focus:ring-green-500 focus:border-green-500 dark:border-green-500"
  return invalid ?
    "bg-red-50 border border-red-500 text-red-900 text-sm focus:ring-red-500 focus:border-red-500 dark:border-red-500" :
    'text-gray-900 border border-gray-300 bg-gray-50';
}

function inputGroup({ input, args }: { input: React.ReactNode, args?: { prefix?: string, suffix?: string } }) {
  const { prefix, suffix } = args ?? {};
  return <div className="max-w-lg relative grow flex">
    {prefix != null ? <span
      className="flex items-center whitespace-nowrap rounded-l border border-r-0 border-solid border-neutral-300 px-3 py-[0.25rem] text-center text-base font-normal leading-[1.6] text-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"
      dangerouslySetInnerHTML={{ __html: strToSimpleHtml(prefix) }}></span> : null}
    {input}

    {suffix != null ? <span
      className="flex items-center whitespace-nowrap rounded-r border border-l-0 border-solid border-neutral-300 px-3 py-[0.25rem] text-center text-base font-normal leading-[1.6] text-neutral-700 dark:border-neutral-600 dark:text-neutral-200 dark:placeholder:text-neutral-200"
      dangerouslySetInnerHTML={{ __html: strToSimpleHtml(suffix) }} ></span> : null}
  </div>
}

function renderInputComponentBySpec(inputBy: ComponentFunctionSpec, control: FieldControl) {

  if (inputBy.kind === "number") {
    return inputGroup(
      {
        input: <InputNumber control={control} step={inputBy.args?.step} className={cls(["relative m-0 block w-[1px] min-w-0 flex-auto p-2 dark:bg-gray-700 dark:text-white", statusInput(control)])} ></InputNumber>,
        args: inputBy.args
      })
  }
  else if (inputBy.kind === "text") {
    return inputGroup({
      input: <TextInput control={control} className={cls([
        "relative m-0 block w-[1px] min-w-0 flex-auto p-2 dark:bg-gray-700 dark:text-white",
        statusInput(control)])}></TextInput>,
      args: inputBy.args
    })
  }
  else if (inputBy.kind === "math") {
    const hintClass = 'italic text-sm'
    return inputGroup({
      input: <div className="flex flex-col">
        {inputBy.args?.hintType != "equation" &&
          <>
            <MathInput control={control} className={cls([
              "relative m-0 block  min-w-0 flex-auto p-2 dark:bg-gray-700 dark:text-white",
              statusInput(control)
            ])}></MathInput>
            {inputBy.args?.hintType != null && <span className={hintClass}>
              Násobení např.2x, x(x+1). Dělení a zlomek x/2, 1/(3+2). Mocninu x<sup>2</sup> zapište jako x^2.
            </span>
            }
          </>
        }
        {inputBy.args?.hintType == "equation" &&<MathEquationInput control={control} className={cls([
          "relative m-0 block  min-w-0 flex-auto p-2 dark:bg-gray-700 dark:text-white",
          statusInput(control)
        ])}></MathEquationInput>}
      </div>,
      args: inputBy.args
    })
  }
  return null
}

export function renderControl(control: AbstractControl, inputBy: AnswerInputBy, { options }: { options: Option<string>[] }) {
  if (inputBy == null) return null;

  if (control instanceof GroupControl) {
    return renderGroup(control, inputBy as { [index: string]: ComponentFunctionSpec })
  }
  else if (control instanceof ListControl) {
    return renderList(control, inputBy as ComponentFunctionSpec[])
  }
  else if (control instanceof FieldControl) {
    const spec = inputBy as ComponentFunctionSpec;
    return (spec.kind === "number" || spec.kind === "text" || spec.kind === "math") ?
      renderInputField(control, spec) :
      renderComponentByType(control, inputBy as ComponentFunctionSpec, { options, status: 'unanswered' })
  }
  else {
    return <div>Unknown control type</div>
  }
}

function renderGroup(child: GroupControl, spec: { [index: string]: ComponentFunctionSpec }) {
  return <div>{
    Object.entries(child.controls ?? {}).map(([name, control], i) => {
      return <div key={name}>
        <span>{name}</span>
        {renderInputField(control as FieldControl, spec[name])}
      </div>
    })
  }
  </div>
}

function renderInputField(control: FieldControl, spec: ComponentFunctionSpec) {

  return <div className='flex flex-col'>
    <Field control={control}>
      {({ value, setValue }) =>
        <>{renderInputComponentBySpec(spec, control)}</>
      }
    </Field>
    <Error control={control}>
      {({ dirty, errors }) => {
        const errorClass = 'text-red-600 dark:text-red-300'
        return (
          <>
            {dirty}
            {dirty && (
              <>
                {errors?.required && <span className={errorClass} >Zadejte hodnotu</span>}
                {errors?.pattern && <span className={errorClass}>{patternCatalog.ratio.hint}</span>}
                {errors?.mathExpression && <span className={errorClass}>Chyba v matematickém výrazu:{errors.mathExpression.expression}</span>}
              </>
            )}
          </>
        );
      }}
    </Error>
  </div>
}

function renderList(control: ListControl, spec: ComponentFunctionSpec[]) {
  return <ol className='flex flex-wrap gap-4'>
    <List control={control}>
      {({ childControls, ...rest }) => {
        return (
          <>
            {childControls!.map((control, i) => {
              return (
                <li key={`key${i}`} className='flex gap-2'>
                  <span>{i + 1}.</span>
                  <Field name={`${i}`}>
                    {({ value, setValue }) =>
                      <span>{renderInputComponentBySpec(spec[i], control as FieldControl)}</span>
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
}
export function renderComponentByType(control: AbstractControl, spec: ComponentFunctionSpec, { options, status, onChange }:
  { options: Option<string>[], status: AnswerStatus, onChange?: (value: Maybe<Option<string | boolean>>) => void }) {
  const ctrl = control as FieldControl;

  if (spec.kind === "bool") {
    return createBoolAnswer(ctrl, status, onChange)
  }
  else if (spec.kind === "options") {
    return createOptionAnswer(ctrl, options, status, onChange)
  }
  else if (spec.kind == "sortedOptions") {
    return <div className="flex flex-col gap-4">
      <SortableList control={ctrl} options={options}></SortableList>
    </div>
  }
  return renderInputComponentBySpec(spec, ctrl)
}

