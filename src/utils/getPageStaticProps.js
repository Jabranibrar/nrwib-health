import { gql } from '@apollo/client';
import { cleanAndTransformBlocks } from './cleanAndTransformBlocks';
import client from '@/src/lib/apollo/client';
import { getServerStateResponse } from './getServerResponse';
import { addCustomDataToBlocks } from './addCustomDataToBlocks';
import { IMAGE_FRAGMENT } from './fragments';
import SEO_FRAGMENT from '../queries/seo';
import { getSitewideSettings } from './getSitewideSettings';
import { GET_ALL_OVERLAYS } from '../queries/overlay-query/get-all-overlays';
import dayjs from 'dayjs';

export const getPageStaticProps = async (context) => {
  const uri = context.params?.uri ? `/${context.params?.uri.join('/')}/` : '/';

  const { data } = await client.query({
    query: gql`
      ${IMAGE_FRAGMENT}
      ${SEO_FRAGMENT}
      query PageQuery($uri: String!) {
        nodeByUri(uri: $uri) {
          ... on Page {
            id
            title
            blocks(postTemplate: false)
            featuredImage {
              node {
                ...CustomImage
              }
            }
            seo {
              ...SeoFragment
            }
          }
          ... on Post {
            id
            title
            blocks(postTemplate: false)
            featuredImage {
              node {
                ...CustomImage
              }
            }
            seo {
              ...SeoFragment
            }
          }
        }
      }
    `,
    variables: {
      uri
    },
    fetchPolicy: 'no-cache'
  });

  if (!data || !data.nodeByUri) return { notFound: true, props: {} };

  const overlaysQuery = await client.query({
    query: GET_ALL_OVERLAYS,
    variables: {
      campaignDate: dayjs().format('YYYYMMDD')
    }
  });

  let blocks = data.nodeByUri.blocks ?? [];
  const siteData = await getSitewideSettings();
  blocks = cleanAndTransformBlocks(blocks);
  blocks = await addCustomDataToBlocks(blocks);
  blocks = await getServerStateResponse(blocks);

  return {
    props: {
      seo: data.nodeByUri.seo || null,
      title: data.nodeByUri.title || '',
      data: siteData?.sitewideSettings || {},
      navbar: siteData || {},
      featuredImage: data.nodeByUri.featuredImage?.node?.sourceUrl || null,
      blocks,
      slug: uri,
      overlays: overlaysQuery?.data || []
    },
    revalidate: 10
  };
};
