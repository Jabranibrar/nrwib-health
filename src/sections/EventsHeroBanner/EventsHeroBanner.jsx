import React from 'react';
import styles from './EventsHeroBanner.module.scss';
import HtmlBlock from '@/src/components/HtmlBlock';
import Heading from '@/src/components/Heading';
import Image from 'next/image';
import CustomLink from '@/src/components/CustomLink';

const EventsHeroBanner = (props) => {
  const {
    choose_events_banner,
    button_anchor,
    button_variant,
    button_2_anchor,
    button_2_variant,
    event_background_color,
    event_color
  } = props;

  const button1 = {
    anchor: button_anchor,
    variant: button_variant
  };
  const button2 = {
    anchor: button_2_anchor,
    variant: button_2_variant
  };

  const today = new Date();

  return (
    <section
      data-testid="events-hero-banner"
      className="w-full bg-brand-royal-blue overflow-hidden relative"
    >
      <Image
        src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/09/Vector-2.svg"
        width={92}
        height={102}
        alt="doodle"
        className="absolute bottom-0 left-0"
      />
      {choose_events_banner?.length > 0 &&
        choose_events_banner?.map((event, index) => {
          const { eventOptions, featuredImage, title } = event?.node;
          const { eventDate, eventEndTime, eventLocation, eventStartTime, eventType, eventImage } =
            eventOptions;
          const dateObj = new Date(eventDate);

          const formattedDate = dateObj.toLocaleDateString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
          });

          const formattedTime = `${formattedDate} <span className='text-brand-green'>|</span> ${eventStartTime} - ${eventEndTime} <span className='text-brand-green'>|</span> ${eventLocation}`;

          const isPastEvent = dateObj < today;
          const eventStatusText = isPastEvent ? 'Past Event' : 'Upcoming Event';

          return (
            <div
              key={index}
              className={`mx-auto !flex lg:flex-row flex-col h-full ${styles.homeSectionMargin}`}
            >
              <div className="relative py-[4rem] lg:pr-14 px-5 lg:pl-0 lg:max-w-[45rem] w-full flex justify-center flex-col">
                <p
                  className={`w-fit text-p4 inline-block font-medium text-${event_color} bg-${event_background_color} px-5 py-[0.38rem] mb-4 rounded-[1.875rem]`}
                >
                  {eventStatusText}
                </p>
                <Heading
                  otherClasses={
                    'text-h1 font-semibold text-brand-white mb-6 pb-6 border-b border-b-brand-white'
                  }
                >
                  {title}
                </Heading>
                <HtmlBlock
                  className="text-p1 font-normal text-brand-white"
                  content={formattedTime}
                />
                {!isPastEvent && (
                  <div className={`mt-8 flex gap-4 ${styles.buttonStyle}`}>
                    {button1?.anchor?.url && <CustomLink {...button1} />}
                    {button2?.anchor?.url && <CustomLink {...button2} />}
                  </div>
                )}
              </div>
              <div className="relative w-full">
                <div className="min-h-[29rem] h-full w-full relative overflow-hidden sm:border-r-[4.188rem] border-r-[2rem] border-r-brand-green">
                  <Image
                    src={
                      eventImage?.node?.mediaItemUrl ||
                      '/images/placeholder.jpg'
                    }
                    fill
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          );
        })}
    </section>
  );
};

export default EventsHeroBanner;
