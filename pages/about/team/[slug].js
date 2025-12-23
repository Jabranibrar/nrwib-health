import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import Layout from '@/src/components/Layout';
import NextImage from '@/src/components/NextImage';
import NextLink from '@/src/components/NextLink';
import client from '@/src/lib/apollo/client';
import { gql } from '@apollo/client';
import { useRouter } from 'next/navigation';
import React from 'react';
import clsx from 'clsx';
import { IMAGE_FRAGMENT } from '@/src/utils/fragments';
import CustomLink from '@/src/components/CustomLink';
import SEO_FRAGMENT from '@/src/queries/seo';
import Seo from '@/src/components/Layout/Seo';
import { getSitewideSettings } from '@/src/utils/getSitewideSettings';
import Icon from '@/src/components/Icon';
import Link from 'next/link';

const TeamMember = (props) => {
  const { member, members, seo } = props;

  const router = useRouter();

  const currentIndex = members.findIndex((m) => m.slug === member.slug);

  let previousItem = {};

  if (currentIndex === 0) {
    previousItem = members[members.length - 1];
  } else {
    previousItem = members[currentIndex - 1];
  }

  let nextItem = {};

  if (currentIndex === members.length - 1) {
    nextItem = members[0];
  } else {
    nextItem = members[currentIndex + 1];
  }

  const onPrev = () => {
    router.push(`/about/team/${previousItem.slug}`);
  };

  const onNext = () => {
    router.push(`/about/team/${nextItem.slug}`);
  };

  const uri = router.asPath?.slice(-1) === '/' ? router.asPath : router.pathname + '/';

  const onClose = () => {
    if (document.referrer) {
      if (new URL(document.referrer).pathname.includes('action-teams')) {
        window.close();
        return;
      }
    }

    router.push(`/about/leadership/`);
  };

  return (
    <Layout isPopup={true} onClose={onClose} {...props}>
      {Object.keys(seo || {})?.length > 0 && <Seo seo={seo} uri={uri} />}

      <main className={"relative"}>
        <div className="bg-brand-blue lg:h-[300px] relative">
          <div className="container relative z-10">
            <div className="flex flex-row-reverse md:flex-row flex-wrap-reverse items-center justify-between relative">
              <div className="flex items-center mt-20 lg:mt-0">
                <div className="space-y-4 lg:py-20">
                  <Heading
                    type="h2"
                    otherClasses="font-manrope font-semibold text-brand-royal-blue text-h2 lg:text-h1"
                  >
                    {member.title}
                  </Heading>
                  <div className="text-h3 text-brand-neutral-2 font-manrope font-normal !mb-2">
                    {member.teamMemberFieldGroup.designation}
                  </div>
                  <Link
                    href={member.teamMemberFieldGroup?.industryPartner?.nodes[0]?.memberFieldGroup?.websiteUrl ?? '#'}
                    className="text-h4 text-brand-neutral-2 font-manrope font-normal"
                  >
                    {
                      member.teamMemberFieldGroup?.industryPartner?.nodes[0]?.memberFieldGroup
                        ?.organizationName
                    }
                  </Link>
                  <div className="lg:w-[500px] h-[1px] bg-white lg:!block hidden"></div>
                  <div>
                    <NextLink
                      href={`mailto:${member.teamMemberFieldGroup.email}`}
                      otherClasses="text-p1 font-medium text-white font-manrope underline"
                    >
                      {member.teamMemberFieldGroup.email}
                    </NextLink>
                  </div>

                  <div className="h-[2px] bg-brand-blue w-full"></div>
                </div>
              </div>
              <div className="lg:absolute mt-10 md:mt-0 m-auto md:mr-auto h-[400px] w-auto md:w-[200px] md:h-[200px] lg:h-[350px] lg:w-[350px] right-0 top-0 bg-brand-neutral-2">
                {member.featuredImage?.node ? (
                  <NextImage
                    {...member.featuredImage.node}
                    otherClasses="h-full w-full object-cover object-center"
                  />
                ) : (
                  <NextImage
                    url={
                      'https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/eIOE_1.svg'
                    }
                    width={1000}
                    height={1000}
                    otherClasses="w-full h-full w-[30rem] object-contain object-bottom px-10"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="relative w-full md:w-auto md:absolute bottom-0 left-0">
            <NextImage
              url="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Vector.svg"
              height={80}
              width={80}
              otherClasses=""
            />
          </div>
          <div className="h-full hidden md:!block bg-brand-green absolute top-0 right-0 lg:pl-[calc(50vw-600px)] z-0"></div>
        </div>
        <div className="container">
          <div className="mx-auto lg:w-[80%] my-5 lg:mt-28">
            <div className="popup-navigation md:!block lg:!block absolute w-full left-0">
              {previousItem && (
                <div
                  onClick={onPrev}
                  className="pt-4 cursor-pointer min-h-[100px] border-r text-right px-4 transition-all border-brand-blue min-w-[100px] font-semibold absolute left-0 z-[0] top-[4%] group"
                >
                  <div className="flex items-center mb-2">
                    <Icon
                      icon="chevron-right"
                      otherClasses="rotate-[-180deg]"
                      iconWidth={20}
                      iconHeight={20}
                    />
                    <div className="text-p2 text-brand-blue-sky font-semibold">Previous</div>
                  </div>
                  <div className="text-brand-dark-gray font-normal ">{previousItem?.title}</div>
                </div>
              )}

              {nextItem && (
                <div
                  onClick={onNext}
                  className="pt-4 cursor-pointer min-h-[100px] border-l text-right px-4 transition-all border-brand-blue min-w-[100px] font-semibold absolute right-0 z-[0] top-[4%] group"
                >
                  <div className="flex items-center mb-2">
                    <div className="text-p2 text-brand-blue-sky font-semibold">Next</div>
                    <Icon icon="chevron-right" iconWidth={20} iconHeight={20} />
                  </div>
                  <div className="text-brand-dark-gray font-normal ">{nextItem?.title}</div>
                </div>
              )}
            </div>
            <HtmlBlock
              className={clsx('text-p2 font-normal font-manrope')}
              content={member.content}
            />
            <CustomLink
              anchor={{
                title: 'Browse All Staff',
                url: '/about/meet-the-team'
              }}
              variant="16"
              otherClasses="m-auto mt-28"
            />
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default TeamMember;

export async function getStaticPaths() {
  const { data } = await client.query({
    query: gql`
      query AllTeamMembersQuery {
        teamMembers(first: 1000) {
          nodes {
            slug
          }
        }
      }
    `,
    fetchPolicy: 'no-cache'
  });

  const paths = [...data.teamMembers.nodes].map((member) => {
    return {
      params: {
        slug: member.slug
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
      query getTeamMemberById($slug: ID!) {
        teamMembers(where: { orderby: { field: MENU_ORDER, order: ASC } }) {
          nodes {
            title
            slug
          }
        }

        teamMember(idType: SLUG, id: $slug) {
          title
          content
          slug
          teamMemberFieldGroup {
            designation
            email
            hideBio
            industryPartner {
              nodes {
                ... on Member {
                  id
                  memberFieldGroup {
                    organizationName
                    websiteUrl
                  }
                }
              }
            }
          }

          seo {
            ...SeoFragment
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
  const member = data.teamMember;

  const defaultProps = {
    props: {
      seo: member.seo || null,
      member: member || {},
      members: data?.teamMembers?.nodes || [],
      isPopup: true,
      data: siteData?.sitewideSettings || {},
      navbar: siteData || {}
    },
    revalidate: 10
  };

  return defaultProps;
}
