import React, { ChangeEvent } from 'react';
import withControl, { ValueProps } from './WithFormControl';
type MathInputProps = ValueProps<string> & { className?: string }

const MathInput: React.FC<MathInputProps> = ({ value, onChange, className }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div>
      <input
        type="text"
        className={className}
        value={value ?? ''}
        onChange={handleChange}
      /> 
    </div>   
  );
};

export default withControl<string, MathInputProps>(MathInput);
