import { useMutation } from '@apollo/client';
import { SEND_PASSWORD_RESET_EMAIL } from '@/src/mutations/send-password-reset-email';

export function useSendPasswordResetEmailMutation() {
  const [mutation, mutationResults] = useMutation(SEND_PASSWORD_RESET_EMAIL);

  const sendPasswordResetEmail = (username) => {
    return mutation({
      variables: {
        username,
      },
    });
  };

  return [sendPasswordResetEmail, mutationResults];
}
