import React, { ChangeEvent } from 'react';
import withControl, { ValueProps } from './WithFormControl';
import DOMPurify from 'dompurify';
import { toHtml } from '@/lib/utils/math.utils';


type MathInputProps = ValueProps<string> & { className?: string }

const MathInput: React.FC<MathInputProps> = ({ value, onChange, className }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (<div className='grow flex flex-col'>
    <input
      type="text"
      className={className}
      value={value ?? ''}
      onChange={handleChange}
    />
    {value ? <div className='[&>span.error]:text-red-600 [&>span.error]:dark:text-red-100' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(toHtml(value)) }} /> : ''}
  </div>
  );
};

export default withControl<string, MathInputProps>(MathInput);
