import React from 'react';
import {Button, Paragraph, Title} from 'react-native-paper';
import {
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {useMutation} from 'react-query';
import Spinner from 'react-native-loading-spinner-overlay';
import Form from '../components/form/Form';
import SubmitButton from '../components/form/SubmitButton';
import TextField from '../components/form/TextField';
import style from '../constants/style';
import locales from '../locales';
import useUser from '../hooks/user';
import useKeyboard from '../hooks/keyboard';

const logo = require('../assets/logo.png');

export default function LoginScreen() {
  const {login, useOfflineMode} = useUser();
  const {keyboardShown} = useKeyboard();

  const {mutateAsync: handleLogin, isLoading} = useMutation(
    ({email, password}: {email: string; password: string}) => {
      return login(email, password);
    },
  );

  return (
    <KeyboardAvoidingView>
      <SafeAreaView style={styles.container}>
        <Spinner visible={isLoading} />
        {!keyboardShown && (
          <View style={styles.headerContainer}>
            <Image source={logo} />
            <Title>{locales.common.deemove}</Title>
          </View>
        )}
        <Form
          initialValues={{
            email: '',
            password: '',
          }}
          onSubmit={handleLogin}>
          <View style={styles.formContainer}>
            <Paragraph style={styles.formChild}>
              {locales.login.logToDeezer}
            </Paragraph>
            <TextField style={styles.formChild} name="email" label="Email" />
            <TextField
              style={styles.formChild}
              name="password"
              label={locales.common.password}
              secureTextEntry
            />
            <SubmitButton style={styles.formChild} mode="contained">
              {locales.login.login}
            </SubmitButton>
            <Button
              style={styles.formChild}
              mode="outlined"
              onPress={useOfflineMode}>
              {locales.login.offlineMode}
            </Button>
          </View>
        </Form>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    padding: style.margeLarge,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: -style.margeMedium,
  },
  formChild: {
    marginTop: style.margeSmall,
  },
});
