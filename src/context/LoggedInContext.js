import { createContext, useContext, useMemo } from 'react';
import useSWR from 'swr';
import { fetcher } from 'src/utils/fetcher';

const LoggedInContext = createContext({
  loggedIn: undefined,
  token: null,
});

export function LoggedInProvider(props) {
  const { data } = useSWR(
    '/api/checkIfLoggedIn',
    fetcher
  );

  const { loggedIn, token } = data || {};
  const value = useMemo(() => ({ loggedIn, token }), [
    loggedIn,
    token,
  ]);

  return <LoggedInContext.Provider value={value} {...props} />;
}

export function useLoggedIn() {
  const context = useContext(LoggedInContext);

  if (!context) {
    throw new Error("You need to wrap LoggedInProvider.");
  }

  return context;
}
