import { useMutation } from '@apollo/client';
import { RESET_USER_PASSWORD } from '@/src/mutations/reset-user-password';

export const useResetUserPasswordMutation = () => {
  const [mutation, mutationResults] = useMutation(RESET_USER_PASSWORD);

  const resetUserPassword = (key, login, password) => {
    mutation({
      variables: {
        key,
        login,
        password,
      },
    });
  };

  return [resetUserPassword, mutationResults];
};
