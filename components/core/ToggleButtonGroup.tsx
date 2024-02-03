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

export const ToggleButtonGroup = <T extends Object>({
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
      {options.map((option, i) => {

        const selected = isSelected(value, option);
        return (<button
          className={cls(['max-w-screen-sm', 'py-3 px-4 inline-flex items-center gap-x-2 rounded text-sm text-left font-medium focus:z-10 border text-gray-800 shadow-sm dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600',
            '--:dark:bg-slate-900 --:hover:bg-gray-50 --:dark:hover:bg-gray-800 --:border-gray-200 --:dark:border-gray-700',
            selected && '-:bg-slate-200 -:hover:bg-slate-300 -:dark:bg-slate-600 -:hover:bg-gray-350 -:dark:hover:bg-gray-700 -:border-gray-200 -:dark:border-gray-700',
            selected && type === 'success' && 'bg-green-100 dark:bg-green-800 hover:bg-green-200 border-green-200 dark:border-green-400',
            selected && type === 'danger' && 'bg-red-100 dark:bg-red-800 hover:bg-red-200 border-red-200 dark:border-red-400'])}
          key={`opt_${i}`}
          onClick={() => handleChange(option)}
        >
          <div className="inline-flex self-start items-center gap-x-2">
            {badge != null ?
              <span className={cls(['inline-flex self-start py-0.5 px-3 rounded-full font-medium text-white bg-gray-500'])}>{badge(option)}</span> : null}
            <span dangerouslySetInnerHTML={{ __html:format ? format(option) : option.toString()}}></span>
          </div>

        </button>)
      }
      )}
    </div>
  );
};

export type Option<T> = { name: string, value: T };
export default withControl<Option<any>, ToggleButtonGroupProps<Option<any>>>(ToggleButtonGroup);

