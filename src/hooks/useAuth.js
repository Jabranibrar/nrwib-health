import { useQuery, gql } from '@apollo/client';
import React, { createContext, useContext } from 'react';

const DEFAULT_STATE = {
  loggedIn: false,
  user: undefined,
  loading: false,
  error: undefined
};

const AuthContext = createContext(DEFAULT_STATE);

export const GET_USER = gql`
  query getUser {
    viewer {
      id
      databaseId
      firstName
      lastName
      email
      capabilities
      profileField {
        adminApproved
        title
        phoneNumber
        emailFrequency
        organization
      }
      roles {
        nodes {
          name
        }
      }
    }
  }
`;

export function AuthProvider({ children }) {
  const { data, loading, error } = useQuery(GET_USER);
  const user = data?.viewer;

  const loggedIn =
    user?.roles?.nodes?.[0]?.name === 'administrator' || user?.profileField?.adminApproved === 1;

  const value = {
    loggedIn,
    user,
    loading,
    error
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const useAuth = () => useContext(AuthContext);

export default useAuth;
