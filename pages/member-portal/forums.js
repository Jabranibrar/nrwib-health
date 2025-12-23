import Layout from "@/src/components/Layout";
import { getSitewideSettings } from '@/src/utils/getSitewideSettings';
import { useRouter } from 'next/router';
import Seo from '@/src/components/Layout/Seo';
import { PageWrapper } from '@/context/page';
import client from '@/src/lib/apollo/client';
import { gql } from '@apollo/client';
import SEO_FRAGMENT from '@/src/queries/seo';
import AuthContent from '@/src/components/AuthContent';
import MemberAccountsNav from '@/src/sections/MemberAccountsNav';
import MemberPortalForum from '@/src/sections/MemberPortalForum';

export default function MemberPortalForums(props) {
  const { seo } = props;
  const router = useRouter();
  const uri = router.asPath?.slice(-1) === '/' ? router.asPath : router.pathname + '/';
  return (
    <PageWrapper>
      {Object.keys(seo || {})?.length > 0 && <Seo seo={seo} uri={uri} />}
      <Layout isMemberPortal={true} isPopup={true} onClose={() => router.push('/member-portal')} {...props}>
        <AuthContent>
          <MemberAccountsNav block={{attributes:props?.departments}}/>
          <MemberPortalForum />
        </AuthContent>
      </Layout>
    </PageWrapper>
  );
}

export async function getStaticProps() {
  const uri = '/forums/';
  const { data } = await client.query({
    query: gql`
      ${SEO_FRAGMENT}
      query PageQuery {
        pageBy(pageId: 5870) {
          ... on Page {
            id
            title
            seo {
              ...SeoFragment
            }
          }
        }
        departments {
          nodes {
            name
            slug
            actionGroups {
              hideFromFrontend
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
  const siteData = await getSitewideSettings();
  return {
    props: {
      seo: data?.pageBy?.seo || null,
      title: data?.pageBy?.title || '',
      data: siteData?.sitewideSettings || {},
      navbar: siteData || {},
      featuredImage: data?.pageBy?.featuredImage?.node?.sourceUrl || null,
      departments: data?.departments?.nodes || '',
    },
    revalidate: false
  };
}
