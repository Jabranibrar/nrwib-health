import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Configure,
  InstantSearch,
  InstantSearchSSRProvider,
  useInfiniteHits,
  useInstantSearch,
  useMenu,
  useSearchBox
} from 'react-instantsearch';
import TypesenseInstantsearchAdapter from 'typesense-instantsearch-adapter';
import React from 'react';
import Icon from '@/src/components/Icon';
import NextLink from '@/src/components/NextLink';
import NextImage from '@/src/components/NextImage';
import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';

const TeamsListing = (props) => {
  const { serverState, departments, sortOrders } = props;
  const [inputValue, setInputValue] = useState('');

  const pathname = usePathname();

  const activeDeptSlug = pathname?.split('/')[3] || null;

  const departmentsWithDetails = props.departments;

  const [activeDepartment, setActiveDepartment] = useState(null);

  const departmentWithDetails = departmentsWithDetails?.find(
    (dept) => dept.name === activeDepartment
  );

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
        ],
        connectionTimeoutSeconds: 60
      },
      additionalSearchParameters: {
        query_by: 'post_title,post_content,designation,industry_partner',
        sort_by: '_text_match:desc, wp_order:asc',
        typo_tokens_threshold: 0
      }
    });

    const searchClient = typesenseInstantsearchAdapter.searchClient;

    return searchClient;
  }, []);

  return (
    <section className={clsx(`pt-5 pb-20`)} data-testid="teams-listing">
      <div className="container">
        <InstantSearchSSRProvider {...serverState}>
          <InstantSearch
            future={{ preserveSharedStateOnUnmount: true }}
            indexName="team-members"
            searchClient={searchClient}
          >
            <div className="flex flex-col lg:flex-row items-start gap-10">
              <Filters
                activeDepartment={activeDepartment}
                setActiveDepartment={setActiveDepartment}
                setInputValue={setInputValue}
                inputValue={inputValue}
                {...props}
              />

              <div className="lg:w-[70%]">
                <div className="bg-brand-neutral-2 p-10">
                  <Heading type="h2" otherClasses="font-medium text-brand-royal-blue font-manrope">
                    {activeDepartment === null ? 'All Members' : departmentWithDetails?.name}
                  </Heading>
                  {departmentWithDetails?.description && (
                    <HtmlBlock
                      content={departmentWithDetails?.description}
                      className="[&>strong]:!text-brand-black-200 text-p2 font-manrope font-normal mt-5"
                    />
                  )}
                </div>
                <Configure hitsPerPage={250} />
                <TeamMembers
                  {...props}
                  sortOrders={sortOrders}
                  activeDepartment={activeDepartment}
                  inputValue={inputValue}
                />
              </div>
            </div>
          </InstantSearch>
        </InstantSearchSSRProvider>
      </div>
    </section>
  );
};

export default TeamsListing;

const Filters = (props) => {
  const { activeDepartment, setActiveDepartment, setInputValue, inputValue } = props;
  const { refine, clear } = useSearchBox({ ...props, queryHook });
  const pathname = usePathname();

  const { items: departments, refine: refineByDepartments } = useMenu({
    attribute: 'departments',
    limit: 100,
    sortBy: ['name:desc']
  });

  const departmentsToShow = props.departments.map((department) => {
    return {
      ...department,
      ...departments.find((dept) => dept.value === department.name)
    };
  });

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputValue?.length === 0) {
      clear();
    } else {
      refine(inputValue);
    }
  }, [inputValue, refine, clear]);

  useEffect(() => {
    if (inputValue) {
      setActiveDepartment(null);
    } else {
      setActiveDepartment(departmentsToShow?.[0]?.name);
    }
  }, [inputValue]);

  const activeTab = pathname?.split('/')[3] || null;

  useEffect(() => {
    const activeTab = pathname?.split('/')[3] || null;

    if (activeTab) {
      const departmentName = props.departments.find((dept) => dept.slug === activeTab)?.name;

      refineByDepartments(departmentName);
      setActiveDepartment(departmentName);
    }
  }, [pathname, refineByDepartments, setActiveDepartment]);

  return (
    <div className="bg-brand-royal-blue transition-all flex flex-col w-full lg:w-[30%] pt-5">
      <div className="relative w-full pb-5 border-b border-b-white/10 px-5">
        <input
          ref={inputRef}
          spellCheck={false}
          maxLength={512}
          autoComplete="off"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          autoCorrect="off"
          autoCapitalize="off"
          type="text"
          placeholder="Search by Keyword"
          className="border-b-solid w-full border border-white bg-transparent py-4 px-3 text-p4 text-white outline-none placeholder:text-white font-manrope rounded-lg"
        />

        {inputValue ? (
          <button
            onClick={() => setInputValue('')}
            tabIndex="0"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setInputValue('');
              }
            }}
          >
            <Icon icon="cross-icon-white" otherClasses="absolute right-8 top-[0.8rem]" />
          </button>
        ) : (
          <Icon icon="search-icon-teal" otherClasses="absolute right-7 top-[0.9rem]" />
        )}
      </div>

      <div className="flex flex-col">
        {inputValue && (
          <div
            onClick={() => setActiveDepartment(null)}
            className={clsx(
              'font-manrope cursor-pointer py-3 text-p3 transition-all w-full text-start font-normal px-5 border-b border-b-white/10',
              activeDepartment === null
                ? 'bg-brand-teal text-white'
                : 'bg-brand-royal-blue text-white',
              'hover:bg-brand-teal hover:text-white'
            )}
          >
            <span>{inputValue ? 'View All Results' : 'All Members'}</span>
          </div>
        )}

        {departmentsToShow.map((department) => (
          <div
            key={department.id}
            onClick={() => setActiveDepartment(department.name)}
            className={clsx(
              'font-manrope cursor-pointer py-3 text-p3 transition-all w-full text-start font-normal px-5 border-b border-b-white/10 flex items-center justify-between',
              department.value === activeTab || department.value === activeDepartment
                ? 'bg-brand-teal text-white'
                : 'bg-brand-royal-blue text-white',
              'hover:bg-brand-teal hover:text-white',
              Number(department.count) > 0 ? '' : 'hidden'
            )}
          >
            {department.name}
            <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center">
              {Number(department.count || 0)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function filteredHitsByDepartment(filteredHits, activeDepartment, sortOrders) {
  let orderArray;
  switch (activeDepartment) {
    case 'Education Pipeline':
      orderArray = sortOrders?.educationPipelineOrder?.nodes;
      break;
    case 'Building Awareness':
      orderArray = sortOrders?.buildingAwarenessOrder?.nodes;
      break;
    case 'Creating Experiences':
      orderArray = sortOrders?.creatingExperiencesOrder?.nodes;
      break;
    case 'Leadership Team':
      orderArray = sortOrders?.leadershipTeamOrder?.nodes;
      break;
  }
  console.log(orderArray)
  if (orderArray) {
    const orderMap = Object.fromEntries(orderArray?.map((item, index) => [item.title, index]));
    filteredHits.sort((a, b) => (orderMap[a.post_title] ?? Infinity) - (orderMap[b.post_title] ?? Infinity));
  }

  return filteredHits;
}

const TeamMembers = ({ props, activeDepartment, inputValue, sortOrders }) => {
  const { hits, results } = useInfiniteHits(props);
  const { status } = useInstantSearch();

  let allResultsCount = useMemo(() => {
    if (!hits) return [];

    // Filter by active department
    let filteredHits = activeDepartment
      ? hits.filter(({ departments }) =>
          departments?.some((department) => department === activeDepartment)
        )
      : hits;

    filteredHits = filteredHitsByDepartment(filteredHits, activeDepartment, sortOrders);
    return filteredHits;
    // // Sort by last name
    // return filteredHits.sort((a, b) => {
    //   // Get the name before the comma, if any, and then get the last name
    //   const lastNameA = a.post_title.split(',')?.[0].trim().split(' ').pop().toLowerCase();
    //   const lastNameB = b.post_title.split(',')?.[0].trim().split(' ').pop().toLowerCase();
    //   // Compare last names
    //   return lastNameA.localeCompare(lastNameB);
    // });
  }, [hits, activeDepartment]);

  if (status === 'loading' || status === 'stalled') return <div className="h-[50vh]"></div>;

  return (
    <div>
      <div className={`font-manrope ${'idle' === status ? 'opacity-100' : 'opacity-0'}`}>
        {(results?.nbHits === 0 || allResultsCount?.length === 0) && (
          <span className="block w-full text-center py-5 text-p2 bg-brand-neutral-3 my-10">
            There are no results for that search, please try again.
          </span>
        )}
      </div>

      <div className="flex gap-10 flex-wrap mt-10">
        {allResultsCount.map((member) => {
          if (!member) return undefined;

          return (
            <NextLink
              key={`member-${member.id}`}
              href={`/about/team/${member.slug}`}
              otherClasses={`${!!!member.hide_bio ? '' : 'pointer-events-none'} w-full animate__animated animate__fadeInRight sm:w-[48%] md:w-[30%] lg:w-[24%] min-w-[47%] items-stretch flex justify-between flex-col relative py-5 p-5 mb-10 group transition-all duration-500 hover:scale-[1.1] border border-brand-neutral-5`}
            >
              <div className={' h-full'}>
                <div className={'relative flex items-center justify-center bg-brand-neutral-2'}>
                  {member.post_thumbnail ? (
                    <NextImage
                      alt=""
                      url={member.post_thumbnail}
                      width={1000}
                      height={1000}
                      otherClasses="w-full h-auto w-[18rem] md:w-full md:h-[18rem] object-cover object-left sm:object-cover xs:h-[21rem] xs:object-cover xs:object-center"
                    />
                  ) : (
                    <NextImage
                      url={
                        'https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/eIOE_1.svg'
                      }
                      alt=""
                      width={1000}
                      height={1000}
                      otherClasses="w-full h-auto w-[10rem] md:w-full md:h-[18rem] object-contain object-center px-10 pt-10"
                    />
                  )}
                </div>
                <div className="mt-5 flex flex-1 flex-col items-center justify-center md:items-start md:justify-start gap-2 text-white">
                  <div className="text-p1 text-brand-royal-blue font-bold font-manrope">
                    {member.post_title}
                  </div>
                  <div className="text-p4 text-black text-center md:text-start lg:w-full font-manrope font-medium">
                    {member.designation}
                  </div>
                  <div className="text-p4 text-brand-dark-grey text-center md:text-start lg:w-full font-manrope font-normal">
                    {member.industry_partner}
                  </div>
                  <div className="text-p4 font-semibold text-brand-dark-grey font-manrope underline">
                    {member.email}
                  </div>
                  {/*Hide Read Bio link*/}
                  { !!!member.hide_bio ? <div className="mt-5">
                      <div className="flex items-center justify-center text-black font-manrope border-b-2 border-b-brand-green font-normal text-p4">
                        Read Bio
                        <Icon icon="chevron-right" />
                      </div>
                    </div> : <></>
                  }
                </div>
              </div>
            </NextLink>
          );
        })}
      </div>
    </div>
  );
};


let timerId = undefined;
let timeout = 500;

function queryHook(query, search) {
  if (timerId) {
    clearTimeout(timerId);
  }

  timerId = setTimeout(() => search(query), timeout);
}
