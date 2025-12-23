import { gql } from '@apollo/client';

export const allEvents = gql`
  query allEvents {
    events {
      edges {
        node {
          title
          slug
          eventOptions {
            eventDate
            eventImage {
                node {
                  mediaItemUrl
                }
              }
            eventStartTime
            eventEndTime
            eventLocation
            eventType
          }
        }
      }
    }
  }
`;
