import { useMutation } from '@apollo/client';
import { UPDATE_USER } from '@/src/mutations/update-user';
import { GET_USER } from '@/src/hooks/useAuth';

export function useUpdateUserMutation() {
  const [mutation, mutationResults] = useMutation(UPDATE_USER, {
    refetchQueries: [GET_USER],
  });

  const updateUser = (input, context) => {
    return mutation({
      variables: {
        input,
      },
      context,
    });
  };

  return [updateUser, mutationResults];
}
