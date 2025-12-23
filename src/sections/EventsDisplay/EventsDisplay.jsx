import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import clsx from 'clsx';
import Image from 'next/image';
import moment from 'moment';
import Link from 'next/link';
import TypesenseInstantsearchAdapter from 'typesense-instantsearch-adapter';
import {
  Configure,
  InstantSearch,
  useClearRefinements,
  useInfiniteHits,
  useInstantSearch,
  useMenu,
  useRange,
  useSearchBox
} from 'react-instantsearch';
import { connectStateResults } from 'react-instantsearch-dom';
import Icon from '@/src/components/Icon';
import SelectInput from '@/src/components/SelectInput';
import DateRangeInput from '@/src/components/DateRangeInput';
import CalendarCustomHits from '@/src/sections/EventsDisplay/CalendarCustomHits';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

let timerId = undefined;
let timeout = 500;

function queryHook(query, search) {
  if (timerId) {
    clearTimeout(timerId);
  }

  timerId = setTimeout(() => search(query), timeout);
}

export const EventsDisplay = (props) => {
  const [showCalendar, setShowCalendar] = useState(null);
  const { otherClasses, id = '' } = props || {};
  const eventsCalendarClasses = clsx(otherClasses, 'bg-brand-white mb-10');
  const [filterByDate, setFilterByDate] = useState(null);
  const searchClient = useMemo(() => {
    const typesenseInstantsearchAdapter = new TypesenseInstantsearchAdapter({
      server: {
        apiKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_ONLY_API_KEY, // Be sure to use the search-only-api-key
        nodes: [
          {
            host: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_HOST,
            port: '8108',
            protocol: 'https'
          }
        ]
      },
      additionalSearchParameters: {
        query_by: 'post_title, meta_data',
        sort_by: '_text_match:desc, event_date_timestamp:desc',
        typo_tokens_threshold: 0
      }
    });

    const searchClient = typesenseInstantsearchAdapter.searchClient;

    return searchClient;
  }, []);

  // const Event = (event) => {
  //   return (
  //     <div className="relative">
  //       {event?.event?.external_url ? (
  //         <Link href={event.event.external_url} target="_blank">
  //           {event?.event?.event_date && (
  //             <p className="mb-1 text-sm text-brand-gray-600">
  //               {moment(event.event.event_date, 'DD/MM/YYYY h:mm A').format('h:mm A')}
  //             </p>
  //           )}
  //           <h6 className="text-sm text-brand-gray-600">{event?.title}</h6>
  //         </Link>
  //       ) : (
  //         <>
  //           {event?.event?.featuredImage && (
  //             <img
  //               src={event.event.featuredImage || '/images/blue-DetroitPBS-Logo.svg'}
  //               width={314}
  //               height={41}
  //               alt="bg-img"
  //               className="object-cover w-full h-20 mb-3 relative"
  //             />
  //           )}
  //           {event?.event?.event_date && (
  //             <p className="mb-1 text-sm text-brand-gray-600">
  //               {moment(event.event.event_date, 'DD/MM/YYYY h:mm A').format('h:mm A')}
  //             </p>
  //           )}
  //           <h6 className="text-sm text-brand-gray-600">{event?.title}</h6>
  //         </>
  //       )}
  //     </div>
  //   );
  // };

  return (
    <section id={id} className={eventsCalendarClasses} data-testid="events-widget">
      <div className="mx-auto">
        <InstantSearch
          future={{ preserveSharedStateOnUnmount: true }}
          indexName="event"
          searchClient={searchClient}
        >
          <Configure queryByWeights="1" dropTokensThreshold={0} numTypos={2} hitsPerPage={200} />
          <div className="bg-brand-royal-blue overflow-visible">
            <div className={clsx('max-w-screen-xxl mx-auto lg:px-32 px-4 py-12 overflow-visible')}>
              <Filters
                showCalendar={showCalendar}
                setShowCalendar={setShowCalendar}
                {...props}
                setFilterByDate={setFilterByDate}
              />
            </div>
          </div>
          <EventResults showCalendar={showCalendar} filterByDate={filterByDate} />
        </InstantSearch>
      </div>
    </section>
  );
};

const EventResults = ({ showCalendar, filterByDate }) => {
  // const { hits, isLastPage, showMore } = useInfiniteHits();
  const { status } = useInstantSearch();
  const noResMessage = 'There are no results for your search, please try again.';
  const currentDate = moment();

  function getPastAndUpcomingEvents(events) {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let eventsData;
    // Get past events
    if (mode === 'past') {
      eventsData = events?.filter((event) => new Date(event?.event_date_timestamp * 1000) < today);
    } else {
      // Get upcoming events
      eventsData = events?.filter((event) => new Date(event?.event_date_timestamp * 1000) >= today);
    }

    return eventsData;
  }
  const eventsData = getPastAndUpcomingEvents(filterByDate);

  return (
    <>
      {eventsData?.length ? (
        <div className={'events-list relative'}>
          {showCalendar ? (
            <div className={'container mx-auto'}>
              <div className={clsx('relative')}>
                <div className="max-w-screen-xxl mx-auto">
                  <CalendarCustomHits data={eventsData} />
                </div>
              </div>
            </div>
          ) : (
            <div className={'container mx-auto'}>
              {Object.entries(
                eventsData
                  // First, sort the events by their date in ascending order
                  .sort(
                    (a, b) =>
                      moment(a.event_date, 'DD/MM/YYYY h:mm A') -
                      moment(b.event_date, 'DD/MM/YYYY h:mm A')
                  )
                  // Group events by formatted month and year
                  .reduce((acc, event) => {
                    const { event_date = '' } = event;
                    const formattedMonthYear = moment(event_date, 'DD/MM/YYYY h:mm A').format(
                      'MMMM YYYY'
                    );

                    if (!acc[formattedMonthYear]) {
                      acc[formattedMonthYear] = [];
                    }
                    acc[formattedMonthYear].push(event);

                    return acc;
                  }, {})
              )
                .sort(([monthYearA], [monthYearB]) => {
                  const momentA = moment(monthYearA, 'MMMM YYYY');
                  const momentB = moment(monthYearB, 'MMMM YYYY');

                  if (
                    momentA.isSameOrAfter(currentDate, 'month') &&
                    momentB.isBefore(currentDate, 'month')
                  ) {
                    return -1; // Keep upcoming before past
                  } else if (
                    momentA.isBefore(currentDate, 'month') &&
                    momentB.isSameOrAfter(currentDate, 'month')
                  ) {
                    return 1; // Move past after upcoming
                  } else if (
                    momentA.isSameOrAfter(currentDate, 'month') &&
                    momentB.isSameOrAfter(currentDate, 'month')
                  ) {
                    return momentA - momentB; // Sort upcoming months in ascending order
                  } else {
                    return momentB - momentA; // Sort past months in descending order
                  }
                })
                .map(([monthYear, events]) => (
                  <div key={monthYear} className="month-group">
                    <h2 className="text-center text-brand-royal-blue text-h3 font-medium my-10">
                      {monthYear}
                    </h2>

                    {events.map(
                      (
                        {
                          event_date = '',
                          event_end_time = '',
                          event_location = '',
                          event_start_time = '',
                          post_title = '',
                          ID = '',
                          register_now_link = '',
                          event_type = '',
                          slug = ''
                        },
                        index
                      ) => {

                        const today = new Date();
                        const formattedMonth = moment(event_date, 'DD/MM/YYYY h:mm A').format(
                          'MMM'
                        );
                        const formattedDay = moment(event_date, 'DD/MM/YYYY h:mm A').format('DD');

                        // Format the event start and end times to the required Google Calendar format
                        const formattedStartTime =
                          moment(`${event_date} ${event_start_time}`, 'DD/MM/YYYY h:mm A').format(
                            'YYYYMMDDTHHmmss'
                          );
                        const formattedEndTime =
                          moment(`${event_date} ${event_end_time}`, 'DD/MM/YYYY h:mm A').format(
                            'YYYYMMDDTHHmmss'
                          );
                        const dateObj = new Date(moment(event_date, 'DD/MM/YYYY h:mm A'));
                        const isPastEvent = dateObj < today;
                        // Encode event details for the Google Calendar URL
                        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${formattedStartTime}%2F${formattedEndTime}&details=${encodeURIComponent(post_title)}&location=${encodeURIComponent(event_location)}&text=${encodeURIComponent(post_title)}`;

                        return (
                          <div
                            key={ID}
                            className={
                              'rounded-2xl bg-white shadow-event flex items-stretch mb-6 overflow-hidden'
                            }
                          >
                            <div
                              className={
                                'w-48 shrink-0 bg-brand-teal py-6 px-6 text-center text-white font-semibold flex items-center justify-center'
                              }
                            >
                              <div className={'relative block'}>
                                <p className={'text-h1'}>{formattedDay}</p>
                                <p className={'text-h3 uppercase'}>{formattedMonth}</p>
                              </div>
                            </div>
                            <div className={'w-full bg-white pb-6 px-5 md:px-12 flex items-center'}>
                              <div className={'relative block w-full'}>
                                <Link href={slug ? `/event/${slug}` : '#'} className="block pt-6">
                                  <p className={'text-brand-royal-blue text-h4 mb-4'}>
                                    {post_title}
                                  </p>
                                  <p className={'text-brand-darker font-medium text-lg'}>
                                    {event_location}
                                  </p>
                                  <div className={'h-[0.063rem] bg-brand-saffron w-full my-6'} />
                                </Link>
                                <div
                                  className={'flex items-stretch justify-between flex-wrap gap-5'}
                                >
                                  <div
                                    className={
                                      'relative flex items-center text-brand-dark-grey text-lg'
                                    }
                                  >
                                    <div className={'type'}>
                                      {event_type}
                                    </div>
                                    <div
                                      className={'bg-brand-neutral-5 h-full w-[0.063rem] mx-6'}
                                    />
                                    <div className={'date'}>
                                      {event_start_time === event_end_time
                                        ? 'Full Day'
                                        : `${event_start_time} - ${event_end_time}`}
                                    </div>
                                    <div
                                      className={'bg-brand-neutral-5 h-full w-[0.063rem] mx-6'}
                                    />
                                    <a
                                      className={
                                        'group transition-all duration-300 flex gap-2 items-center'
                                      }
                                      target={'_blank'}
                                      href={calendarUrl}
                                    >
                                      <span className={'text-brand-teal'}>Add to Calendar</span>
                                      <Icon
                                        icon="sky-blue-right-arrow"
                                        iconHeight={12}
                                        iconWidth={12}
                                        className="group-hover:translate-x-2 transition-transform duration-300"
                                      />
                                    </a>
                                  </div>
                                  <div
                                    className={
                                      'relative flex items-start sm:items-center text-brand-dark-grey text-lg gap-6 sm:flex-row flex-col'
                                    }
                                  >
                                    {register_now_link && !isPastEvent ? (
                                      <>
                                        <a
                                          className="green-right-arrow-button group"
                                          target={'_blank'}
                                          href={register_now_link}
                                        >
                                          <span>Register Now</span>
                                          <Icon
                                            icon="chevron-left-white"
                                            iconHeight={12}
                                            iconWidth={12}
                                            className="group-hover:translate-x-2 transition-transform duration-300 rotate-180"
                                          />
                                        </a>
                                        <div
                                          className={
                                            'bg-brand-neutral-5 md:block hidden h-full w-[0.063rem]'
                                          }
                                        />
                                      </>
                                    ) : null}
                                    <a
                                      className={
                                        'flex justify-center items-center gap-[0.625rem] pb-2 border-b-2 border-brand-green w-fit cursor-pointer'
                                      }
                                      target={'_blank'}
                                      href={`/event/${slug}`}
                                    >
                                      <p className="text-brand-dark-grey font-normal">Learn More</p>
                                      <Image
                                        src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Vector-1.svg"
                                        alt=""
                                        height={16}
                                        width={16}
                                        className="h-4 w-4"
                                      />
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      ) : 'idle' == status ? (
        <div className={'bg-brand-gray-200 pt-10 pb-10'}>
          <div className="max-w-screen-xxl mx-auto px-4 flex justify-center">
            <div className="bg-brand-gray-200 w-full text-2xl text-center">{noResMessage}</div>
          </div>
        </div>
      ) : null}
    </>
  );
};

const Filters = ({ showCalendar, setShowCalendar, setFilterByDate, ...props }) => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const toggleValue = searchParams.get('mode') || 'upcoming';
  const [showPastEvent, setShowPastEvent] = useState(toggleValue === 'past');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filterByDateTime, setFilterByDateTime] = useState(null);
  const { hits } = useInfiniteHits();

  const { refine: clearEventTypeRefinement } = useClearRefinements({
    ...props,
    includedAttributes: ['event_date_timestamp', 'event_type']
  });

  const { refine, clear } = useSearchBox({ ...props, queryHook });

  const { items: eventTypes, refine: refineByEventType } = useMenu({
    sortBy: ['name:desc'],
    attribute: 'event_type'
  });

  const { refine: refineByEventDateTimestamp } = useRange({
    attribute: 'event_date_timestamp'
  });

  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState('');

  const defaultType = {
    label: 'By Type',
    value: null
  };

  const viewAllOption = {
    label: 'View All',
    value: null
  };

  const [selectedType, setSelectedType] = useState(defaultType);

  const onDatesChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
    // let timestampStartDate = startDate ? Math.floor(new Date(startDate).getTime() / 1000) : null;
    // let timestampEndDate = endDate ? Math.floor(new Date(endDate).getTime() / 1000) : null;
    // refineByEventDateTimestamp([
    //   Number.isFinite(timestampStartDate) ? timestampStartDate : undefined,
    //   Number.isFinite(timestampEndDate) ? timestampEndDate : undefined
    // ]);

    if (startDate) {
      localStorage.setItem('startDate', startDate.toISOString());
    } else {
      localStorage.removeItem('startDate');
    }

    if (endDate) {
      localStorage.setItem('endDate', endDate.toISOString());
    } else {
      localStorage.removeItem('endDate');
    }

    if (startDate && endDate) {
      const filteredEvents = hits?.filter((event) => {
        const eventDate = moment.unix(event.event_date_timestamp); // Convert Unix timestamp to moment
        return eventDate.isBetween(startDate, endDate, 'days', '[]'); // Inclusive of start and end
      });
      setFilterByDateTime(filteredEvents);
    } else {
      setFilterByDateTime(hits);
    }
  };

  useEffect(() => {
    // Retrieve stored dates from localStorage on component mount
    const storedStartDate = localStorage.getItem('startDate');
    const storedEndDate = localStorage.getItem('endDate');

    if (storedStartDate) {
      setStartDate(moment(storedStartDate));
    }

    if (storedEndDate) {
      setEndDate(moment(storedEndDate));
    }
  }, []);

  useEffect(() => {
    if (startDate && endDate) {
      setFilterByDate(filterByDateTime);
    } else {
      setFilterByDate(hits);
    }
  }, [startDate, endDate, filterByDateTime, hits]);

  useEffect(() => {
    if (selectedType.value) {
      refineByEventType(selectedType.value);
    } else {
      clearEventTypeRefinement();
    }
  }, [selectedType, clearEventTypeRefinement, refineByEventType]);

  useEffect(() => {
    if (inputValue.length === 0) {
      clear();
    } else {
      refine(inputValue);
    }
  }, [inputValue, refine, clear]);

  // useEffect(() => {
  //   const timestampCurrentDate = Math.floor(new Date().getTime() / 1000); // Current timestamp

  //   if (showPastEvent) {
  //     // Show past events
  //     refineByEventDateTimestamp([
  //       undefined, // No start date
  //       Number.isFinite(timestampCurrentDate) ? timestampCurrentDate : undefined // End date is the current timestamp
  //     ]);
  //   } else {
  //     // Show upcoming events
  //     refineByEventDateTimestamp([
  //       Number.isFinite(timestampCurrentDate) ? timestampCurrentDate : undefined, // Start date is the current timestamp
  //       undefined // No end date
  //     ]);
  //   }
  // }, []);

  const togglePastEvents = () => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');
    const pastEventToggle = !showPastEvent;
    setShowPastEvent(pastEventToggle);
    // const timestampCurrentDate = Math.floor(new Date().getTime() / 1000);

    if (pastEventToggle) {
      params.set('mode', 'past');
      // refineByEventDateTimestamp([
      //   Number.isFinite(timestampCurrentDate) ? timestampCurrentDate : undefined,
      //   undefined
      // ]);
    } else {
      params.set('mode', 'upcoming');
      // refineByEventDateTimestamp([
      //   undefined,
      //   Number.isFinite(timestampCurrentDate) ? timestampCurrentDate : undefined
      // ]);
    }
    // Update the URL without page reload
    replace(`${pathname}?${params.toString()}`, { shallow: true, scroll: false });
    // replace(`${pathname}?${params.toString()}`, undefined, { shallow: true });
  };

  const handleClear = () => {
    // const timestampCurrentDate = Math.floor(new Date().getTime() / 1000);
    // if (showPastEvent) {
    //   refineByEventDateTimestamp([
    //     undefined,
    //     Number.isFinite(timestampCurrentDate) ? timestampCurrentDate : undefined
    //   ]);
    // } else {
    //   refineByEventDateTimestamp([
    //     Number.isFinite(timestampCurrentDate) ? timestampCurrentDate : undefined,
    //     undefined
    //   ]);
    // }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get('mode');

    if (mode === 'past') {
      setShowPastEvent(true);
    } else {
      setShowPastEvent(false);
    }
  }, []);

  return (
    <div className={'relative'}>
      <div className="flex gap-x-8 gap-y-4 justify-center flex-wrap">
        <DateRangeInput
          rootClasses="w-full lg:w-fit min-w-[280px] text-lg"
          otherClasses="pl-6 h-[58px]"
          startDate={startDate}
          endDate={endDate}
          onDatesChange={onDatesChange}
          handleClear={handleClear}
        />
        <div className="relative w-full lg:w-fit">
          <input
            tabIndex="0"
            ref={inputRef}
            className="font-normal text-lg h-[58px] px-6 pt-3 pb-3 border border-brand-neutral-5 placeholder:text-white text-white outline-none min-w-[300px] lg:w-fit w-full rounded-lg bg-transparent"
            name="searchValue"
            placeholder="Search by Keyword"
            spellCheck={false}
            maxLength={512}
            autoComplete="off"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            autoCorrect="off"
            autoCapitalize="off"
          />
          {inputValue ? (
            <button
              onClick={() => setInputValue('')}
              tabIndex="0"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  // Prevent default behavior to avoid unintentional form submission
                  e.preventDefault();
                  setInputValue('');
                }
              }}
              className="absolute right-[10px] translate-y-[-50%] top-[50%]"
            >
              <Icon icon="cross-icon-teal" iconHeight={24} iconWidth={24} />
            </button>
          ) : (
            <button className="absolute right-[10px] translate-y-[-50%] top-[50%]">
              <Icon
                icon="search-icon-white"
                otherClasses="text-white"
                iconHeight={24}
                iconWidth={24}
              />
            </button>
          )}
        </div>
        <SelectInput
          rootClasses="w-full lg:w-fit min-w-[230px] text-xl"
          otherClasses="h-[58px] pt-[1.1rem] px-6"
          options={[
            defaultType,
            viewAllOption,
            ...eventTypes.filter((eventType) => eventType?.label != '')
          ]}
          placeholder="All"
          selectedOption={selectedType}
          onChange={(event) => {
            setSelectedType(event);
          }}
        />
      </div>
      <div className={'container mx-auto'}>
        <div className={'h-[0.063rem] bg-brand-neutral-2 w-full my-12'} />
        <div
          className={
            'flex items-start sm:items-center justify-between sm:flex-row flex-col sm:gap-0 gap-5'
          }
        >
          <div className="flex items-center justify-center gap-x-4">
            <span className={`text-xl text-white ${!showPastEvent && 'text-white'}`}>Upcoming</span>
            <label className="inline-flex relative items-center">
              <input type="checkbox" className="sr-only peer" checked={showPastEvent} readOnly />
              <divz
                onClick={togglePastEvents}
                className='relative w-[57px] h-[28px] bg-brand-teal rounded-full cursor-pointer after:content-[""] after:absolute after:top-[4px] after:left-[5px] after:bg-white after:rounded-full after:h-[20px] after:w-[20px] after:transition-all peer-checked:after:left-auto peer-checked:after:right-[5px]'
              />
              <span className={`ml-4 text-xl text-white ${showPastEvent && 'text-white'}`}>
                Past
              </span>
            </label>
          </div>
          <div className="flex items-center justify-center gap-x-4">
            <span className={`text-xl text-white ${!showCalendar && 'text-white'}`}>List View</span>
            <label className="inline-flex relative items-center">
              <input type="checkbox" className="sr-only peer" checked={showCalendar} readOnly />
              <divz
                onClick={() => setShowCalendar(!showCalendar)}
                className='relative w-[57px] h-[28px] bg-brand-teal rounded-full cursor-pointer after:content-[""] after:absolute after:top-[4px] after:left-[5px] after:bg-white after:rounded-full after:h-[20px] after:w-[20px] after:transition-all peer-checked:after:left-auto peer-checked:after:right-[5px]'
              />
              <span className={`ml-4 text-xl text-white ${showCalendar && 'text-white'}`}>
                Calendar View
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsDisplay;
