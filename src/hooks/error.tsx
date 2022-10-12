import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
  useMemo,
} from 'react';
import locales from '../locales';
import {DeezerApiError} from '../models/DeezerApiError';

export type ErrorContext = {
  currentError: string | null;
  popError: () => void;
  pushError: (err: DeezerApiError | Error) => void;
};

const ErrorContext = createContext<ErrorContext>({} as any);

export type ErrorProviderProps = {
  children: ReactNode;
};

export function ErrorProvider({children}: ErrorProviderProps) {
  const [errors, setErrors] = useState<(DeezerApiError | Error)[]>([]);

  const currentError = useMemo(() => {
    if (errors[0]) {
      const error = errors[0] as any;

      return (
        (error.deezerCode && (locales.errors as any)[error.deezerCode]) ||
        error.message
      );
    } else {
      return null;
    }
  }, [errors]);

  const popError = useCallback(() => {
    const shifted = [...errors];
    shifted.shift();
    setErrors(shifted);
  }, [errors]);

  const pushError = useCallback(
    (err: DeezerApiError | Error) => {
      setErrors([...errors, err]);
    },
    [errors],
  );

  const result = {
    currentError,
    popError,
    pushError,
  };

  return (
    <ErrorContext.Provider value={result}>{children}</ErrorContext.Provider>
  );
}

export default function useError(): ErrorContext {
  return useContext(ErrorContext);
}
