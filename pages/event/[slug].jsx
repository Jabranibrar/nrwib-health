import Seo from '@/src/components/Layout/Seo';
import { Layout } from '@/src/components/Layout';
import client from '@/src/lib/apollo/client';
import { gql } from '@apollo/client';
import SEO_FRAGMENT from '@/src/queries/seo';
import { getSitewideSettings } from '@/src/utils/getSitewideSettings';
import EventContent from '@/src/sections/EventContent';
import { IMAGE_FRAGMENT } from '@/src/utils/fragments';

const Event = (props) => {
  const { events, eventPost, seo, uri, speakers } = props;
  return (
    <Layout {...props}>
      {Object.keys(seo || {})?.length > 0 && <Seo seo={seo} uri={uri} />}
      <main className="overflow-hidden">
        <EventContent events={events} data={eventPost} speakers={speakers}/>
      </main>
    </Layout>
  );
};

export default Event;

export async function getStaticPaths() {
  const { data } = await client.query({
    query: gql`
      query AllEventsQuery {
        events(first: 1000) {
          nodes {
            slug
          }
        }
      }
    `,
    fetchPolicy: 'no-cache'
  });

  const paths = [...data.events.nodes].map((event) => {
    return {
      params: {
        slug: event.slug
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
      ${IMAGE_FRAGMENT}
      query getEventById($slug: String!) {
        speakers {
          edges {
            node {
              title
              content(format: RENDERED)
              aboutSpeaker {
                designation
                associatedEvent {
                nodes {
                  ... on Event {
                    id
                    slug
                  }
                  }
                }
              }
              featuredImage {
                node {
                  ...CustomImage
                }
              }
              specialties {
                nodes {
                  name
                }
              }
              areas {
                nodes {
                  name
                }
              }
            }
          }
        }
        events {
          nodes {
            title(format: RENDERED)
            uri
            slug
            eventOptions {
              eventDate
              eventEndTime
              eventStartTime
              eventImage {
                node {
                  mediaItemUrl
                }
              }
            }
          }
        }
        eventBy(slug: $slug) {
        title(format: RENDERED)
        uri
        slug
        seo {
            ...SeoFragment
          }
        eventOptions {
          eventDate
          resourcesEventRelationship {
                nodes {
                  ... on Resources {
                    id
                    title(format: RENDERED)
                    uri
                    browseKnowledgeTags {
                      nodes {
                        name
                      }
                    }
                    resourcesFieldGroup {
                      url
                      uploadFile {
                        node {
                          mediaItemUrl
                          sourceUrl(size: LARGE)
                        }
                      }
                      resourceType
                      mediaUrl
                      videoDescription
                      videoUrl
                    }
                  }
                }
              }
          eventEndTime
          eventLocation
          eventStartTime
          eventType
          registerNowLink
          overviewTitle
          overviewLink {
            title
            url
            target
          }
          layoutType
          overviewVideo
          faqs {
            text
            title
          }
          agenda {
            text
            time
            title
          }
          eventImage {
            node {
              mediaItemUrl
            }
          }
          overviewImage {
            node {
              mediaItemUrl
            }
          }
          overviewDescription
          registerNowDescription
          registerNowImage {
            node {
              mediaItemUrl
            }
          }
          registerNowTitle
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
  const eventPost = data.eventBy;

  const defaultProps = {
    props: {
      seo: eventPost?.seo || null,
      events: data?.events,
      speakers: data?.speakers,
      eventPost: eventPost || {},
      isPopup: false,
      uri: `/event/${slug}`,  // Corrected the template literal
      data: siteData?.sitewideSettings || {},
      navbar: siteData || {}
    },
    revalidate: false
  };

  return defaultProps;
}
