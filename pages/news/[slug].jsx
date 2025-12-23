import Heading from '@/src/components/Heading';
import Layout from '@/src/components/Layout';
import NextImage from '@/src/components/NextImage';
import client from '@/src/lib/apollo/client';
import { gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { IMAGE_FRAGMENT } from '@/src/utils/fragments';
import CustomLink from '@/src/components/CustomLink';
import SEO_FRAGMENT from '@/src/queries/seo';
import Seo from '@/src/components/Layout/Seo';
import dayjs from 'dayjs';
import { getSitewideSettings } from '@/src/utils/getSitewideSettings';
import { cleanAndTransformBlocks } from '@/src/utils/cleanAndTransformBlocks';
import { BlockRenderer } from '@/src/components/BlockRenderer';
import ReactPlayer from 'react-player';

const News = (props) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const { newsPost, news, seo } = props;
  const { newsAdditionalInformation } = newsPost;
  const videoUrl = newsAdditionalInformation?.videoUrl;

  const router = useRouter();

  const currentIndex = news.findIndex((m) => m.slug === newsPost.slug);

  let previousItem = {};

  if (currentIndex === 0) {
    previousItem = news[news.length - 1];
  } else {
    previousItem = news[currentIndex - 1];
  }

  let nextItem = {};

  if (currentIndex === news.length - 1) {
    nextItem = news[0];
  } else {
    nextItem = news[currentIndex + 1];
  }

  const onPrev = () => {
    router.push(`/news/${previousItem.slug}`);
  };

  const onNext = () => {
    router.push(`/news/${nextItem.slug}`);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const uri = router.asPath?.slice(-1) === '/' ? router.asPath : router.pathname + '/';

  const onClose = () => {
    if (document.referrer) {
      if (new URL(document.referrer).pathname.includes('knowledge')) {
        window.close();
        return;
      }
    }

    router.push(`/news#${newsPost.id}`);
  };

  return (
    <Layout isPopup={true} onClose={onClose} {...props}>
      {Object.keys(seo || {})?.length > 0 && <Seo seo={seo} uri={uri} />}

      <main className="overflow-hidden">
        <div className="bg-brand-blue h-auto lg:h-[300px] relative">
          <div className="container relative z-10">
            <div className="flex flex-wrap md:flex-nowrap pt-10 gap-10 relative z-[2]">
              <div className="relative w-auto lg:w-auto md:h-[320px]">
                <div className="hidden md:!flex z-[1] px-10 absolute items-center text-white text-p2 font-normal bottom-[-50px] lg:bottom-[30px] left-[100%] h-16 bg-brand-teal md:w-screen">
                  {dayjs(newsPost.date).format('MMMM DD, YYYY')}
                </div>
                {newsPost.featuredImage?.node ? (
                  <NextImage
                    {...newsPost.featuredImage.node}
                    otherClasses="h-full w-full object-cover object-center"
                  />
                ) : (
                  <NextImage
                    url={
                      'https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/eIOE_1.svg'
                    }
                    width={1000}
                    height={1000}
                    otherClasses="w-full h-full object-contain object-top px-10"
                  />
                )}
              </div>
              <div className="flex items-start w-full lg:w-[70%] lg:mt-0 relative">
                <Heading
                  type="h2"
                  otherClasses="font-manrope font-medium text-white text-h2 lg:pr-20 pb-10 lg:pt-0"
                >
                  {newsPost.title}
                </Heading>
              </div>
            </div>
          </div>
        </div>
        <div className="px-10 flex md:hidden items-center text-white text-p2 font-medium h-16 bg-brand-teal lg:w-screen">
          {dayjs(newsPost.date).format('MMMM DD, YYYY')}
        </div>
        <div className="container my-5 md:mt-[6.875rem]">
          {videoUrl && (
            <div className="h-full w-full">
              <ReactPlayer
                playing={isPlaying}
                url={videoUrl}
                controls
                width="100%"
                height="100%"
                className="w-full object-cover !h-[30rem]"
                onPause={handlePause}
                onPlay={handlePlay}
              />
            </div>
          )}
          <BlockRenderer blocks={props.blocks} />

          <CustomLink
            anchor={{
              title: 'Browse All News',
              url: '/news'
            }}
            variant="16"
            otherClasses="m-auto mt-10"
          />
        </div>
      </main>
    </Layout>
  );
};

export default News;

export async function getStaticPaths() {
  const { data } = await client.query({
    query: gql`
      query AllNewsQuery {
        news(first: 1000) {
          nodes {
            slug
          }
        }
      }
    `,
    fetchPolicy: 'no-cache'
  });

  const paths = [...data.news.nodes].map((newsPost) => {
    return {
      params: {
        slug: newsPost.slug
      }
    };
  });

  return {
    paths,
    fallback: 'blocking' // or fallback: 'blocking' for incremental static regeneration
  };
}

export async function getStaticProps(context) {
  const slug = context.params.slug;
  const siteData = await getSitewideSettings();
  const { data, errors } = await client.query({
    query: gql`
      ${IMAGE_FRAGMENT}
      ${SEO_FRAGMENT}
      query getNewsById($slug: ID!) {
        news(where: { orderby: { field: MENU_ORDER, order: ASC } }) {
          nodes {
            title
            slug
          }
        }

        newsPost(idType: SLUG, id: $slug) {
          id: databaseId
          title
          content
          blocks(postTemplate: false)
          slug
          date
          seo {
            ...SeoFragment
          }
          newsAdditionalInformation {
            videoUrl
          }
          featuredImage {
            node {
              ...CustomImage
            }
          }
        }
      }
    `,
    variables: {
      slug
    },
    fetchPolicy: 'no-cache'
  });

  if (errors) throw JSON.stringify(errors, null, 2);
  const newsPost = data.newsPost;

  let blocks = newsPost?.blocks ?? [];
  blocks = cleanAndTransformBlocks(blocks);

  const defaultProps = {
    props: {
      seo: newsPost?.seo || null,
      blocks,
      newsPost: newsPost || {},
      news: data?.news?.nodes || [],
      isPopup: true,
      data: siteData?.sitewideSettings || {},
      navbar: siteData || {}
    },
    revalidate: 10
  };

  return defaultProps;
}
