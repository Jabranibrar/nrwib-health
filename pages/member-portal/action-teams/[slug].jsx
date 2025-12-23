import Seo from '@/src/components/Layout/Seo';
import Layout from "@/src/components/Layout";
import client from '@/src/lib/apollo/client';
import { gql } from '@apollo/client';
import { getSitewideSettings } from '@/src/utils/getSitewideSettings';
import ActionGroupsContent from '@/src/sections/ActionGroupsContent';
import axios from 'axios';
import { IMAGE_FRAGMENT } from '@/src/utils/helpers.fragment';
import { useRouter } from 'next/router';
import { PageWrapper } from '@/context/page';

const ActionGroups = (props) => {
  const { seo, uri } = props;
  const router = useRouter();
  return (
    <PageWrapper>
      {Object.keys(seo || {})?.length > 0 && <Seo seo={seo} uri={uri} />}
      <Layout isMemberPortal={true} onClose={() => router.push('/member-portal')} {...props}>
        <ActionGroupsContent data={props}/>
      </Layout>
    </PageWrapper>
  );
};

export default ActionGroups;

export async function getStaticProps(context) {
  const id = context.params.slug;
  const slug = id;
  const siteData = await getSitewideSettings();
  const { data, errors } = await client.query({
    query: gql`
        ${IMAGE_FRAGMENT}
        query getDepartmentById($id: ID = "", $slug: [String] = []) {
            teamMembers(
              where: {taxQuery: {taxArray: {terms: $slug, taxonomy: DEPARTMENT, field: SLUG, operator: IN}}}
              first: 20
            ) {
              nodes {
                  id
                  title(format: RENDERED)
                  slug
                  teamMemberFieldGroup {
                    designation
                    email
                    hideBio
                  }
                  featuredImage {
                    node {
                      mediaItemUrl
                      mediaDetails {
                        width
                        height
                      }
                    }
                  }
                }
            }
            successStories(
              where: {taxQuery: {taxArray: {terms: $slug, taxonomy: DEPARTMENT, field: SLUG, operator: IN}}}
              first: 20
            ) {
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
            events(
              where: {taxQuery: {taxArray: {terms: $slug, taxonomy: DEPARTMENT, field: SLUG, operator: IN}}}
              first: 20
            ) {
              edges {
                node {
                  title
                  slug
                  eventOptions {
                    eventDate
                    eventImage {
                        node {
                          mediaItemUrl
                        }
                      }
                    eventStartTime
                    eventEndTime
                    eventLocation
                    eventType
                  }
                }
              }
            }
            news(
              where: {taxQuery: {taxArray: {terms: $slug, taxonomy: DEPARTMENT, field: SLUG, operator: IN}}}
              first: 20
            ) {
              edges {
                   node {
                    id
                    title
                    date
                    content
                    slug
                    featuredImage {
                        node {
                          ...CustomImage
                        }
                    }
                    newsAdditionalInformation {
                      pdf {
                        node {
                          mediaItemUrl
                          sourceUrl(size: LARGE)
                        }
                      }
                    }
                 }
              }
            }
            allResources(
              where: {taxQuery: {taxArray: {terms: $slug, taxonomy: DEPARTMENT, field: SLUG, operator: IN}}}
              first: 20
            ) {
              nodes {
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
            departments(where: { order: ASC, orderby: TERM_ORDER, hideEmpty: true }) {
              nodes {
                id
                name
                slug
                description
                actionGroups {
                  hideFromFrontend
                }
              }
            }
            department(id: $id, idType: SLUG) {
              databaseId
              name
              seo {
                breadcrumbs {
                  text
                  url
                }
                title
                metaDesc
                metaRobotsNoindex
                metaRobotsNofollow
                opengraphAuthor
                opengraphDescription
                opengraphTitle
                opengraphImage {
                  sourceUrl
                }
                opengraphSiteName
                opengraphPublishedTime
                opengraphModifiedTime
                twitterTitle
                twitterDescription
                twitterImage {
                  sourceUrl
                }
              }
              slug
              description
              actionGroups {
                hideFromFrontend
                image {
                  node {
                    url:mediaItemUrl
                    mediaDetails {
                      height
                      width
                    }
                  }
                }
                button {
                 target
                 title
                 url
                }
                overview {
                  description
                  title
                  link {
                    target
                    title
                    url
                  }
                  image {
                    node {
                      mediaItemUrl
                      mediaDetails {
                        height
                        width
                      }
                    }
                  }
                }
                outcomes {
                  heading
                  getOutcomes {
                    number
                    text
                  }
                }
              }
              
          }
        }
    `,
    variables: {
      id,
      slug
    },
    fetchPolicy: 'no-cache'
  });

  if (errors) throw JSON.stringify(errors, null, 2);
  const departmentPost = data.department;
  const {databaseId} = departmentPost;
  let footerCTA;
  if (databaseId) {
    const postURL = `${process.env.MEMBER_PORTAL_FOOTER_CTA_DATA_URL}${databaseId}`;
    try {
      const response = await axios.get(postURL);
      footerCTA = response.data;
    } catch (error) {
      console.error("Error fetching the post data:", error.message);
    }
  }

  const defaultProps = {
    props: {
      seo: departmentPost?.seo || null,
      post: departmentPost || {},
      members: data?.teamMembers || [],
      events: data?.events || [],
      news: data?.news || [],
      departments: data?.departments || [],
      resources: data?.allResources || [],
      successStories: data?.successStories || [],
      footer: footerCTA || [],
      isPopup: true,
      uri: `/member-portal/action-group/${id}`,  // Corrected the template literal
      data: siteData?.sitewideSettings || {},
      navbar: siteData || {}
    },
    revalidate: false
  };

  return defaultProps;
}

export async function getStaticPaths() {
  const { data } = await client.query({
    query: gql`
      query GET_ALL_DEPARTMENTS {
        departments(where: { order: ASC, orderby: TERM_ORDER, hideEmpty: true }) {
          nodes {
            slug
          }
        }
      }
    `,
    fetchPolicy: 'no-cache'
  });

  const paths = [...data.departments.nodes].map((department) => {
    return {
      params: {
        slug: department.slug
      }
    };
  });

  return {
    paths,
    fallback: 'blocking' // or fallback: 'blocking' for incremental static regeneration
  };
}
