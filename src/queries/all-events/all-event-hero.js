import { gql } from '@apollo/client';

export const allEventsHero = gql`
  query allEventsHero($ids: [ID!]) {
    events(where: { in: $ids }, , first: 1) {
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
