import { gql } from '@apollo/client';

export const allSpeakersList = gql`
  query allSpeakers {
    speakers {
      nodes {
        title
        slug
      }
    }
  }
`;
