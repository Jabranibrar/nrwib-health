import React, { useState } from 'react';
import Seo from '@/src/components/Layout/Seo';
import Layout from "@/src/components/Layout";
import client from '@/src/lib/apollo/client';
import { gql } from '@apollo/client';
import { getSitewideSettings } from '@/src/utils/getSitewideSettings';
import { IMAGE_FRAGMENT } from '@/src/utils/helpers.fragment';
import { useRouter } from 'next/router';
import { PageWrapper } from '@/context/page';
import SEO_FRAGMENT from '@/src/queries/seo';
import { cleanAndTransformBlocks } from '@/src/utils/cleanAndTransformBlocks';
import { addCustomDataToBlocks } from '@/src/utils/addCustomDataToBlocks';
import { getServerStateResponse } from '@/src/utils/getServerResponse';
import MemberPortalContent from '@/src/sections/MemberPortalContent';
import { decode } from 'html-entities';
import Image from 'next/image';
import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import Link from 'next/link';
import Icon from '@/src/components/Icon';

// Popup component for viewing announcements
const AnnouncementPopup = ({ announcement, onClose, onPrev, onNext, prevTitle, nextTitle }) => {
  if (!announcement) return null;
  const isoDateString = announcement?.date;
  const dateObject = new Date(isoDateString);
  const formattedDate = dateObject.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
  return (
    <div className={""}>
      <div className="fixed inset-0 z-[8888] bg-brand-blue bg-opacity-75">
      </div>
      <div className={"absolute flex z-[8888] justify-center items-center left-0 right-0 top-24"}>
        <div className="bg-white pt-14 px-16 w-full max-w-5xl relative">
          <button className="absolute top-8 right-8" onClick={onClose}>
            <Image src="/images/close-popup.svg" width={38} height={38} alt="Close" />
          </button>
          <p className={"text-brand-dark-grey text-base font-normal mb-4"}>{formattedDate}</p>
          <Heading type="h2" otherClasses="text-brand-royal-blue font-manrope font-medium pb-10">
            {decode(announcement?.title)}
          </Heading>
          <HtmlBlock
            content={announcement?.announcementFields?.description}
            className="text-brand-black-200 text-p2 font-normal font-manrope mb-9 [&>p>strong]:!text-brand-black"
          />
          {
            announcement?.announcementFields?.link?.url ?
              <Link
                className="!py-3 px-4 !font-medium teal-right-arrow-button block !text-center flex items-center justify-center mb-12"
                target={"_blank"}
                href={announcement?.announcementFields?.link?.url}
              >
                {announcement?.announcementFields?.link?.title}
                <Icon icon="white-chevron" iconHeight={16} iconWidth={16} />
              </Link>
              : null
          }
          <div className="flex justify-between -mx-16">
            <button className="bg-brand-neutral p-8 w-1/2" onClick={onPrev}>
              <div className={"text-brand-blue-sky pl-8"}>
                <span className={"block text-left text-brand-blue-sky font-medium"}>Previous</span>
                <span className={"block text-left text-brand-black-200 text-lg"}>{prevTitle}</span>
              </div>
            </button>
            <button className="bg-brand-neutral-2 p-8 w-1/2" onClick={onNext}>
              <div className={"text-brand-blue-sky pr-8"}>
                <span className={"block text-left text-brand-blue-sky font-medium"}>Next</span>
                <span className={"block text-left text-brand-black-200 text-lg"}>{nextTitle}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AnnouncementLists = (props) => {
  const { seo, uri } = props;
  const router = useRouter();
  const announcements = props?.announcementsData?.announcements?.nodes;
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(announcements.findIndex(announcement => announcement.slug === props?.slug));
  const currentAnnouncement = announcements[currentAnnouncementIndex];

  // Get the titles for previous and next announcements with circular logic
  const prevIndex = (currentAnnouncementIndex - 1 + announcements.length) % announcements.length;
  const nextIndex = (currentAnnouncementIndex + 1) % announcements.length;
  const prevTitle = announcements[prevIndex]?.title;
  const nextTitle = announcements[nextIndex]?.title;

  const scrollToTop = () => {
    const headerOffset = 45; // Offset for any fixed header
    const elementPosition = document.documentElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  };

  // Close popup
  const closePopup = () => {
    router.push('/member-portal/');
  };

  // Circular navigation: Navigate to the next announcement, wrap if at the end
  const nextAnnouncement = () => {
    setCurrentAnnouncementIndex((currentAnnouncementIndex + 1) % announcements.length);
    setTimeout(() => {
      const slug = `/member-portal/announcement/${announcements[(currentAnnouncementIndex + 1) % announcements.length]?.slug}`;
      history.pushState(null, null, slug);
      scrollToTop();
    }, 10);
  };

  // Circular navigation: Navigate to the previous announcement, wrap if at the beginning
  const prevAnnouncement = () => {
    setCurrentAnnouncementIndex(
      (currentAnnouncementIndex - 1 + announcements.length) % announcements.length
    );
    setTimeout(() => {
      const slug = `/member-portal/announcement/${announcements[(currentAnnouncementIndex - 1 + announcements.length) % announcements.length]?.slug}`;
      history.pushState(null, null, slug);
      scrollToTop();
    }, 10);
  };

  return (
    <PageWrapper>
      {Object.keys(seo || {})?.length > 0 && <Seo seo={seo} uri={uri} />}
      <Layout isMemberPortal={true} isPopup={true} onClose={() => router.push('/member-portal')} {...props}>
        <MemberPortalContent blocks={props?.blocks} data={props?.data} />
        <AnnouncementPopup
          announcement={currentAnnouncement}
          onClose={closePopup}
          onPrev={prevAnnouncement}
          onNext={nextAnnouncement}
          prevTitle={decode(prevTitle)} // Pass previous title
          nextTitle={decode(nextTitle)} // Pass next title
        />
      </Layout>
    </PageWrapper>
  );
};

export default AnnouncementLists;

export async function getStaticProps(context) {
  const id = context.params.slug;
  const slug = id;
  const uri = '/member-portal/';
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
        }
      }
    `,
    variables: {
      uri
    },
    fetchPolicy: 'no-cache'
  });
  const { data: announcementsData } = await client.query({
    query: gql`
      query GET_ALL_ANNOUNCEMENTS {
        announcements {
          nodes {
            title(format: RENDERED)
            slug
            date
            announcementFields {
              description
              link {
                target
                title
                url
              }
            }
          }
        }
      }
    `,
    fetchPolicy: 'no-cache'
  });
  let blocks = data.nodeByUri.blocks ?? [];
  const siteData = await getSitewideSettings();
  blocks = cleanAndTransformBlocks(blocks);
  blocks = await addCustomDataToBlocks(blocks);
  blocks = await getServerStateResponse(blocks);
  return {
    props: {
      slug: slug,
      seo: data.nodeByUri.seo || null,
      title: data.nodeByUri.title || '',
      data: siteData?.sitewideSettings || {},
      navbar: siteData || {},
      blocks,
      featuredImage: data.nodeByUri.featuredImage?.node?.sourceUrl || null,
      announcementsData: announcementsData
    },
    revalidate: false
  };
}

export async function getStaticPaths() {
  const { data } = await client.query({
    query: gql`
      query GET_ALL_ANNOUNCEMENTS {
        announcements {
          nodes {
            slug
          }
        }
      }
    `,
    fetchPolicy: 'no-cache'
  });

  const paths = [...data.announcements.nodes].map((announcement) => {
    return {
      params: {
        slug: announcement.slug
      }
    };
  });

  return {
    paths,
    fallback: 'blocking' // or fallback: 'blocking' for incremental static regeneration
  };
}
