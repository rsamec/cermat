/* eslint-disable react/display-name */
import { FieldControl  } from '@rx-form/core';
import { useControlValue } from '@rx-form/react'
import React, { useEffect, useState } from 'react';

export interface ValueProps<T> {
  value?: T;
  onChange?: (value?:T) => void;
}
export interface withFormControl<T> {
  control: FieldControl<T>;
}

function withControl<T, P extends ValueProps<T>>(
  WrappedComponent: React.FC<P & withFormControl<T>>
)  {
  return (props: P & withFormControl<T>) => {
    const value = useControlValue<FieldControl<T>>(props.control);

    const handleChange = (value: T) => {
      props.control.setValue(value);
      props.onChange?.(value);
    };

    return <WrappedComponent {...props} value={value} onChange={handleChange} />;
  };
};

export default withControl;
