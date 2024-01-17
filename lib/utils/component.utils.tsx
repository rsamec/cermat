import { FormControl } from './form.utils';
import ToggleButtonGroup, { Option } from '@/components/core/ToggleButtonGroup';
import { Maybe } from './utils';


export function createOptionAnswer<T>(control: FormControl<Option<T>>, options: Option<T>[], onChange?:(value:Maybe<Option<T>>) => void ) {  
  return <ToggleButtonGroup
    control={control}
    options={options}
    format={(option) => option.name}
    isSame={(selected, option) => selected != null && selected.value == option.value}
    onChange={onChange}
  />
}

export function createBoolAnswer(control: FormControl<Option<boolean>>, onChange?:(value: Maybe<Option<boolean>>) => void) {  
  return createOptionAnswer<boolean>(control, [
    { name: 'Ano', value: true },
    { name: 'Ne', value: false }], onChange)
}