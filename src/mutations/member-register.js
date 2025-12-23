import { gql } from "@apollo/client";

export const MEMBER_REGISTER = gql`
mutation MEMBER_REGISTER($input: RegisterUserInput!) {
  registerUser(input: $input) {
    user {
      databaseId
    }
  }
}
`;
