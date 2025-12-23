import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import CustomLink from '@/src/components/CustomLink';
import Link from 'next/link';
import clsx from 'clsx';

const getUpcomingEvents = (events, today) => {
  const currentDate = today;
  return events
    .filter((event) => new Date(event?.node?.eventOptions?.eventDate) > currentDate)
    .map(({ ...event }) => {
      event = {
        ...event,
      };
      return event;
    });
};

const EventsSlider = (props) => {
  let { heading, events, button_anchor, button_variant, extraClasses } = props;
  if (heading == 'Upcoming Events') {
    const today = new Date();
    const upcomingEvents = getUpcomingEvents(events, today);
    events = upcomingEvents;
  }
  const [progressIndex, setProgressIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [totalSlides, setTotalSlides] = useState(0);
  const [progressWidth, setProgressWidth] = useState('');
  let sliderRef = useRef(null);

  const next = () => {
    sliderRef.slickNext();
  };
  const previous = () => {
    sliderRef.slickPrev();
  };
  const calculateTotalSlides = () => {
    let slidesToShow = settings.slidesToShow;
    const windowWidth = window.innerWidth;

    settings.responsive.forEach((breakpoint) => {
      if (windowWidth <= breakpoint.breakpoint) {
        slidesToShow = breakpoint.settings.slidesToShow;
      }
    });

    const total = events?.length - slidesToShow;
    setTotalSlides(total > 0 ? total : 0);
  };

  useEffect(() => {
    calculateTotalSlides();
    window.addEventListener('resize', calculateTotalSlides);

    const updateWidth = () => {
      if (window.innerWidth > 750) {
        setProgressWidth(`${((progressIndex + 2) / events?.length) * 100}%`);
      } else {
        setProgressWidth(`${((progressIndex + 1) / events?.length) * 100}%`);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);

    return () => {
      window.removeEventListener('resize', updateWidth);
      window.removeEventListener('resize', calculateTotalSlides);
    };
  }, [events, progressIndex, events?.length]);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: events?.length > 1 ? 2 : 1,
    slidesToScroll: 1,
    variableWidth: true,
    afterChange: (current) => {
      setCurrentSlide(current);
      setProgressIndex(current);
    },
    responsive: [
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false
        }
      }
    ]
  };

  const handleProgressBarClick = (event) => {
    const clickPosition = event.clientX - event.target.getBoundingClientRect().left;
    const totalWidth = event.target.clientWidth;
    const slideIndex = Math.floor((clickPosition / totalWidth) * events?.length);
    setProgressIndex(slideIndex);

    sliderRef.slickGoTo(slideIndex);
  };

  const button = {
    anchor: button_anchor,
    variant: button_variant
  };

  return (
    <section className="w-full mb-10 relative overflow-hidden" data-testid="events-slider">
      <div className="max-w-screen-xl px-10 mx-auto">
        <Heading otherClasses="text-brand-royal-blue text-h2 capitalize font-medium mb-10">
          {heading}
        </Heading>
        <div className={`relative flex w-full gap-6 mx-auto`}>
          <Image
            src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Button-Arrow.svg"
            alt="prev"
            height={48}
            width={48}
            onClick={previous}
            className={`${events?.length == 2 ? 'md:hidden block' : 'block'} absolute z-20 w-[3rem] h-[3rem] left-0 -translate-x-1/2 top-[50%] ${currentSlide === 0 ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
          />
          <Slider
            {...settings}
            ref={(slider) => {
              sliderRef = slider;
            }}
            className={clsx("eventsSliderContainer", extraClasses)}
          >
            {events?.map((event, index) => {
              const { eventOptions, title, slug } = event?.node;
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
                <div className="pr-6 !h-full" key={index}>
                  <Link key={index} href={`/event/${slug}`}>
                    <div className="border border-brand-neutral-5 py-8 px-6 w-full min-w-[24rem] min-h-[inherit] h-full">
                      <div className="w-full flex flex-col justify-between max-w-[24rem] min-h-[inherit] h-full">
                        <div>
                          <div className="w-full h-[18rem] relative mb-4">
                            <Image
                              src={eventImage?.node?.mediaItemUrl || '/images/placeholder.jpg'}
                              alt="event"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <Heading otherClasses="text-brand-royal-blue text-2xl leading-[1.875rem] font-bold mb-4 line-clamp-2">
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
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </Slider>
          <Image
            src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Button-Arrow.svg"
            alt="next"
            height={48}
            width={48}
            className={`${events?.length == 2 ? 'md:hidden block' : 'block'} rotate-180 absolute right-0 z-20 w-[3rem] h-[3rem] translate-x-1/2 top-[50%] ${
              currentSlide >= totalSlides ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'
            }`}
            onClick={next}
          />
        </div>

        <div className="mt-10 flex gap-[17px] justify-center items-start md:items-center md:flex-row flex-col-reverse">
          {button?.anchor && <CustomLink {...button} otherClasses={'min-w-fit'} />}
          <div className="relative w-full cursor-pointer" onClick={handleProgressBarClick}>
            <div className="overflow-hidden h-[6px] w-full text-xs flex rounded-[0.75rem] bg-brand-neutral-5">
              <div
                style={{
                  width: progressWidth
                }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-brand-green"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EventsSlider;
