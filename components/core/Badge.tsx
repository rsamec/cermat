import { cls } from '@/lib/utils/utils';
import React, { ReactNode } from 'react';

type BadgeProps = {
  text: string | number,
  children: ReactNode,
  type: "Success" | "Danger" | "Warning" | "Default" | "Gray"
}

const Badge: React.FC<BadgeProps> = ({ type, children }) => {


  return (
    <span className={cls(['inline-flex items-center py-0.5 px-3 rounded-lg font-medium text-white',
      type == "Default" && 'bg-blue-600 dark:bg-blue-500',
      type == "Success" && 'bg-green-500',
      type == "Danger" && 'bg-red-500',
      type == "Warning" && 'bg-yellow-500',
      type == "Gray" && ' bg-gray-500 '
    ])}>{children}</span>
  );
};

export default Badge;
