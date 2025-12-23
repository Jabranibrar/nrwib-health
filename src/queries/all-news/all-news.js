import { gql } from '@apollo/client';
import { IMAGE_FRAGMENT } from '@/src/utils/helpers.fragment';

export const allNews = gql`
  ${IMAGE_FRAGMENT}
  query allNews {
    news {
      edges {
        node {
          title
          date
          content
          slug
          newsAdditionalInformation {
            pdf {
              node {
                mediaItemUrl
              }
            }
          }
          featuredImage {
            node {
              ...CustomImage
            }
          }
        }
      }
    }
  }
`;
