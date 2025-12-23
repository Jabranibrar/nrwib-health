import { gql } from '@apollo/client';

export const IMAGE_FRAGMENT = gql`
  fragment CustomImage on MediaItem {
    alt: altText
    mediaDetails {
      width
      height
    }
    url: sourceUrl(size: LARGE)
    title
  }
`;
