import React from 'react';
import {StyleProp, TextStyle} from 'react-native';
import {useField} from 'formik';
import {TextInput} from 'react-native-paper';

export type TextFieldProps = {
  name: string;
  label: string;
  icon?: string;
  secureTextEntry?: boolean;
  style?: StyleProp<TextStyle>;
};

export default function TextField({
  name,
  label,
  icon,
  secureTextEntry,
  style,
}: TextFieldProps) {
  const [field, , helpers] = useField(name);

  return (
    <TextInput
      label={label}
      value={field.value}
      onChangeText={helpers.setValue}
      right={icon && <TextInput.Icon icon={icon} />}
      secureTextEntry={secureTextEntry}
      style={style}
    />
  );
}
