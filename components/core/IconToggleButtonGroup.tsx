'use client'

import React, { ReactNode } from 'react';
import withControl, { ValueProps } from './WithFormControl';
import { Maybe, cls, isEmptyOrWhiteSpace } from '@/lib/utils/utils';

type IconToggleButtonGroupProps<T> = ValueProps<T> & {
  options: T[];
  format?: (option: T) => string;
  icon?: (option: T) => ReactNode;
  isSame?: (selected: Maybe<T>, option: T) => boolean
}

const IconToggleButtonGroup = <T extends Object>({
  options,
  value,
  onChange,
  format,
  icon,
  isSame,

}: IconToggleButtonGroupProps<T>) => {

  const isSelected = isSame ?? ((selected: Maybe<T> | undefined, option: T) => selected != null && selected === option);

  const handleChange = (selectedValue: T) => {
    onChange?.(selectedValue);
  };

  return (
    <div>
      {options.map((option, i) => {

        const selected = isSelected(value, option);
        return (<button
          className={cls(['py-2 px-2 inline-flex items-center gap-x-2 text-sm text-left font-medium focus:z-10 border text-gray-800 shadow-sm dark:text-white dark:focus:outline-none dark:focus:ring-1 dark:focus:ring-gray-600',
            '--:dark:bg-slate-900 --:hover:bg-gray-50 --:dark:hover:bg-gray-800 --:border-gray-200 --:dark:border-gray-700',
            selected && '-:bg-slate-200 -:hover:bg-slate-300 -:dark:bg-slate-600 -:hover:bg-gray-350 -:dark:hover:bg-gray-700 -:border-gray-200 -:dark:border-gray-700'])}
          key={`opt_${i}`}
          onClick={() => handleChange(option)}
        >
          <div className="inline-flex self-start items-center gap-x-2">
            {icon != null && icon(option)}
            {format ? format(option) : option.toString()}
          </div>

        </button>)
      }
      )}
    </div>
  );
};
export default IconToggleButtonGroup
