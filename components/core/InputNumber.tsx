import React, { ChangeEvent } from 'react';
import withControl, { ValueProps } from './WithFormControl';


type InputNumberProps = ValueProps<number> & {
  className: string,
  min?: number;
  max?: number;
}

const InputNumber: React.FC<InputNumberProps> = ({ value, onChange, min = 0, max = 100, className }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      if (newValue >= min && newValue <= max) {
        onChange?.(newValue);
      }
    }
    else {
      onChange?.();
    }
  };

  return (
    <input
      className={className}
      type="number"
      value={value ?? ''}
      onChange={handleChange}
      min={min}
      max={max}
    />
  );
};

export default withControl<number, InputNumberProps>(InputNumber);
