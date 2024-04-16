declare global {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<React.HTMLAttributes<MathfieldElement>, MathfieldElement>;
    }
  }
}
import React, { ChangeEvent, FormEvent, createElement } from 'react';
import withControl, { ValueProps } from './WithFormControl';
import { MathfieldElement } from 'mathlive';
import 'mathlive';
type LatexInputProps = ValueProps<string> & { className?: string }

const LatexInput: React.FC<LatexInputProps> = ({ value, onChange, className }) => {
  const handleChange = (e: FormEvent<MathfieldElement>) => {
    onChange?.((e.target as any).value);
  };

  return (
    <div className={className}>
      <math-field
        style={{'minWidth':'150px'}}
        onInput={handleChange}>
          {value ?? ''}
      </math-field>
    </div>
  );
};

export default withControl<string, LatexInputProps>(LatexInput);
