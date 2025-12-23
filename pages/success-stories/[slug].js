import Layout from '@/src/components/Layout';
import client from '@/src/lib/apollo/client';
import { gql } from '@apollo/client';
import React, { useState, useRef, useEffect } from 'react';
import { getSitewideSettings } from '@/src/utils/getSitewideSettings';
import { useRouter } from 'next/router';
import { allSuccessStories } from '@/src/queries/all-success-stories/all-success-stories';
import Heading from '@/src/components/Heading';
import NextImage from '@/src/components/NextImage';
import { BlockRenderer } from '@/src/components/BlockRenderer';
import { cleanAndTransformBlocks } from '@/src/utils/cleanAndTransformBlocks';
import Seo from '@/src/components/Layout/Seo';
import SEO_FRAGMENT from '@/src/queries/seo';
import SuccessStoriesSlider from '@/src/sections/SuccessStoriesSlider/SuccessStoriesSlider';

const SingleStory = (props) => {
  const { story, blocks, seo, stories } = props;
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [defaultThumbnail, setDefaultThumbnail] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const typeArray = story.successStoriesGroupField.type;
  const type = typeArray[0];
  const filteredSuccessStories = stories?.filter(story =>
    story?.successStoriesGroupField?.type.some(type => typeArray.includes(type))
  )?.filter(storyInner =>
    storyInner?.slug != story?.slug
  )?.map(story => ({ node: story }));
  const thumbnail = story?.successStoriesGroupField?.videoThumbnail?.node?.mediaItemUrl;
  const images = story?.successStoriesGroupField?.imagesGallery?.edges;
  const router = useRouter();
  const thumbnailsRef = useRef(null);

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
  };

  const scrollThumbnails = (direction) => {
    if (thumbnailsRef.current) {
      thumbnailsRef.current.scrollBy({
        left: direction === 'left' ? -150 : 150,
        behavior: 'smooth'
      });
    }
  };

  const uri = router.asPath?.slice(-1) === '/' ? router.asPath : router.pathname + '/';

  const fetchThumbnail = async () => {
    if (story?.successStoriesGroupField?.video) {
      const videoUrl = story?.successStoriesGroupField?.video?.replace(/<iframe[^>]*src="([^"]*)"[^>]*><\/iframe>/i, '$1');
      const thumb = `https://noembed.com/embed?url=${videoUrl}`;
      try {
        const response = await fetch(thumb);
        const data = await response.json();
        setDefaultThumbnail(data?.thumbnail_url?.replace(/_\d+x\d+/, ''));
      } catch (error) {
        console.error('Error fetching the thumbnail URL:', error);
      }
    }
  };
  if (!thumbnail && story?.successStoriesGroupField?.video) {
    fetchThumbnail();
  }

  return (
    <Layout isPopup={true} onClose={() => router.push('/success-stories')} {...props}>
      {Object.keys(seo || {})?.length > 0 && <Seo seo={seo} uri={uri} />}
      <div className='bg-brand-royal-blue'>
        <div className='container py-10'>
          {type === 'Video' && (
            <>
              {story.title && (
                <Heading
                  type='h2'
                  otherClasses='text-white text-h3 lg:text-h1 font-manrope font-semibold'
                >
                  {story.title}
                </Heading>
              )}

              {!isVideoPlaying && (
                <div className='relative cursor-pointer my-10' onClick={handlePlayVideo}>
                  <NextImage
                    url={thumbnail || defaultThumbnail || '/images/Nrwib-health-video.jpg'}
                    width={1920}
                    height={1080}
                    otherClasses={`w-full ${thumbnail || defaultThumbnail ? 'object-contain object-center' : 'object-cover object-center'}`}
                  />
                  <NextImage
                    url='https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/09/Button_-Play.svg'
                    height={100}
                    width={100}
                    otherClasses='absolute top-[35%] left-[45%] z-10'
                  />
                </div>
              )}

              {isVideoPlaying && (
                <div className='video-embed my-10'>
                  <div
                    className='iframe-container'
                    dangerouslySetInnerHTML={{
                      __html: story.successStoriesGroupField.video
                    }}
                  />
                </div>
              )}
            </>
          )}

          {type === 'Image' && (
            <>
              {story.title && (
                <Heading
                  type='h2'
                  otherClasses='text-white text-h3 lg:text-h1 font-manrope font-semibold'
                >
                  {story.title}
                </Heading>
              )}
              {story.successStoriesGroupField.image && (
                <NextImage
                  url={story?.successStoriesGroupField?.image?.node?.mediaItemUrl}
                  height={2000}
                  width={2000}
                  otherClasses='w-full h-[70vh] object-cover object-center my-10'
                />
              )}
            </>
          )}

          {type === 'Gallery' && images && images.length > 0 && (
            <>
              {story.title && (
                <Heading
                  type='h2'
                  otherClasses='text-white text-h3 lg:text-h1 font-manrope font-semibold'
                >
                  {story.title}
                </Heading>
              )}

              <div className='relative my-10 max-w-full'>
                <NextImage
                  url={images[currentImageIndex].node.mediaItemUrl}
                  alt={story.title || 'Gallery Image'}
                  height={1000}
                  width={2000}
                  otherClasses='w-full h-[45vh] object-cover object-center'
                />
              </div>

              {/* Thumbnail Slider */}
              <div className='relative my-4'>
                {
                  images?.length > 5 ?
                    <>
                      <button
                        className='absolute -left-8 top-1/2 transform -translate-y-1/2 text-white'
                        onClick={() => scrollThumbnails('left')}
                      >
                        <NextImage
                          url='https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/09/Button-Arrow-2.svg'
                          height={50}
                          width={50}
                          otherClasses=''
                        />
                      </button>
                      <button
                        className='absolute -right-8 top-1/2 transform -translate-y-1/2 text-white'
                        onClick={() => scrollThumbnails('right')}
                      >
                        <NextImage
                          url='https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/09/Button-Arrow-1-1.svg'
                          height={50}
                          width={50}
                          otherClasses=''
                        />
                      </button>
                    </>
                    : null
                }

                <div
                  ref={thumbnailsRef}
                  className='flex overflow-x-auto gap-4 pb-4'
                  style={{
                    scrollSnapType: 'x mandatory',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }}
                >
                  {images?.map((image, index) => (
                    <div
                      key={index}
                      className={`flex-shrink-0 cursor-pointer ${index === currentImageIndex ? 'border-2 border-white' : ''}`}
                      style={{ scrollSnapAlign: 'center' }}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      <NextImage
                        url={image.node.mediaItemUrl}
                        alt={`Thumbnail ${index + 1}`}
                        height={150}
                        width={150}
                        otherClasses='w-full h-[150px] object-cover'
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <BlockRenderer className='dark-block-renderer' blocks={blocks} />
        </div>
      </div>
      {
        filteredSuccessStories?.length > 0 &&
        <div className={"bg-white py-12"}>
          <SuccessStoriesSlider
            heading={"Related Stories"}
            bgColor={"bg-white"}
            success_stories_slider={filteredSuccessStories}
            button_anchor = {{
            url: "/success-stories/",
            title: "Browse All Success Stories",
            }}
            hideFilter={true}
            button_variant = {105}
          />
        </div>
      }
    </Layout>
  );
};

export default SingleStory;

export async function getStaticPaths() {
  const { data } = await client.query({
    query: allSuccessStories,
    fetchPolicy: 'no-cache'
  });

  const paths = [...data.successStories.edges].map((story) => {
    return {
      params: {
        slug: story.node.slug
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
        ${SEO_FRAGMENT}
        query getSuccessStoriesById($slug: ID!) {
            successStories(where: { orderby: { field: MENU_ORDER, order: ASC } }) {
                nodes {
                    title
                    slug
                    excerpt
                    successStoriesGroupField {
                        type
                        video
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

            successStory(idType: SLUG, id: $slug) {
                title
                slug
                excerpt
                seo {
                    ...SeoFragment
                }
                blocks(postTemplate: false)
                successStoriesGroupField {
                    type
                    video
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
    `,
    variables: {
      slug
    },
    fetchPolicy: 'no-cache'
  });

  if (errors) throw JSON.stringify(errors, null, 2);
  const successStory = data.successStory;

  let blocks = successStory?.blocks ?? [];
  blocks = cleanAndTransformBlocks(blocks);

  const defaultProps = {
    props: {
      seo: successStory?.seo || null,
      story: successStory || {},
      blocks,
      stories: data?.successStories?.nodes || [],
      isPopup: true,
      data: siteData?.sitewideSettings || {},
      navbar: siteData || {}
    },
    revalidate: 10
  };

  return defaultProps;
}
