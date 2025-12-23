import { gql } from '@apollo/client';

export const allPastEvents = gql`
  query allPastEvents($ids: [ID!]) {
    events(where: { in: $ids }) {
      edges {
        node {
          title
          eventOptions {
            eventDate
            eventStartTime
            eventEndTime
            eventLocation
            eventType
            eventImage {
                node {
                  mediaItemUrl
                }
              }
          }
        }
      }
    }
  }
`;
