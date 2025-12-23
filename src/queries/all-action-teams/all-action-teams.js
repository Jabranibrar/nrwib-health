import { gql } from '@apollo/client';

export const allActionTeam = gql`
  query allActionTeam {
    departments {
      nodes {
        name
        slug
        actionGroups {
          hideFromFrontend
        }
      }
    }
  }
`;
