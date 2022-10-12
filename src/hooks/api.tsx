import {useCallback, useMemo} from 'react';
import {useMutation, useQuery, useQueryClient} from 'react-query';
import axios, {AxiosResponse, Method} from 'axios';
import {CookieJar, Cookie} from 'tough-cookie';
import useUser from './user';
import useCookie from './cookie';
import {DeezerApiError} from '../models/DeezerApiError';
import useError from './error';

export const CLIENT_ID = '172365';
export const CLIENT_SECRET = 'fb0bec7ccc063dab0417eb7b0d847f34';
export const httpHeaders = {
  Host: 'www.deezer.com',
  Origin: 'https://www.deezer.com',
  'Content-Type': 'application/json; charset=utf-8',
  'User-Agent':
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36',
};

declare module 'axios' {
  interface AxiosRequestConfig {
    jar?: CookieJar;
  }
}

export function useDeezerMutation<Return, Args>(
  method: Method,
  path: string,
  config: (args: Args) => {
    data?: {[key: string]: string | number | null};
    params?: {[key: string]: string | number | null};
    mapper?: (data: any) => Return;
    onSuccess?: (data: Return | undefined) => void;
  } = () => ({}),
): {
  mutate: (args: Args) => void;
  mutateAsync: (args: Args) => Promise<Return | undefined>;
  isLoading: boolean;
  data: Return | undefined;
} {
  const {accessToken} = useUser();

  const result = useMutation(
    [method, path, accessToken],
    async (args: Args): Promise<Return | undefined> => {
      const {data, params, mapper, onSuccess} = config(args);

      const response = await axios(`https://api.deezer.com/${path}`, {
        method,
        params: {
          ...params,
          access_token: accessToken,
        },
        data,
      });

      const resultData = mapper && response.data && mapper(response.data);
      onSuccess && onSuccess(resultData);

      return resultData;
    },
  );

  return result;
}

export function useDeezerEntry<T>(
  path: string,
  mapper: (data: any) => T,
): {
  isLoading: boolean;
  data: T | null;
} {
  const {accessToken} = useUser();

  const result = useQuery([path, accessToken], async () => {
    const response = await axios.get(`https://api.deezer.com/${path}`, {
      params: {
        access_token: accessToken,
      },
    });

    return mapper(response.data);
  });

  return {
    ...result,
    data: result.data || null,
  };
}

export function useDeezerList<T>(
  path: string,
  mapper: (data: any) => T,
  limit?: number,
  query?: {[key: string]: string},
  options?: {
    abort: boolean;
  },
): {
  isLoading: boolean;
  data: T[];
  fetchNext: () => void;
} {
  const {accessToken} = useUser();
  const queryClient = useQueryClient();
  const queryKey = useMemo(
    () =>
      query
        ? [path, accessToken, limit, JSON.stringify(query)]
        : [path, accessToken, limit],
    [path, accessToken, limit, query],
  );

  const result = useQuery(queryKey, async () => {
    if (options?.abort) {
      return {
        data: [],
        next: undefined,
      };
    }

    const response = await axios.get(`https://api.deezer.com/${path}`, {
      params: {
        access_token: accessToken,
        limit,
        ...query,
      },
    });

    const data = response?.data?.data;
    return {
      data: data ? data.map(mapper) : [],
      next: response?.data?.next,
    };
  });

  const nextUrl = result?.data?.next;
  const fetchNext = useCallback(async () => {
    if (!nextUrl) {
      return;
    }

    const response = await axios.get(nextUrl, {
      params: {
        access_token: accessToken,
        limit,
      },
    });

    const data = response?.data?.data;
    const entries = data ? data.map(mapper) : [];

    queryClient.setQueryData(queryKey, (oldData: any) => {
      return {
        data: [...oldData.data, ...entries],
        next: response?.data?.next,
      };
    });
  }, [nextUrl, accessToken, limit, queryClient, queryKey, mapper]);

  return {
    ...result,
    data: result?.data?.data || [],
    fetchNext,
  };
}

export function useDeezerOldApiEntry<T>(
  method: string,
  mapper: (data: any) => T,
  args: {[key: string]: string | number | null} = {},
  params = {},
): {
  isLoading: boolean;
  data: T | null;
} {
  const {cookie} = useCookie();
  const {oldApiAccessToken} = useUser();
  const {pushError} = useError();

  const result = useQuery(
    [method, oldApiAccessToken, JSON.stringify(args), JSON.stringify(params)],
    () =>
      getDeezerOldApiEntry(
        method,
        mapper,
        args,
        params,
        oldApiAccessToken,
        cookie,
        pushError,
      ),
  );

  return {
    ...result,
    data: result.data || null,
  };
}

export async function getDeezerOldApiEntry<T>(
  method: string,
  mapper: (data: any) => T,
  args: {[key: string]: string | number | null} = {},
  params = {},
  oldApiAccessToken: string | null,
  cookie: Cookie,
  pushError: (err: DeezerApiError | Error) => void,
) {
  const response = await axios.post(
    'https://www.deezer.com/ajax/gw-light.php',
    args,
    {
      params: {
        api_version: '1.0',
        api_token: oldApiAccessToken,
        input: '3',
        method: method,
        ...params,
      },
      headers: {
        ...httpHeaders,
        Cookie: cookie.toString(),
      },
      timeout: 30000,
    },
  );

  if (response.data.error && Object.keys(response.data.error).length > 0) {
    const errorKey = Object.keys(response.data.error)[0];
    const errorMessage = response.data.error[errorKey];

    const error = new DeezerApiError(errorMessage, errorKey);
    pushError(error);
    throw error;
  }

  let data = response.data.results;
  return mapper(data);
}

export function throwDeezerErrorIfNeeded(
  deezerResponse: AxiosResponse,
  overwriteCode?: string,
) {
  const error = deezerResponse?.data?.error;
  if (error) {
    throw new DeezerApiError(error.message, overwriteCode || error.type);
  }
}
