import React, { useState } from 'react';
import MemberAccountsNav from '@/src/sections/MemberAccountsNav';
import CTABanner7 from '@/src/sections/CTABanner7/CTABanner7';
import Icon from '@/src/components/Icon';
import Image from 'next/image';
import ResourcesSubTabs from '@/src/components/ResourcesSubTabs';
import NextImage from '@/src/components/NextImage';
import NextLink from '@/src/components/NextLink';
import NewsSlider from '@/src/sections/NewsSlider/NewsSlider';
import EventsSlider from '@/src/sections/EventsSlider/EventsSlider';
import ImageWithText2 from '@/src/sections/ImageWithText2';
import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import CustomLink from '@/src/components/CustomLink';
import CountUp from 'react-countup';
import SuccessStoriesSlider from '@/src/sections/SuccessStoriesSlider/SuccessStoriesSlider';

const ActionGroupsContent = ({ data }) => {
  const { post, events, members, news, resources, footer, successStories, departments } = data;
  const { actionGroups } = post || {};
  const { button, outcomes } = actionGroups;
  let upcomingEvents = [];
  const joinNowBtn = {
    anchor: {
      title: button?.title,
      url: button?.url
      // target: '_blank'
    },
    variant: 10
  };
  const tabs = ['Overview'];

  if (outcomes?.heading) {
    tabs.push('Outcomes');
  }

  if (members?.nodes?.length > 0) {
    tabs.push('Meet the Team');
  }

  if (resources?.nodes?.length > 0) {
    tabs.push('Resources');
  }

  if (news?.edges?.length > 0) {
    tabs.push('News');
  }

  if (events?.edges?.length > 0) {
    const today = new Date().toISOString().split('T')[0];
    upcomingEvents = events?.edges?.filter((event) => {
      const eventDate = event.node.eventOptions.eventDate.split('T')[0];
      return eventDate >= today;
    });
    if (upcomingEvents?.length > 0) {
      tabs.push('Upcoming Events');
    }
  }

  const [activeTab, setActiveTab] = useState('Overview');
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <>
            <ImageWithText2
              isMemberPortal={true}
              heading={actionGroups?.overview?.title}
              content={actionGroups?.overview?.description}
              button_anchor={actionGroups?.overview?.link}
              button_variant={120}
              image={actionGroups?.overview?.image?.node}
            />
          </>
        );
      case 'Outcomes':
        return (
          <>
            <section className={'bg-brand-royal-blue pt-20 pb-20 px-6'}>
              <div className={'container mx-auto'}>
                <Heading otherClasses={'text-h1 font-medium text-center text-white mb-6 mb-20'}>
                  {outcomes?.heading}
                </Heading>
                <div className="max-w-screen-xl w-full lg:px-10 px-5 mx-auto">
                  {/* Split items into rows of 2 */}
                  {outcomes?.getOutcomes &&
                    outcomes.getOutcomes
                      .reduce((rows, item, index) => {
                        if (index % 2 === 0) rows.push([item]);
                        else rows[rows.length - 1].push(item);
                        return rows;
                      }, [])
                      .map((row, rowIndex) => (
                        <div key={rowIndex}>
                          <div className="flex flex-wrap lg:flex-nowrap w-full">
                            {row.map((item, itemIndex) => {
                              const isFirstInRow = itemIndex === 0;

                              return (
                                <div
                                  className={`flex-1 py-8 px-16 text-center 
                    ${isFirstInRow && row.length != itemIndex + 1 ? 'lg:border-r border-white' : ''}`}
                                  key={itemIndex}
                                >
                                  <Heading
                                    otherClasses={
                                      'text-oversized font-bold mb-3 text-brand-saffron'
                                    }
                                  >
                                    <CountUp duration={1} end={item?.number} enableScrollSpy />%
                                  </Heading>
                                  <HtmlBlock
                                    className="text-p1 [&>p]:!text-p1 text-white"
                                    content={item?.text}
                                  />
                                </div>
                              );
                            })}
                          </div>
                          {/* Add hr after each row except the last one */}
                          {rowIndex < outcomes.getOutcomes.length / 2 - 1 && (
                            <hr className="h-[1px] bg-white my-8" />
                          )}
                        </div>
                      ))}
                </div>
              </div>
            </section>
            {successStories?.edges && (
              <div className={'mt-12'}>
                <SuccessStoriesSlider
                  heading={'Success Stories'}
                  success_stories_slider={successStories?.edges}
                  button_anchor={{
                    title: 'Browse All Stories',
                    target: '_blank',
                    url: '/success-stories/'
                  }}
                  button_variant="105"
                />
              </div>
            )}
          </>
        );
      case 'Meet the Team':
        return (
          <div className={'container mx-auto'}>
            <div className="flex gap-10 flex-wrap mt-10 px-16">
              {members?.nodes?.map((member, index) => {
                return (
                  <NextLink
                    target={"_blank"}
                    key={`member-${member?.id}`}
                    href={`/about/team/${member?.slug}`}
                    otherClasses="w-full animate__animated animate__fadeInRight sm:w-[48%] md:w-[31.25%] items-stretch flex justify-between flex-col relative py-5 p-5 mb-10 group transition-all duration-500 hover:scale-[1.1] border border-brand-neutral-5"
                  >
                    <div className={' h-full'}>
                      <div
                        className={'relative flex items-center justify-center bg-brand-neutral-2'}
                      >
                        {member?.featuredImage?.node?.mediaItemUrl ? (
                          <NextImage
                            alt=""
                            url={member?.featuredImage?.node?.mediaItemUrl}
                            width={1000}
                            height={1600}
                            otherClasses="w-full h-auto w-[18rem] md:w-full md:h-[20rem] object-cover object-left sm:object-cover xs:h-[21rem] xs:object-cover xs:object-center"
                          />
                        ) : (
                          <NextImage
                            url={
                              'https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/eIOE_1.svg'
                            }
                            alt=""
                            width={1000}
                            height={1600}
                            otherClasses="w-full h-auto w-[10rem] md:w-full md:h-[20rem] object-contain object-center px-10 pt-10"
                          />
                        )}
                      </div>
                      <div className="mt-5 flex flex-1 flex-col items-center justify-center md:items-start md:justify-start gap-2 text-white">
                        <div className="text-p1 text-brand-royal-blue font-bold font-manrope">
                          {member?.title}
                        </div>
                        <div className="text-p4 text-black text-center md:text-start lg:w-full font-manrope font-medium">
                          {member?.teamMemberFieldGroup?.designation}
                        </div>
                        <div className="text-p4 font-semibold text-brand-dark-grey font-manrope underline">
                          {member?.teamMemberFieldGroup?.email}
                        </div>
                        {
                          !!!member?.teamMemberFieldGroup?.hideBio && <div className="mt-5">
                            <div className="flex items-center justify-center text-black font-manrope border-b-2 border-b-brand-green font-normal text-p4">
                              Read Bio
                              <Icon icon="chevron-right" />
                            </div>
                          </div>
                        }

                      </div>
                    </div>
                  </NextLink>
                );
              })}
            </div>
          </div>
        );
      case 'Resources':
        return (
          <div className={'container mx-auto'}>
            <div className="px-4">
              <ResourcesSubTabs data={resources?.nodes} />
            </div>
          </div>
        );
      case 'News':
        return (
          <div className={'container mx-auto'}>
            <div className="px-4">
              <NewsSlider
                heading={'News'}
                news={news?.edges}
                button_anchor={{
                  title: 'Browse All News',
                  target: '_blank',
                  url: '/news'
                }}
                button_variant="105"
              />
            </div>
          </div>
        );
      case 'Upcoming Events':
        return (
          <div className={'container mx-auto'}>
            <div className="px-4">
              <EventsSlider
                heading={'Upcoming Events'}
                events={upcomingEvents}
                button_anchor={{
                  title: 'Browse All Events',
                  target: '_blank',
                  url: '/events'
                }}
                button_variant="105"
                extraClasses={`action-group-events`}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section data-testid="action-group-content" className="relative overflow-hidden">
      <MemberAccountsNav block={{ attributes: departments?.nodes }} />
      <section className={'relative bg-brand-neutral-2 py-12 mb-10'}>
        <section data-testid="action-team-hero-banner" className="overflow-hidden relative">
          <div className={'container mx-auto'}>
            <div className={`mx-auto !flex lg:flex-row flex-col h-full min-h-[442px]`}>
              <div className="relative py-[4rem] lg:pr-14 px-5 lg:pl-0 lg:max-w-[45rem] w-full flex justify-center flex-col">
                <p
                  className={`w-fit text-p4 inline-block font-medium text-brand-dark-grey-1 bg-white px-5 py-[0.38rem] mb-4 rounded-[1.875rem]`}
                >
                  For Members Only
                </p>
                <Heading otherClasses={'text-h1 font-semibold text-brand-royal-blue mb-6 mb-12'}>
                  {post?.name}
                </Heading>
                <HtmlBlock
                  className="text-p1 font-normal text-brand-black-200 [&>strong]:!text-brand-black-200"
                  content={post?.description}
                />
                {button?.url ? <CustomLink {...joinNowBtn} otherClasses={'mt-8'} /> : null}

              </div>
              <div className="relative w-full">
                <div className="min-h-[29rem] h-full w-full relative overflow-hidden">
                  <Image
                    src={actionGroups?.image?.node?.url || '/images/placeholder.jpg'}
                    fill
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
      <section
        data-testid="tabs-navigation"
        className="max-w-screen-xl lg:px-10 px-5 mx-auto my-16"
      >
        <div className="flex justify-center items-center gap-6 flex-wrap">
          {tabs?.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 text-p2 tracking-[0.006rem] font-normal rounded-lg border ${
                activeTab === tab ? 'bg-brand-teal text-white' : 'bg-white text-brand-darker'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>
      <section data-testid="tab-content" className="relative">
        {renderTabContent()}
      </section>
      <CTABanner7 {...footer.footerCTA[0].attrs.data} />
    </section>
  );
};

export default ActionGroupsContent;
