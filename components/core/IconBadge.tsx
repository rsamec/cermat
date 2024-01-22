import { cls } from '@/lib/utils/utils';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';



type IconBadgeProps =  {
  icon: IconDefinition,
  text?: string
}

const IconBadge: React.FC<IconBadgeProps> = ({ icon, text }) => {
  

  return (
    <span className={cls(['py-1 px-1.5 inline-flex items-center gap-x-1 text-xs bg-gray-100 text-gray-800 rounded-md dark:bg-slate-500/20 dark:text-slate-400'])}>
      <FontAwesomeIcon icon={icon} />
      <span>{text}</span>
    </span>

  );
};

export default IconBadge;
