import { gql } from "@apollo/client";

export const RESET_USER_PASSWORD = gql`
  mutation RESET_USER_PASSWORD(
		$key: String!
		$login: String!
		$password: String!
	) {
		resetUserPassword(
			input: { key: $key, login: $login, password: $password }
		) {
			clientMutationId
		}
	}
`;
