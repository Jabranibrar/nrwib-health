import { BlockRenderer } from '@/src/components/BlockRenderer';
import { PageWrapper } from '@/context/page';
import Layout from '../Layout';

import { useRouter } from 'next/router';
import Seo from '../Layout/Seo';

const Page = (props) => {
  const { seo } = props;

  const router = useRouter();
  const uri = router.asPath?.slice(-1) === '/' ? router.asPath : router.pathname + '/';
  // Check if the URI contains 'member-portal'
  const isMemberPortal = uri.includes('member-portal');
  return (
    <PageWrapper>
      {Object.keys(seo || {})?.length > 0 && <Seo seo={seo} uri={uri} />}
      {props?.slug === '/search/' ? (
        <Layout onClose={() => router.push('/')} isPopup {...props}>
          <BlockRenderer blocks={props.blocks} />
        </Layout>
      ) : isMemberPortal ? (
        <Layout
          isMemberPortal={true}
          isPopup={true}
          onClose={() => router.push('/member-portal')}
          {...props}
        >
          <BlockRenderer blocks={props.blocks} />
        </Layout>
      ) : (
        <Layout {...props}>
          <BlockRenderer blocks={props.blocks} />
        </Layout>
      )}
    </PageWrapper>
  );
};

export default Page;
