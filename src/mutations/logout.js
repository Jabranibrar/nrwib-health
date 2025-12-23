import { gql, useApolloClient, useMutation } from '@apollo/client';

const LOGOUT = gql`
  mutation logOut {
    logout(input: {}) {
      status
    }
  }
`;

export default LOGOUT;

export const useLogoutMutation = () => {
  const apolloClient = useApolloClient();
  const [ mutation, mutationResults ] = useMutation( LOGOUT );

  const logoutMutation = async () => {
    await apolloClient.clearStore();
    return mutation();
  };

  return { logoutMutation, results: mutationResults };
};