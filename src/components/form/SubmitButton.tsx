import React from 'react';
import {useFormikContext} from 'formik';
import {Button} from 'react-native-paper';

type ButtonProps = React.ComponentProps<typeof Button>;

export type SubmitButtonProps = Omit<ButtonProps, 'onPress'>;

export default function SubmitButton(props: SubmitButtonProps) {
  const {submitForm} = useFormikContext();

  return <Button {...props} onPress={submitForm} />;
}
