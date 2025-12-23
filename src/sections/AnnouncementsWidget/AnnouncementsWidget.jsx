import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import HtmlBlock from '@/src/components/HtmlBlock';
import { FiChevronRight, FiChevronDown } from 'react-icons/fi';
import Icon from '@/src/components/Icon';
import DateRangeInput from '@/src/components/DateRangeInput';
import SelectInput from '@/src/components/SelectInput';
import Loading from '@/src/components/Loading';
import styles from './AnnouncementsWidget.module.scss';
import { decode } from 'html-entities';

let timerId = undefined;
let timeout = 500;

function queryHook(query, search) {
  if (timerId) {
    clearTimeout(timerId);
  }

  timerId = setTimeout(() => search(query), timeout);
}

// Utility function to remove HTML tags
function stripHtmlTags(str) {
  return str.replace(/<\/?[^>]+(>|$)/g, ''); // Regex to remove HTML tags
}

function formatTimestamp(timestamp) {
  const timestampMoment = moment.unix(timestamp); // Convert timestamp to moment object
  const currentDay = moment(); // Get current date

  // Check if the timestamp is today
  if (timestampMoment.isSame(currentDay, 'day')) {
    return (
      <div>
        Today <br /> {timestampMoment.format('hh:mm A')}
      </div>
    ); // Example: Today 03:00 PM
  } else {
    return (
      <div>
        {timestampMoment.format('MMMM D')} <br /> {timestampMoment.format('YYYY')}
      </div>
    ); // Example: June 18, 2024
  }
}

const Filters = ({ ...props }) => {
  const { hits, isLastPage, showMore } = useInfiniteHits();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filterByDate, setFilterByDate] = useState(null);
  const { refine, clear } = useSearchBox({ ...props, queryHook });

  const { refine: refineByDateTimestamp } = useRange({
    attribute: 'date_timestamp'
  });

  const inputRef = useRef(null);
  const [inputValue, setInputValue] = useState('');

  const onDatesChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);
    // let timestampStartDate = startDate ? Math.floor(new Date(startDate)) : null;
    // let timestampEndDate = endDate ? Math.floor(new Date(endDate)) : null;
    // console.log('timestampStartDate', timestampStartDate);

    // refineByDateTimestamp([
    //   Number.isFinite(timestampStartDate) ? timestampStartDate : undefined,
    //   Number.isFinite(timestampEndDate) ? timestampEndDate : undefined
    // ]);

    if (startDate && endDate) {
      const filteredEvents = hits?.filter((event) => {
        const eventDate = moment(event.post_date, 'MMMM D, YYYY'); // Ensure the correct format is used
        return eventDate.isBetween(startDate, endDate, 'days', '[]'); // inclusive of start and end
      });
      setFilterByDate(filteredEvents);
    }
    if (startDate && endDate === null) {
      const filteredEvents = hits?.filter((event) => {
        const eventDate = moment(event?.post_date, 'MMMM D, YYYY'); // Adjust format as needed
        return eventDate.isSame(startDate, 'day');
      });
      setFilterByDate(filteredEvents);
    }
    if (endDate && startDate === null) {
      const filteredEvents = hits?.filter((event) => {
        const eventDate = moment(event?.post_date, 'MMMM D, YYYY'); // Adjust format as needed
        return eventDate.isSame(endDate, 'day');
      });
      setFilterByDate(filteredEvents);
    }
    if (endDate === null && startDate === null) {
      setFilterByDate(hits);
    }
  };

  useEffect(() => {
    const setFilteredEventsData = () => {
      let eventsToSet;

      if (startDate && endDate) {
        if (inputValue.length === 0) {
          eventsToSet = filterByDate;
        } else {
          eventsToSet = filterByDate?.filter((event) => {
            const title = stripHtmlTags(event.post_title).toLowerCase();
            const description = stripHtmlTags(event.description).toLowerCase();
            const combinedText = `${title} ${description}`.trim();
            return combinedText.includes(inputValue.toLowerCase());
          });
        }
      }
      if (endDate && startDate === null) {
        if (inputValue.length === 0) {
          eventsToSet = filterByDate;
        } else {
          eventsToSet = filterByDate?.filter((event) => {
            const title = stripHtmlTags(event.post_title).toLowerCase();
            const description = stripHtmlTags(event.description).toLowerCase();
            const combinedText = `${title} ${description}`.trim();
            return combinedText.includes(inputValue.toLowerCase());
          });
        }
      }
      if (endDate === null && startDate) {
        if (inputValue.length === 0) {
          eventsToSet = filterByDate;
        } else {
          eventsToSet = filterByDate?.filter((event) => {
            const title = stripHtmlTags(event.post_title).toLowerCase();
            const description = stripHtmlTags(event.description).toLowerCase();
            const combinedText = `${title} ${description}`.trim();
            return combinedText.includes(inputValue.toLowerCase());
          });
        }
      }
      if (endDate === null && startDate === null) {
        if (inputValue.length === 0) {
          eventsToSet = hits;
        } else {
          eventsToSet = hits?.filter((event) => {
            const title = stripHtmlTags(event.post_title).toLowerCase();
            const description = stripHtmlTags(event.description).toLowerCase();
            const combinedText = `${title} ${description}`.trim();
            return combinedText.includes(inputValue.toLowerCase());
          });
        }
      }

      props?.setAllEventsData(eventsToSet);
    };

    setFilteredEventsData();
  }, [inputValue, startDate, endDate, hits, filterByDate]);

  // useEffect(() => {
  //   if (inputValue.length === 0) {
  //     clear();
  //   } else {
  //     refine(inputValue);
  //   }
  // }, [inputValue, refine, clear]);

  // console.log('endDate', endDate);

  return (
    <div className={'relative'}>
      <div className="flex gap-x-8 gap-y-4 justify-center flex-wrap">
        <DateRangeInput
          rootClasses="w-full lg:w-fit min-w-[280px] text-lg"
          otherClasses="pl-6 h-[58px]"
          startDate={startDate}
          endDate={endDate}
          onDatesChange={onDatesChange}
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
      </div>
    </div>
  );
};

const AnnouncementsResults = ({ allEventsData }) => {
  const { hits, isLastPage, showMore } = useInfiniteHits();
  const { status } = useInstantSearch();
  const noResMessage = 'There are no results for your search, please try again.';
  const [activeAccordion, setActiveAccordion] = useState(null);
  const accordionRefs = useRef([]);
  const handleAccordionClick = (index) => {
    if (activeAccordion === index) {
      setActiveAccordion(null);
    } else {
      setActiveAccordion(index);
      setTimeout(() => {
        // Get the accordion element
        const element = accordionRefs.current[index];
        const headerOffset = 45; // Offset for any fixed header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        // Scroll to the calculated position
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }, 10); // 1000ms delay
    }
  };


  return (
    <>
      {allEventsData?.length ? (
        <div className={'announcements-list relative bg-brand-blue pt-16 pb-10'}>
          <div className={'container mx-auto'}>
            {allEventsData.map(
              (
                {
                  post_title = '',
                  ID = '',
                  slug = '',
                  post_date = '',
                  sort_by_date = '',
                  description = '',
                  link = '',
                  link_title = ''
                },
                index
              ) => {
                const isActive = activeAccordion === index;
                const cleanDescription = stripHtmlTags(description);
                const previewDescription = cleanDescription.slice(0, 240); // Show first 100 characters as preview

                return (
                  <div
                    key={ID}
                    ref={(el) => (accordionRefs.current[index] = el)}
                    className={`group flex items-baseline mb-6 overflow-hidden p-4 accordion cursor-pointer hover:bg-brand-teal ${isActive ? 'bg-brand-teal' : 'bg-white'} transition-colors`}
                    onClick={() => handleAccordionClick(index)}
                  >
                    <div className={'p-4 date block min-w-[10rem]'}>
                      <p
                        className={`text-lg ${isActive ? 'text-white' : 'text-brand-dark-grey'} group-hover:text-white`}
                      >
                        {formatTimestamp(sort_by_date)}
                      </p>
                    </div>
                    <div
                      className={`w-full py-6 px-6 flex items-center border-l ${isActive ? 'border-white' : 'border-brand-neutral-6'} group-hover:border-white`}
                    >
                      <div className={'relative block w-full'}>
                        <div className={'flex justify-between gap-x-8'}>
                          <p
                            className={`text-h4 mb-4 font-semibold cursor-pointer ${isActive ? 'text-white' : 'text-brand-royal-blue'} group-hover:text-white`}
                          >
                            {post_title}
                          </p>
                          {isActive ? (
                            <FiChevronDown
                              className={`${isActive ? 'text-white' : 'text-brand-blue-sky'} group-hover:text-white`}
                              size={28}
                            />
                          ) : (
                            <FiChevronRight
                              className={`${isActive ? 'text-white' : 'text-brand-blue-sky'} group-hover:text-white`}
                              size={28}
                            />
                          )}
                        </div>
                        <div className={'description-and-cta'}>
                          {isActive ? (
                            <>
                              <HtmlBlock
                                content={decode(description)}
                                className={`${styles.descriptionStyle} text-p2 font-manrope font-normal ${isActive ? 'text-white' : 'text-brand-black-200'} group-hover:text-white`}
                              />
                              {link && (
                                <a href={link} className="green-right-arrow-button mt-8 block">
                                  {link_title || 'Read More'}
                                  <Icon icon="button-arrow-icon" iconHeight={26} iconWidth={26} />
                                </a>
                              )}
                            </>
                          ) : (
                            <p
                              className={`text-p2 font-manrope font-normal ${isActive ? 'text-white' : 'text-brand-black-200'} group-hover:text-white`}
                            >
                              {decode(previewDescription)}...
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
            {/* Show More Button */}
            {!isLastPage && (
              <div className="text-center mt-6">
                <button
                  className="bg-brand-blue-sky text-white px-4 py-2 flex items-center"
                  onClick={showMore}
                >
                  Load More
                  <Icon icon="button-arrow-icon" iconHeight={26} iconWidth={26} />
                </button>
              </div>
            )}
          </div>
        </div>
      ) : status === 'idle' ? (
        <div className={'bg-brand-gray-200 pt-10 pb-10'}>
          <div className="max-w-screen-xxl mx-auto px-4 flex justify-center">
            <div className="bg-brand-gray-200 w-full text-2xl text-center">{noResMessage}</div>
          </div>
        </div>
      ) : (
        <div className={'w-full bg-brand-blue flex justify-center items-center min-h-[550px]'}>
          <Loading />
        </div>
      )}
    </>
  );
};

export const AnnouncementsWidget = (props) => {
  const { otherClasses, id = '' } = props || {};
  const announcementsClasses = clsx(otherClasses, 'bg-brand-white');

  const [allEventsData, setAllEventsData] = useState(null);

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
        per_page: '*',
        query_by: 'post_title, description',
        sort_by: '_text_match:desc, date_timestamp:desc',
        typo_tokens_threshold: 0
      }
    });

    const searchClient = typesenseInstantsearchAdapter.searchClient;

    return searchClient;
  }, []);

  return (
    <section id={id} className={announcementsClasses} data-testid="announcements-widget">
      <div className="mx-auto">
        <InstantSearch
          future={{ preserveSharedStateOnUnmount: true }}
          indexName="announcement"
          searchClient={searchClient}
        >
          <Configure queryByWeights="1" dropTokensThreshold={0} numTypos={2} hitsPerPage={200} />
          <div className="bg-brand-royal-blue overflow-visible">
            <div className={clsx('max-w-screen-xxl mx-auto lg:px-32 px-4 py-12 overflow-visible')}>
              <Filters
                {...props}
                setAllEventsData={setAllEventsData}
                allEventsData={allEventsData}
              />
            </div>
          </div>
          <AnnouncementsResults allEventsData={allEventsData} />
        </InstantSearch>
      </div>
    </section>
  );
};

export default AnnouncementsWidget;
