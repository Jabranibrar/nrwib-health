import { gql } from '@apollo/client';
export const ALL_MEMBERS = gql`
  query AllMembers {
    members(first: 1000000) {
      edges {
        node {
          memberFieldGroup {
            linkToJobBoard {
              target
              url
              title
            }
            organizationName
            organizationLogo {
              cursor
              node {
                altText
                sourceUrl
                title
              }
            }
            websiteUrl
          }
          title
          content
          departments {
            edges {
              node {
                name
              }
            }
          }
        }
      }
    }
  }
`;
