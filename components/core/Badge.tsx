import { cls } from '@/lib/utils/utils';
import React, { ChangeEvent } from 'react';

type BadgeProps = {
  text: string | number,
  badgeText: string | number,
  type: "Success" | "Danger" | "Warning" | "Default" | "Gray"
}

const Badge: React.FC<BadgeProps> = ({ text, type, badgeText }) => {


  return (
    <div className="py-2 px-3 inline-flex items-center gap-x-2 font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm dark:bg-slate-900 dark:border-gray-700 dark:text-white">
      <span className={cls(['inline-flex items-center py-0.5 px-3 rounded-full font-medium text-white',
        type == "Default" && 'bg-blue-600 dark:bg-blue-500',
        type == "Success" && 'bg-green-500',
        type == "Danger" && 'bg-red-500',
        type == "Warning" && 'bg-yellow-500',
        type == "Gray" && ' bg-gray-500 ' 
      ])}>{badgeText}</span>
      <span className="mr-2">{text}</span>
    </div>

  );
};

export default Badge;
