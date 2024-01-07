import React, { ChangeEvent } from 'react';
import withControl, { ValueProps } from './WithFormControl';


type InputNumberProps = ValueProps<number> & {
  min?: number;
  max?: number;
}

const InputNumber: React.FC<InputNumberProps> = ({ value, onChange, min = 0, max = 100 }) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value, 10);
    console.log('newValue', newValue);
    if (!isNaN(newValue)) {
      if (newValue >= min && newValue <= max){
        onChange?.(newValue);
      }
    }
    else {
      onChange?.();
    }
  };

  return (
    <input
      type="number"
      value={value}
      onChange={handleChange}
      min={min}
      max={max}
    />
  );
};

export default withControl<number,InputNumberProps>(InputNumber);
