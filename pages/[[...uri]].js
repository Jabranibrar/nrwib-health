import { gql } from '@apollo/client';
import Page from '@/src/components/Page';
import client from '@/src/lib/apollo/client';
import { getPageStaticProps } from '@/src/utils/getPageStaticProps';

export default Page;

export const getStaticProps = getPageStaticProps;

export const getStaticPaths = async () => {
  const { data } = await client.query({
    query: gql`
      query AllPagesQuery {
        pages(first: 1000) {
          nodes {
            uri
          }
        }
      }
    `,
    fetchPolicy: 'no-cache'
  });

  const pages = [...data.pages.nodes]
    .filter(
      (page) =>
        !['/', 'search', 'member-portal',  'member-portal/action-teams', 'logout'].includes(
          page.uri.substring(1, page.uri.length - 1)
        )
    )
    .map((page) => ({
      params: {
        uri: page.uri.substring(1, page.uri.length - 1).split('/')
      }
    }));

  const paths = pages.map((page) => ({
    ...page
  }));

  return {
    paths,
    fallback: 'blocking'
  };
};
