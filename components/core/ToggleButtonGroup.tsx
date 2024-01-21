'use client'

import React from 'react';
import withControl, { ValueProps } from './WithFormControl';
import { Maybe, cls } from '@/lib/utils/utils';

type ToggleButtonGroupProps<T> = ValueProps<T> & {
  options: T[];
  format?: (option: T) => string;
  badge?: (option: T) => string;
  isSame?: (selected: Maybe<T>, option: T) => boolean
  type?: 'success' | 'danger'
}

const ToggleButtonGroup = <T extends Object>({
  options,
  value,
  onChange,
  format,
  badge,
  isSame,
  type
}: ToggleButtonGroupProps<T>) => {

  const isSelected = isSame ?? ((selected: Maybe<T> | undefined, option: T) => selected != null && selected === option);

  const handleChange = (selectedValue: T) => {
    onChange?.(selectedValue);
  };

  return (
    <div className='flex flex-wrap justify-items-start  gap-2'>
      {options.map((option, i) => (
        <button
          className={cls(['max-w-80','py-3 px-4 inline-flex items-center gap-x-2 rounded-t-md text-sm text-left font-medium focus:z-10 border border-gray-200 text-gray-800 shadow-sm hover:bg-gray-50 dark:bg-slate-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-800 dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600',
            isSelected(value, option) && (type === 'success' ? 'bg-green-100 hover:bg-green-200 border-green-200' : type === 'danger' ? 'bg-red-100 hover:bg-red-200 border-red-200' : 'bg-gray-300 hover:bg-gray-400')])}
          key={`opt_${i}`}
          onClick={() => handleChange(option)}
        >
          <div className="inline-flex self-start items-center gap-x-2">
            {badge != null ?
              <span className={cls(['inline-flex self-start py-0.5 px-3 rounded-full font-medium text-white bg-gray-500'])}>{badge(option)}</span> : null}
            <span >{format ? format(option) : option.toString()}</span>
          </div>

        </button>
      ))}
    </div>
  );
};

export type Option<T> = { name: string, value: T };
export default withControl<Option<any>, ToggleButtonGroupProps<Option<any>>>(ToggleButtonGroup);

