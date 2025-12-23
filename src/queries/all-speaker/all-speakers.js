import { gql } from '@apollo/client';
import { IMAGE_FRAGMENT } from '@/src/utils/helpers.fragment';

export const AllSpeakers = gql`
  ${IMAGE_FRAGMENT}
  query AllSpeakers($ids: [ID!]) {
    speakers(where: { in: $ids, orderby: { field: TITLE, order: ASC } }) {
      edges {
        node {
          title
          content
          aboutSpeaker {
            designation
            associatedEvent {
            nodes {
              ... on Event {
                id
                slug
              }
              }
            }
          }
          featuredImage {
            node {
              ...CustomImage
            }
          }
          specialties {
            nodes {
              name
            }
          }
          areas {
            nodes {
              name
            }
          }
        }
      }
    }
  }
`;
