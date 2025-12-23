import { gql } from "@apollo/client";

export const SEND_PASSWORD_RESET_EMAIL = gql`
  mutation SEND_PASSWORD_RESET_EMAIL($username: String!) {
    sendPasswordResetEmail(input: { username: $username }) {
      clientMutationId
    }
  }
`;
