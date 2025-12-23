import Layout from "@/src/components/Layout";
import { getSitewideSettings } from '@/src/utils/getSitewideSettings';
import { useRouter } from 'next/router';
import Seo from '@/src/components/Layout/Seo';
import { PageWrapper } from '@/context/page';
import client from '@/src/lib/apollo/client';
import { gql } from '@apollo/client';
import { IMAGE_FRAGMENT } from '@/src/utils/fragments';
import SEO_FRAGMENT from '@/src/queries/seo';
import { cleanAndTransformBlocks } from '@/src/utils/cleanAndTransformBlocks';
import { addCustomDataToBlocks } from '@/src/utils/addCustomDataToBlocks';
import { getServerStateResponse } from '@/src/utils/getServerResponse';
import { BlockRenderer } from '@/src/components/BlockRenderer';
import AuthContent from '@/src/components/AuthContent';

export default function MemberPortal(props) {
  const { seo } = props;
  const router = useRouter();
  const uri = router.asPath?.slice(-1) === '/' ? router.asPath : router.pathname + '/';
  return (
    <PageWrapper>
      {Object.keys(seo || {})?.length > 0 && <Seo seo={seo} uri={uri} />}
      <Layout
        isMemberPortal={true}
        isPopup={true}
        onClose={() => router.push('/member-portal')}
        {...props}
      >
        <AuthContent>
          <BlockRenderer blocks={props.blocks} />
        </AuthContent>
      </Layout>
    </PageWrapper>
  );
}

export async function getStaticProps() {
  const uri = '/member-portal/action-teams/';
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
    },
    revalidate: false
  };
}
