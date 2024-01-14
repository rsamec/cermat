import React, { ChangeEvent } from 'react';
import withControl, { ValueProps } from './WithFormControl';


type TextInputProps = ValueProps<string> & { className?: string }

const TextInput: React.FC<TextInputProps> = ({ value, onChange, className }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <input
      type="text"
      className={className}
      value={value ?? ''}
      onChange={handleChange}
    />
  );
};

export default withControl<string, TextInputProps>(TextInput);
