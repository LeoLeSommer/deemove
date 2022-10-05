import React, {createContext, useContext, ReactNode, useState} from 'react';
import {Cookie} from 'tough-cookie';

export type CookieContext = {
  cookie: Cookie;
  setCookie: (cookie: Cookie) => void;
};

const CookieContext = createContext<CookieContext>({
  cookie: new Cookie({}),
  setCookie: () => {},
});

export type CookieProviderProps = {
  children: ReactNode;
};

export function CookieProvider({children}: CookieProviderProps) {
  const [cookie, setCookie] = useState(new Cookie({}));

  const result = {
    cookie,
    setCookie,
  };

  return (
    <CookieContext.Provider value={result}>{children}</CookieContext.Provider>
  );
}

export default function useCookie(): CookieContext {
  return useContext(CookieContext);
}
