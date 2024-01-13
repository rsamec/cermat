import { FormAnswerMetadata, FormControl } from './form.utils';
import ToggleButtonGroup, { Option } from '@/components/core/ToggleButtonGroup';
import { Maybe } from './utils';


export function createOptionAnswer<T>(control: FormControl<Option<T>, FormAnswerMetadata>, options: Option<T>[], onChange?:(value:Maybe<Option<T>>) => void ) {  
  return <ToggleButtonGroup
    control={control}
    options={options}
    format={(option) => option.name}
    isSame={(selected, option) => selected != null && selected.value == option.value}
    onChange={onChange}
  />
}

export function createBoolAnswer(control: FormControl<Option<boolean>, FormAnswerMetadata>, onChange?:(value: Maybe<Option<boolean>>) => void) {  
  return createOptionAnswer<boolean>(control, [
    { name: 'Ano', value: true },
    { name: 'Ne', value: false }], onChange)
}

export function createQuestion(content: string) {
  return <div
    className="prose lg:prose-xl flex flex-col space-y-2"
    dangerouslySetInnerHTML={{ __html: content }}
  />
}