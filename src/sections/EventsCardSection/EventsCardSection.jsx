import React from 'react';
import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import Image from 'next/image';
import CustomLink from '@/src/components/CustomLink';
import styles from './EventsCardSection.module.scss';
import Link from 'next/link';

function EventsCards(props) {
  const { heading, button_variant, choose_events, button_anchor } = props;
  const button = {
    anchor: button_anchor,
    variant: button_variant
  };
  return (
    choose_events?.length > 0 ? <><section className="w-full bg-brand-neutral-2 mb-10 pt-16 pb-14">
      <h1 className="text-h2 text-brand-royal-blue font-medium text-center pb-10">{heading}</h1>
      <div className="max-w-screen-xl sm:px-10 px-5 mx-auto ">
        <div className={`${styles.grid} gap-8`}>
          {choose_events?.map((event, index) => {
            const { title, slug, eventOptions, featuredImage } = event?.node;
            const {
              eventImage,
              eventDate,
              eventEndTime,
              eventLocation,
              eventStartTime,
              eventType
            } = eventOptions;
            const dateObj = new Date(eventDate);

            const formattedDate = dateObj.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            });

            const formattedTime = `${formattedDate} <span>|</span> ${eventStartTime} - ${eventEndTime}`;
            return (
              <div
                className={`${styles.gridBox} max-w-[24rem] sm:max-w-full bg-white w-full h-full px-6 py-8 border border-1 border-brand-neutral-5`}
              >
                <Link
                  key={index}
                  href={`/event/${slug}`}
                  className="h-full flex flex-col justify-between overflow-hidden"
                >
                  <div className="h-full">
                    <div className="relative w-full h-[18rem] mb-4">
                      <Image
                        src={
                          eventImage?.node?.mediaItemUrl ||
                          'https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/09/NRWIB-Placeholder-2.svg'
                        }
                        alt="event"
                        height={250}
                        width={330}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <Heading otherClasses="text-brand-royal-blue text-h4 font-bold mb-4 line-clamp-2">
                      {title}
                    </Heading>
                    <HtmlBlock
                      className="text-brand-dark-grey [&>span]:text-brand-blue-sky text-p3 font-normal mb-10"
                      content={formattedTime}
                    />
                  </div>
                  <div className="flex justify-center items-center gap-[0.625rem] pb-2 border-b-2 border-brand-green w-fit">
                    <p className="text-brand-darker text-p4 font-normal">View Event</p>
                    <Image
                      src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Vector-1.svg"
                      alt=""
                      height={16}
                      width={16}
                      className="h-4 w-4"
                    />
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center mt-12">
          <CustomLink {...button} />
        </div>
      </div>
    </section></> : null

  );
}

export default EventsCards;
