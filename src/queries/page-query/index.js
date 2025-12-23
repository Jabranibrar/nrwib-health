import { gql } from '@apollo/client';
import SEO_FRAGMENT from '../seo';
import { IMAGE_FRAGMENT } from '../../utils/helpers.fragment';

export const PAGE_QUERY = gql`
  ${SEO_FRAGMENT}
  ${IMAGE_FRAGMENT}
  query PageQuery($uri: String!) {
    nodeByUri(uri: $uri) {
      ... on Page {
        id
        title
        blocks(postTemplate: false)
        seo {
          ...SeoFragment
        }
        parent {
          node {
            uri
            ... on Page {
              id
              children(where: { orderby: { field: MENU_ORDER, order: ASC } }) {
                nodes {
                  id
                  uri
                  ... on Page {
                    id
                    title
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
