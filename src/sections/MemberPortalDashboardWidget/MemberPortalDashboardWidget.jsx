import React, { useState } from 'react';
import AuthContent from '@/src/components/AuthContent';
import Heading from '@/src/components/Heading';
import Icon from '@/src/components/Icon';
import Link from 'next/link';
import { decode } from 'html-entities';
import { NextImage } from '@/src/components/NextImage';
import Image from 'next/image';
import HtmlBlock from '@/src/components/HtmlBlock';

// Popup component for viewing announcements
const AnnouncementPopup = ({ announcement, onClose, onPrev, onNext, prevTitle, nextTitle }) => {
  if (!announcement) return null;

  return (
    <div className={""}>
      <div className="fixed inset-0 z-[8888] bg-brand-blue bg-opacity-75">
      </div>
      <div className={"absolute flex z-[8888] justify-center items-center left-0 right-0 top-24"}>
        <div className="bg-white pt-14 px-16 w-full max-w-5xl relative">
          <button className="absolute top-8 right-8" onClick={onClose}>
            <Image src="/images/close-popup.svg" width={38} height={38} alt="Close" />
          </button>
          <p className={"text-brand-dark-grey text-base font-normal mb-4"}>{announcement?.post_date}</p>
          <Heading type="h2" otherClasses="text-brand-royal-blue font-manrope font-medium pb-10">
            {decode(announcement?.post_title)}
          </Heading>
          <HtmlBlock
            content={announcement?.post_content}
            className="text-brand-black-200 text-p2 font-normal font-manrope mb-9 [&>p>strong]:!text-brand-black"
          />
          {
            announcement?.link?.url ?
              <Link
                className="!py-3 px-4 !font-medium teal-right-arrow-button block !text-center flex items-center justify-center mb-12"
                target={"_blank"}
                href={announcement?.link?.url}
              >
                {announcement?.link?.title}
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

const MemberPortalDashboardWidget = (props) => {
  const scrollToTop = () => {
    const headerOffset = 45; // Offset for any fixed header
    const elementPosition = document.documentElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  };

  const { announcements, news, resources } = props;

  // State to manage popup and current announcement index
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);

  // Open popup with the selected announcement
  const openPopup = (index) => {
    setCurrentAnnouncementIndex(index);
    setIsPopupOpen(true);
    setTimeout(() => {
      const slug = `/member-portal/announcement/${announcements[index]?.slug}`;
      history.pushState(null, null, slug);
      scrollToTop();
    }, 10);
  };

  // Close popup
  const closePopup = () => {
    const slug = `/member-portal/`;
    history.pushState(null, null, slug);
    setIsPopupOpen(false);
  };

  // Circular navigation: Navigate to the next announcement, wrap if at the end
  const nextAnnouncement = () => {
    setCurrentAnnouncementIndex((currentAnnouncementIndex + 1) % announcements.length);
    setTimeout(() => {
      const slug = `/member-portal/announcement/${announcements[(currentAnnouncementIndex + 1) % announcements.length]?.slug}`;
      history.pushState(null, null, slug);
      scrollToTop();
    }, 10); // Delay to ensure content is loaded before scroll
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
    }, 10); // Delay to ensure content is loaded before scroll
  };

  const currentAnnouncement = announcements[currentAnnouncementIndex];

  // Get the titles for previous and next announcements with circular logic
  const prevIndex = (currentAnnouncementIndex - 1 + announcements.length) % announcements.length;
  const nextIndex = (currentAnnouncementIndex + 1) % announcements.length;
  const prevTitle = announcements[prevIndex]?.post_title;
  const nextTitle = announcements[nextIndex]?.post_title;

  return (
    <section data-testid="member-portal-dashboard-widget" className={`overflow-hidden`}>
      <AuthContent>
        <div
          style={{
            backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.12) 0%, rgba(0, 0, 0, 0.12) 100%), url(${props?.background_image?.url})`,
          }}
          className="bg-cover py-16"
        >
          <div className="container mx-auto">
            <div className="grid grid-cols-3 space-x-8">
              <div className="announcements-list h-full bg-white relative">
                <Heading type="h3" otherClasses="text-h4 text-white bg-brand-blue-sky font-manrope font-bold px-8 py-8">
                  Announcements
                </Heading>
                <ul className="bg-white px-8 pt-8 pb-24">
                  {announcements.map((announcement, i) => {
                    const isLast = i === announcements.length - 1;
                    return (
                      <div className={`pb-8 ${!isLast ? 'mb-8 border-b border-b-brand-neutral-6' : ''}`} key={i}>
                        <div className="text-p2 font-manrope font-medium text-brand-black-200">
                          <a
                            className="flex justify-between items-center gap-x-4 cursor-pointer"
                            onClick={() => openPopup(i)}  // Open popup when clicked
                          >
                            <span className={"relative"}>{announcement?.post_title?.length > 32
                              ? `${decode(announcement?.post_title).substring(0, 32)}...`
                              : decode(announcement?.post_title) || ''}</span>
                            <Image className={"shrink-0"} src="/images/Icon-chevron-black.svg" width={30} height={30} alt="Close" />
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </ul>
                <div className="px-8 bg-white lg:absolute lg:bottom-8">
                  <Link
                    className="!py-3 px-4 !font-medium teal-right-arrow-button block !text-center flex items-center justify-center"
                    href="/member-portal/announcements"
                  >
                    See All Announcements
                    <Icon icon="white-chevron" iconHeight={16} iconWidth={16} />
                  </Link>
                </div>
              </div>
              <div className={"recent-news-list h-full bg-white relative"}>
                <Heading type="h3" otherClasses="text-h4 text-white bg-brand-green font-manrope font-bold px-8 py-8">
                  Recent News
                </Heading>
                <ul className={"bg-white px-8 pt-8 pb-24"}>
                  {news.map((item, i) => {
                    const isLast = i === news.length - 1;
                    return (
                      <div className={`pb-8 ${!isLast ? 'mb-8 border-b border-b-brand-neutral-6' : ''}`} key={i}>
                        <div className="text-p2 font-manrope  font-medium text-brand-black-200">
                          <Link target={"_blank"} href={`/news/${item?.slug || '/'}`} className={"flex items-center justify-between gap-x-4"}>
                            <NextImage
                              url={item?.featured_image}
                              width={1900}
                              height={500}
                              otherClasses="h-10 object-cover object-center shrink-0 w-24"
                            />
                            <span className={"relative"}>{item?.post_title?.length > 32
                              ? `${decode(item.post_title).substring(0, 32)}...`
                              : decode(item.post_title) || ''}</span>
                            <Image className={"shrink-0"} src="/images/Icon-chevron-black.svg" width={30} height={30} alt="Close" />
                          </Link>

                        </div>
                      </div>
                    );
                  })}
                </ul>
                <div className={"px-8 bg-white lg:absolute lg:bottom-8"}>
                  <Link className={
                    '!py-3 px-4 !font-medium teal-right-arrow-button block !text-center flex items-center justify-center'
                  } href={"/news"}>
                    See All News
                    <Icon icon="white-chevron" iconHeight={16} iconWidth={16} />
                  </Link>
                </div>
              </div>
              <div className={"latest-resources-list h-full bg-white relative"}>
                <Heading type="h3" otherClasses="text-h4 text-white bg-brand-saffron font-manrope font-bold px-8 py-8">
                  Latest Resources
                </Heading>
                <ul className={"bg-white px-8 pt-8 pb-24"}>
                  {resources.map((resource, i) => {
                    const isLast = i === resources.length - 1;
                    return (
                      <div className={`pb-8 ${!isLast ? 'mb-8 border-b border-b-brand-neutral-6' : ''}`} key={i}>
                        <div className="text-p2 font-manrope font-medium text-brand-black-200">
                          <Link target={"_blank"} href={resource?.url || '/'} className={"flex justify-between items-center gap-x-4"}>
                            <span className={"relative"}>{resource?.post_title?.length > 32
                              ? `${decode(resource?.post_title).substring(0, 32)}...`
                              : decode(resource?.post_title) || ''}</span>
                            <Image className={"shrink-0"} src="/images/Icon-chevron-black.svg" width={30} height={30} alt="Close" />
                          </Link>

                        </div>
                      </div>
                    );
                  })}
                </ul>
                <div className={"px-8 bg-white lg:absolute lg:bottom-8"}>
                  <Link className={
                    '!py-3 px-4 !font-medium teal-right-arrow-button block !text-center flex items-center justify-center'
                  } href={"/resources"}>
                    See All Resources
                    <Icon icon="white-chevron" iconHeight={16} iconWidth={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuthContent>

      {/* Popup Component */}
      {isPopupOpen && (
        <AnnouncementPopup
          announcement={currentAnnouncement}
          onClose={closePopup}
          onPrev={prevAnnouncement}
          onNext={nextAnnouncement}
          prevTitle={decode(prevTitle)} // Pass previous title
          nextTitle={decode(nextTitle)} // Pass next title
        />
      )}
    </section>
  );
};

export default MemberPortalDashboardWidget;
