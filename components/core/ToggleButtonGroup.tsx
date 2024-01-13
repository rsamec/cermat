'use client'

import React from 'react';
import withControl, { ValueProps } from './WithFormControl';
import { Maybe } from '@/lib/utils/utils';

type ToggleButtonGroupProps<T> = ValueProps<T> & {
  options: T[];
  format?: (option: T) => string;
  isSame?: (selected: Maybe<T>, option: T) => boolean
}

const ToggleButtonGroup = <T extends Object>({
  options,
  value,
  onChange,
  format,
  isSame
}: ToggleButtonGroupProps<T>) => {

  const isSelected = isSame ?? ((selected: Maybe<T> | undefined, option: T) => selected != null && selected === option);

  const handleChange = (selectedValue: T) => {
    onChange?.(selectedValue);
  };


  return (
    <div>
      {options.map((option, i) => (
        <button
          key={`opt_${i}`}
          onClick={() => handleChange(option)}
          style={{
            backgroundColor: isSelected(value, option) ? 'blue' : 'gray',
            color: 'white',
            padding: '8px',
            margin: '4px',
            cursor: 'pointer',
          }}
        >
          {format ? format(option) : option.toString()}
        </button>
      ))}
    </div>
  );
};

export type Option<T> = { name: string, value: T };
export default withControl<Option<any>, ToggleButtonGroupProps<Option<any>>>(ToggleButtonGroup);

