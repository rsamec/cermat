import React, { ChangeEvent } from 'react';
import withControl, { ValueProps } from './WithFormControl';
import { Maybe, Option } from '../../lib/utils/utils';
import { ToggleButtonGroup } from './ToggleButtonGroup';

type MathEquationInputProps = ValueProps<MathEquationValue> & { className?: string }
type MathEquationValue = true | false | string | undefined;

const MathEquationInput: React.FC<MathEquationInputProps> = ({ value, onChange, className }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };
  const handleSwitch = (value: Maybe<Option<MathEquationValue>>) => {
    onChange?.(value?.value)
  }
  const isBool = typeof value === 'boolean';
  const options: Option<MathEquationValue>[] = [
    {
      name: 'Nemá řešení',
      value: false
    },
    {
      name: 'Nekonečně mnoho řešení',
      value: true
    },
    {
      name: 'Řešení',
      value: undefined,
    }
  ];
  const isSame = (selected: Maybe<Option<MathEquationValue>>, option: Maybe<Option<MathEquationValue>>) =>
    typeof (option?.value) === 'boolean' ? selected != null && selected?.value === option.value : typeof (selected?.value) !== 'boolean'
  const selectedValue = options.find(d => d.value == value);
  const hintClass = 'italic text-sm'
  return (
    <div className='flex flex-wrap items-center'>
      <div>
        <ToggleButtonGroup format={(option) => ''}
          badge={(option) => option.value === true ? "∞" : option.value === false ? '∅' : '='}
          isSame={isSame}
          value={selectedValue}
          onChange={handleSwitch} options={options} ></ToggleButtonGroup>
      </div>
      {!isBool && <div>
        <input type="text"
          className={className}
          value={value ?? ''}
          onChange={handleChange}
        /></div>}
    </div>
  );
};

export default withControl<MathEquationValue, MathEquationInputProps>(MathEquationInput);
