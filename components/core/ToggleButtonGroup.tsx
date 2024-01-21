'use client'

import React from 'react';
import withControl, { ValueProps } from './WithFormControl';
import { Maybe, cls } from '@/lib/utils/utils';

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
    <div className='max-w-2xl flex flex-col rounded-lg shadow-sm'>
      {options.map((option, i) => (
        <button
          className={cls(['py-3 px-4 inline-flex items-center gap-x-2 rounded-t-md text-sm text-justify font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600',
          isSelected(value, option) && 'bg-blue-500 hover:bg-blue-500'])}
          key={`opt_${i}`}
          onClick={() => handleChange(option)}
        >
          {format ? format(option) : option.toString()}
        </button>
      ))}
    </div>
  );
};

export type Option<T> = { name: string, value: T };
export default withControl<Option<any>, ToggleButtonGroupProps<Option<any>>>(ToggleButtonGroup);

