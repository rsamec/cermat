import { cls } from '@/lib/utils/utils';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';



type IconBadgeProps =  {
  icon: IconDefinition,
  type: "Success" | "Danger" | "Warning"
}

const IconBadge: React.FC<IconBadgeProps> = ({ icon, type }) => {
  

  return (
    <span className={cls(['inline-flex','rounded','uppercase','p-2','text-lg','font-bold',
     type == "Success" && 'bg-green-300',
     type == "Danger" && 'bg-red-300',
     type == "Warning" && 'bg-yellow-300'
    ])}><FontAwesomeIcon fontSize={30} icon={icon} /></span>

  );
};

export default IconBadge;
