import {useCallback} from 'react';
import axios from 'axios';
import {Cookie} from 'tough-cookie';
import useCookie from '../hooks/cookie';
import {CLIENT_ID, CLIENT_SECRET, httpHeaders} from '../hooks/api';
import {md5Encrypt} from '../utils/crypto';

export function useLogin() {
  const {setCookie} = useCookie();

  return useCallback(
    async (email: string, password: string) => {
      password = md5Encrypt(password);
      const hash = md5Encrypt(
        [CLIENT_ID, email, password, CLIENT_SECRET].join(''),
      );

      let response = await axios.get('https://api.deezer.com/auth/token', {
        params: {
          app_id: CLIENT_ID,
          login: email,
          password,
          hash,
        },
      });

      const accessToken = response.data.access_token;

      // Login for old API
      const arl = await getArlFromAccessToken(accessToken);

      const oldApiAccessToken = await loginViaArl(arl, setCookie);

      return {
        accessToken: accessToken as string,
        oldApiAccessToken: oldApiAccessToken,
      };
    },
    [setCookie],
  );
}

async function getArlFromAccessToken(accessToken: string): Promise<string> {
  await axios.get('https://api.deezer.com/platform/generic/track/3135556', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  let response = await axios.get(
    'https://www.deezer.com/ajax/gw-light.php?method=user.getArl&input=3&api_version=1.0&api_token=null',
    {
      headers: httpHeaders,
    },
  );

  return response.data.results.trim();
}

async function loginViaArl(arl: string, setCookie: (cookie: Cookie) => void) {
  // Create cookie
  let cookie = new Cookie({
    key: 'arl',
    value: arl,
    domain: '.deezer.com',
    path: '/',
    httpOnly: true,
  });

  setCookie(cookie);

  // Check if user logged in
  const response = await axios.post(
    'https://www.deezer.com/ajax/gw-light.php',
    {},
    {
      params: {
        api_version: '1.0',
        api_token: 'null',
        input: '3',
        method: 'deezer.getUserData',
      },
      headers: {
        ...httpHeaders,
        Cookie: cookie.toString(),
      },
      timeout: 30000,
    },
  );

  const userId = response.data?.results?.USER?.USER_ID;
  if (!userId || userId === 0) {
    throw new Error('Old API login failed');
  }

  return response.data?.results?.checkForm as string;
}
