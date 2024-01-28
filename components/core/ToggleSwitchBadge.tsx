import { cls } from '@/lib/utils/utils';
import React, { ReactNode } from 'react';
import { ValueProps } from './WithFormControl';

type ToggleSwitchBadgeProps = {
  text: string | number,
  children: ReactNode,
  type: "Success" | "Danger" | "Warning" | "Default" | "Gray"
} & ValueProps<boolean>

const ToggleSwitchBadge: React.FC<ToggleSwitchBadgeProps> = ({ text, type, children, value, onChange }) => {

  const handleChange = (event: any) => {
    onChange?.(event.target.checked)
  }

  return (
    <div className="py-2 px-3 inline-flex items-center gap-x-2 font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm dark:bg-slate-900 dark:border-gray-700 dark:text-white">
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={value} onChange={handleChange} className="sr-only peer" />
          <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{text}</span>
      </label>
      {value && (<span className={cls(['inline-flex items-center py-0.5 px-3 rounded-full font-medium text-white',
        type == "Default" && 'bg-blue-600 dark:bg-blue-500',
        type == "Success" && 'bg-green-500',
        type == "Danger" && 'bg-red-500',
        type == "Warning" && 'bg-yellow-500',
        type == "Gray" && ' bg-gray-500 '
      ])}>{children}</span>)}      

    </div>

  );
};

export default ToggleSwitchBadge;
