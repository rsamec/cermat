/* eslint-disable react/display-name */
import { FormControl } from '@/lib/utils/form.utils';
import React, { useEffect, useState } from 'react';

export interface ValueProps<T> {
  value?: T;
  onChange?: (value?:T) => void;
}
export interface withFormControl<T> {
  control: FormControl<T>;
}

function withControl<T, P extends ValueProps<T>>(
  WrappedComponent: React.FC<P & withFormControl<T>>
)  {
  return (props: P & withFormControl<T>) => {
    const [value, setValue] = useState<T | undefined>();

    useEffect(() => {
      const subscription = props.control.valueChanges
        .subscribe((inputValue) => {
          setValue(inputValue)
        });

      return () => subscription.unsubscribe();
    }, [props.control]);

    const handleChange = (value: T) => {
      props.control.setValue(value);
      props.onChange?.(value);
    };

    return <WrappedComponent {...props} value={value} onChange={handleChange} />;
  };
};

export default withControl;
