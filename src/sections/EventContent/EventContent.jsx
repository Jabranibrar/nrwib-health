import React, { useState } from 'react';
import styles from './EventContent.module.scss';
import Image from 'next/image';
import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import CustomLink from '@/src/components/CustomLink';
import moment from 'moment';
import Icon from '@/src/components/Icon';
import EventsCards from '@/src/sections/EventsCardSection/EventsCardSection';
import AccordionSection from '@/src/sections/AccordionSection/AccordionSection';
import { format, parse } from 'date-fns';
import { FindASpeakerCard } from '@/src/sections/FindASpeaker/FindASpeaker';
import ResourcesSubTabs from '@/src/components/ResourcesSubTabs';
import Link from 'next/link';
import { FaArrowLeftLong } from "react-icons/fa6";

const getPastEvents = (events, today, slug) => {
  const currentDate = today;
  const postSlug = slug;
  return events
    .filter((event) => new Date(event?.eventOptions?.eventDate) < currentDate)
    .filter((event) => event?.slug != postSlug)
    .map(({ [postSlug]: _, ...event }) => {
      event.node = {
        ...event,
      };
      return event;
    })
    .sort((a, b) => new Date(b.eventOptions.eventDate) - new Date(a.eventOptions.eventDate)); // Sort in descending order;
};

const getUpcomingEvents = (events, today, slug) => {
  const currentDate = today;
  const postSlug = slug;
  return events
    .filter((event) => new Date(event?.eventOptions?.eventDate) > currentDate)
    .filter((event) => event?.slug != postSlug)
    .map(({ [postSlug]: _, ...event }) => {
      event.node = {
        ...event,
      };
      return event;
    })
    .sort((a, b) => new Date(a.eventOptions.eventDate) - new Date(b.eventOptions.eventDate)); // Sort in ascending order
};

const EventContent = ({ data, events, speakers }) => {
  const {
    eventOptions,
    title,
    slug,
    uri
  } = data;
  const {
    eventDate,
    eventEndTime,
    eventImage,
    eventLocation,
    eventStartTime,
    overviewDescription,
    overviewImage,
    layoutType,
    overviewVideo,
    overviewTitle,
    overviewLink,
    registerNowDescription,
    registerNowImage,
    registerNowLink,
    registerNowTitle,
    eventType,
    faqs,
    agenda,
    resourcesEventRelationship
  } = eventOptions;
  const today = new Date();
  const dateObj = new Date(eventDate);
  const pastEvents = getPastEvents(events?.nodes, today, slug);
  const upcomingEvents = getUpcomingEvents(events?.nodes, today, slug);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const agendaModified = agenda?.reduce((acc, event, index) => {
    acc[`accordion_${index}_title`] = event?.title;
    acc[`accordion_${index}_text`] = event?.text;
    acc[`accordion_${index}_time`] = format(parse(event?.time, 'h:mm a', new Date()), 'HH:mm:ss');
    acc[`accordion_${index}_open`] = 0;
    return acc;
  }, { accordion: agenda?.length });

  const faqsModified = faqs?.reduce((acc, faq, index) => {
    acc[`accordion_${index}_title`] = faq?.title;
    acc[`accordion_${index}_text`] = faq?.text;
    acc[`accordion_${index}_time`] = false;
    acc[`accordion_${index}_open`] = 0;
    return acc;
  }, { accordion: faqs?.length });

  const isPastEvent = dateObj < today;
  const formattedTime = `
  ${formattedDate} <span class='text-brand-green'>|</span> ${eventType}  
    ${isPastEvent ? '' : (eventStartTime === eventEndTime ? ' <span class=\'text-brand-green\'>|</span> Full Day' : `<span class='text-brand-green'>|</span> ${eventStartTime} - ${eventEndTime}  ${ null != eventLocation ? `<span class='text-brand-green'>|</span> ${eventLocation}` : ''}`)}
  `;
  const eventStatusText = isPastEvent ? 'Past Event' : 'Upcoming Event';

  // Format the event start and end times to the required Google Calendar format
  const formattedStartTime = moment(`${formattedDate} ${eventStartTime}`, 'MMM DD, YYYY h:mm A').format('YYYYMMDDTHHmmss');
  const formattedEndTime = moment(`${formattedDate} ${eventEndTime}`, 'MMM DD, YYYY h:mm A').format('YYYYMMDDTHHmmss');

  // Encode event details for the Google Calendar URL
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${formattedStartTime}%2F${formattedEndTime}&details=${encodeURIComponent(title)}&location=${encodeURIComponent(eventLocation)}&text=${encodeURIComponent(title)}`;

  const filteredSpeakers = speakers?.edges?.filter(edge => {
    const events = edge.node.aboutSpeaker.associatedEvent?.nodes || [];
    return events.some(event => event.slug === slug);
  });


  const button1 = {
    anchor: {
      title: 'Register Now',
      url: registerNowLink,
      target: '_blank'
    },
    variant: 8
  };
  const button2 = {
    anchor: {
      title: 'Add to Calendar',
      url: calendarUrl,
      target: '_blank'
    },
    variant: 5
  };

  const registerNowBtn = {
    anchor: {
      title: 'Register Now',
      url: registerNowLink,
      target: '_blank'
    },
    variant: 11
  };

  const tabs = ['Overview'];
  if (agenda?.length>0) {
    tabs.push('Agenda');
  }

  if (filteredSpeakers?.length>0) {
    tabs.push('Speakers');
  }

  if (faqs?.length>0) {
    tabs.push('FAQs');
  }

  if (resourcesEventRelationship?.nodes?.length>0) {
    tabs.push('Resources');
  }

  const [activeTab, setActiveTab] = useState('Overview');
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <>
            {
              overviewTitle &&
              <>
                {
                  'Video' == layoutType ?
                    <section
                      data-testid='events-intro-section'
                      className='w-full mb-10 bg-brand-blue'
                    >
                      <div className={"py-14 container mx-auto"}>
                        <HtmlBlock content={overviewVideo} className='mb-12' />
                        <Heading otherClasses={'text-h2 font-semibold text-white mb-10'}>{overviewTitle}</Heading>
                        <HtmlBlock content={overviewDescription} className='text-p2 font-normal text-white' />
                        {
                          overviewLink?.title &&
                          <a target={overviewLink?.target} href={overviewLink?.url} className={'mt-8'}>
                            <span className={'white-right-arrow-button !py-4'}>
                              {overviewLink?.title}
                              <Icon icon="blue-chevron-right" iconHeight={20} iconWidth={20} />
                            </span>
                          </a>
                        }
                      </div>
                    </section>
                    :
                    <section
                    data-testid='events-intro-section'
                    className='w-full mb-10 bg-brand-neutral-3'
                  >
                    <div className={`flex md:flex-row flex-col h-full mx-auto`}>
                      <div className='w-full lg:!max-w-[41%] md:h-auto md:min-h-[inherit] min-h-[20rem] relative'>
                        <Image src={overviewImage?.node?.mediaItemUrl || '/images/placeholder.jpg'} fill className='object-cover' />
                      </div>
                      <div className={`bg-brand-neutral-3 sm:pt-[3.875rem] pl-[4.25rem] pb-[3.625rem] pr-8 w-full`}>
                        <Heading otherClasses={'text-h2 font-medium text-brand-royal-blue mb-10'}>{overviewTitle}</Heading>
                        <HtmlBlock content={overviewDescription} className='text-p2 font-normal text-brand-black-200 [&>p>a]:!text-brand-black-200 [&>p>a>strong]:!text-brand-black-200' />
                        {
                          agenda?.length>0 && <div className={'mt-8'}>
                          <span className={'teal-right-arrow-button'}>
                            View Agenda
                            <Icon icon='button-arrow-icon' iconHeight={26} iconWidth={26} />
                          </span>
                          </div>
                        }

                      </div>
                    </div>
                  </section>
                }
              </>
            }

          </>
        );
      case 'Agenda':
        return (
          <>
            <AccordionSection {...agendaModified} />
          </>
        );
      case 'Speakers':
        return (
          <div className={"container mx-auto"}>
            <div className="flex flex-row flex-wrap justify-center gap-6 mb-16">
              {filteredSpeakers?.map((speaker, index) => {
                return <FindASpeakerCard key={index} data={speaker?.node} hideCTALink />;
              })}
            </div>
          </div>
        );
      case 'FAQs':
        return (
          <>
            <AccordionSection {...faqsModified} />
          </>
        );
      case 'Resources':
        return (
          <>
            <ResourcesSubTabs data={resourcesEventRelationship?.nodes}/>
          </>
        );
      default:
        return null;
    }
  };
  return (
    <section data-testid='event-content' className='relative overflow-hidden'>
      <section
        data-testid='events-hero-banner'
        className='w-full bg-brand-royal-blue overflow-hidden relative'
      >
        <Image
          src='https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/09/Vector-2.svg'
          width={92}
          height={102}
          alt='doodle'
          className='absolute bottom-0 left-0'
        />
        <div
          className={`mx-auto !flex lg:flex-row flex-col h-full min-h-[442px] ${styles.homeSectionMargin}`}
        >
          <div
            className='relative py-[4rem] lg:pr-14 px-5 lg:pl-0 lg:max-w-[45rem] w-full flex justify-center flex-col'>
            <p  className={`text-xs inline-block font-normal text-brand-neutral-8 mb-4`}>
              <Link className={'flex items-center gap-x-2'} href={'/events/'}>
                <FaArrowLeftLong />
                <span>
                  Back to all events
                </span>
              </Link>
            </p>
            <p
              className={`w-fit text-p4 inline-block font-medium ${isPastEvent ? 'text-white bg-brand-teal' : 'text-brand-dark-grey-1 bg-white'} px-5 py-[0.38rem] mb-4 rounded-[1.875rem]`}
            >
              {eventStatusText}
            </p>
            <Heading
              otherClasses={
                'text-h1 font-semibold text-brand-white mb-6'
              }
            >
              {title}
            </Heading>
            <p className={"text-white text-p2 mb-10"}>{eventType}</p>
            <div className={"flex gap-x-16 max-w-[520px]"}>
              <div className={"relative mb-8 text-white text-p2 border-l-2 border-brand-green pl-6 w-1/2"}>
                <h4 className={"font-semibold mb-2"}>Date & Time:</h4>
                <p className={"font-normal mb-2"}>{formattedDate}</p>
                <p className={"font-normal uppercase"}>{eventStartTime === eventEndTime ? 'Full Day' : `${eventStartTime} - ${eventEndTime}`}</p>
              </div>
              {
                eventLocation &&  <div className={"relative mb-8 text-white text-p2 border-l-2 border-brand-green pl-6 w-1/2"}>
                  <h4 className={"font-semibold mb-2"}>Location:</h4>
                  <p className={"font-normal mb-2"}>{eventLocation}</p>
                </div>
              }

            </div>
            {!isPastEvent && (
              <div className={`mt-8 flex gap-4 ${styles.buttonStyle}`}>
                {button1?.anchor?.url && <CustomLink {...button1} />}
                {button2?.anchor?.url && <CustomLink {...button2} />}
              </div>
            )}
          </div>
          <div className='relative w-full'>
            <div
              className='min-h-[29rem] h-full w-full relative overflow-hidden sm:border-r-[4.188rem] border-r-[2rem] border-r-brand-green'>
              <Image
                src={
                  eventImage?.node?.mediaItemUrl ||
                  '/images/placeholder.jpg'
                }
                fill
                className='w-full h-full object-cover'
              />
            </div>
          </div>
        </div>
      </section>
      {
        tabs?.length > 1 &&
        <section data-testid='tabs-navigation' className='max-w-screen-xl lg:px-10 px-5 mx-auto my-16'>
          <div className='flex justify-center items-center gap-6 flex-wrap'>
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
      }
      <section data-testid="tab-content" className="relative">
        {renderTabContent()}
      </section>
      {
        registerNowLink && !isPastEvent &&
        <section
          data-testid='register-cta'
          className='w-full max-w-screen-xl lg:px-10 px-5 mx-auto mb-10'
        >
          <div className='flex md:flex-row flex-col h-full'>
            <div className='w-full lg:!max-w-[35rem] md:h-auto md:min-h-[inherit] min-h-[20rem] relative'>
              <Image src={registerNowImage?.node?.mediaItemUrl|| '/images/placeholder.jpg'} fill className='object-cover' />
              <Image
                src={'https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/09/Vector-1.svg'}
                alt='logo'
                width={100}
                height={97}
                className='absolute top-0 right-[-0.125rem] z-10'
              />
            </div>

            <div className={`bg-brand-blue-sky sm:p-14 p-8 w-full border-l-[0.625rem] border-l-brand-saffron`}>
              <Heading otherClasses={'text-h2 font-medium text-brand-white mb-3'}>{registerNowTitle}</Heading>
              <HtmlBlock content={registerNowDescription} className='text-p2 font-normal text-brand-white' />
              {registerNowLink && <CustomLink {...registerNowBtn} otherClasses={'mt-8'} />}
            </div>
          </div>
        </section>
      }
      {
        isPastEvent ?
        <section data-testid={"past-events"}>
          <EventsCards
            heading={"Browse Past Events"}
            choose_events={pastEvents}
            button_variant={105}
            button_anchor={ {
              title: 'See All Past Events',
              url: '/events/?mode=past',
            }
            }
          />
        </section>
        :
          <section data-testid={"upcoming-events"}>
            <EventsCards
              heading={"Browse Upcoming Events"}
              choose_events={upcomingEvents}
              button_variant={105}
              button_anchor={ {
                title: 'See All Upcoming Events',
                url: '/events/?mode=upcoming',
              }
              }
            />
          </section>
      }

    </section>
  );
};

export default EventContent;
