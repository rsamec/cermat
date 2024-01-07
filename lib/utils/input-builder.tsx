import { FormControl } from './form.utils';
import { FormAnswerMetadata } from './form-answers';
import ToggleButtonGroup, { Option } from '@/components/core/ToggleButtonGroup';


export function createOptionAnswer<T>(control: FormControl<Option<T>, FormAnswerMetadata>, options: Option<T>[] ) {  
  return <ToggleButtonGroup
    control={control}
    options={options}
    format={(option) => option.name}
    isSame={(selected, option) => selected != null && selected.value == option.value}
  />
}

export function createBoolAnswer(control: FormControl<Option<boolean>, FormAnswerMetadata>) {  
  return createOptionAnswer<boolean>(control, [
    { name: 'Ano', value: true },
    { name: 'Ne', value: false }])
}

export function createQuestion(content: string) {
  return <div
    className="prose lg:prose-xl flex flex-col space-y-2"
    dangerouslySetInnerHTML={{ __html: content }}
  />
}