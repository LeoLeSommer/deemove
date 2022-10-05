import React, {ReactNode} from 'react';
import {Formik} from 'formik';

export type FormProps = {
  initialValues: {[key: string]: any};
  onSubmit: (values: any) => void | Promise<void>;
  children: ReactNode;
};

export default function Form({initialValues, onSubmit, children}: FormProps) {
  return (
    <Formik initialValues={initialValues} onSubmit={onSubmit}>
      {children}
    </Formik>
  );
}
