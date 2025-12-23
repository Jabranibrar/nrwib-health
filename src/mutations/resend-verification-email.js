import { gql } from "@apollo/client";

export const RESEND_VERIFICATION_EMAIL = gql`
  mutation RESEND_VERIFICATION_EMAIL($user_id: Int!, $clientMutationId: String) {
    resendVerificationEmail(input: { user_id: $user_id, clientMutationId: $clientMutationId }) {
      clientMutationId
    }
  }
`;
