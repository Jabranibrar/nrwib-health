import { gql } from "@apollo/client";

export const GET_ALL_OVERLAYS = gql`
  query GET_ALL_OVERLAYS($campaignDate: String) {
    overlays(first: 6, where: {campaignDate: $campaignDate}) {
      edges {
        node {
          slug
          title(format: RENDERED)
          content(format: RENDERED)
          featuredImage {
            node {
              altText
              title(format: RENDERED)
              sourceUrl
              mediaDetails {
                width
                height
              }
            }
          }
          overlayFields {
            callToActionLabel
            announcementBarStyle
            callToActionUrl
            overlayType
            endDate
            startDate
            popUpTiming
            popUpLocation {
                edges {
                  node {
                    ... on Page {
                      id
                      slug
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
