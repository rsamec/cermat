'use client'

import React, { useState } from 'react';

interface RadioButtonGroupProps<T> {
  options: T[];
  onSelect?: (selectedValue: string) => void;
  format?: (option: T) => string;
  value: (option: T) => string;
}

const RadioButtonGroup = <T extends Object>({
  options,
  onSelect,
  format,
  value,
}: RadioButtonGroupProps<T>) => {

  const [selectedOption, setSelectedOption] = useState<string>('');

  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    onSelect && onSelect(selectedValue);
  };

  const getLabel = (selectedOptionValue: string) => {
    const selectedOption = options.find((option) => value(option) === selectedOptionValue);
    return selectedOption ? (format ? format(selectedOption!) : value(selectedOption)): '' ;
  };
 
  return (
    <div>
      {options.map((option) => (
        <label key={value(option)}>
          <input
            type="radio"
            value={value(option)}
            checked={selectedOption === value(option)}
            onChange={handleRadioChange}
          />
          {format ? format(option) : value(option)}
        </label>
      ))}      
    </div>
  );
};

export default RadioButtonGroup;
