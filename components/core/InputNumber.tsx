import React, { ChangeEvent } from 'react';
import withControl, { ValueProps } from './WithFormControl';


type InputNumberProps = ValueProps<number> & {
  className: string,
  step?: number;
  min?: number;
  max?: number;
}

const InputNumber: React.FC<InputNumberProps> = ({ value, onChange, min, max, step, className }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      //if (newValue >= min && newValue <= max) {
        onChange?.(newValue);
      //}
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
      step={step}
      min={min}
      max={max}
    />
  );
};

export default withControl<number, InputNumberProps>(InputNumber);
