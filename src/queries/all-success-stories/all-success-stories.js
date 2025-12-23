import { gql } from '@apollo/client';

export const allSuccessStories = gql`
  query allSuccessStories {
    successStories {
      nodes {
        title
        slug
        excerpt
      }
      edges {
        node {
          title
          excerpt
          slug
          successStoriesGroupField {
            type
            video
            featured
            videoThumbnail {
              node {
                mediaItemUrl
              }
            }
            image {
              node {
                mediaItemUrl
              }
            }
            imagesGallery {
              edges {
                node {
                  mediaItemUrl
                }
              }
            }
          }
        }
      }
    }
  }
`;
