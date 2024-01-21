import { FormControl } from './form.utils';
import ToggleButtonGroup, { Option } from '@/components/core/ToggleButtonGroup';
import { Maybe } from './utils';
import { AnswerStatus } from '../models/quiz';


export function createOptionAnswer<T>(control: FormControl<Option<T>>, options: Option<T>[], status: AnswerStatus, onChange?: (value: Maybe<Option<T>>) => void) {
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

export function createBoolAnswer(control: FormControl<Option<boolean>>, status: AnswerStatus, onChange?: (value: Maybe<Option<boolean>>) => void) {
  return createOptionAnswer<boolean>(control, [
    { name: 'Ano', value: true },
    { name: 'Ne', value: false }], status, onChange)
}