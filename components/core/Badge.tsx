import { cls } from '@/lib/utils/utils';
import React, { ChangeEvent } from 'react';

type BadgeProps =  {
  text: string,
  type: "Success" | "Danger" | "Warning"
}

const Badge: React.FC<BadgeProps> = ({ text, type }) => {
  

  return (
    <span className={cls(['flex','rounded-full','uppercase','px-2','py-1','text-xs','font-bold','mr-3',
     type == "Success" && 'bg-green-100',
     type == "Danger" && 'bg-red-100',
     type == "Warning" && 'bg-yellow-100'
    ])}>{text}</span>

  );
};

export default Badge;
