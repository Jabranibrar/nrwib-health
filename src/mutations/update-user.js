import { gql } from "@apollo/client";

export const UPDATE_USER = gql`
mutation UPDATE_USER($input: UpdateUserInput!) {
  updateUser(input: $input) {
    user {
      databaseId
    }
  }
}
`;
