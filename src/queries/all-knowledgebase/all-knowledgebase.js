import { gql } from '@apollo/client';

export const ALL_KNOWLEDGEBASE = gql`
  query AllKnowledgeBase {
    news(
      where: {
        taxQuery: {
          taxArray: [
            { terms: ["for-educators"], taxonomy: BROWSEKNOWLEDGETAG, operator: IN, field: SLUG }
          ]
        }
      }
    ) {
      nodes {
        title
        slug
        content
        date
        newsAdditionalInformation {
          videoUrl
          pdf {
            node {
              uri
              title
            }
          }
        }
        featuredImage {
          node {
            mediaItemUrl
          }
        }
      }
    }
    topics(where: { hideEmpty: true, parent: 0 }, first: 1000) {
      nodes {
        name
        slug
        description
        children(first: 1000, where: { hideEmpty: true, childless: false }) {
          nodes {
            name
            resources(
              first: 1000
              where: {
                taxQuery: {
                  taxArray: [
                    {
                      terms: ["for-educators"]
                      taxonomy: BROWSEKNOWLEDGETAG
                      operator: IN
                      field: SLUG
                    }
                  ]
                }
              }
            ) {
              nodes {
                title
                resourcesFieldGroup {
                  url
                  uploadFile {
                    node {
                      id
                    }
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
