import { gql } from '@apollo/client';
export const ALL_PAGES_NODE_URI_QUERY = gql`
  query AllPagesQuery {
    pages(first: 10000) {
      nodes {
        uri
      }
    }
  }
`;
