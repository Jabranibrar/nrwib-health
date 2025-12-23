import React, { useState, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import Icon from '@/src/components/Icon';
import NextLink from '@/src/components/NextLink';
import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import { usePathname } from 'next/navigation';
import useAuth from '@/src/hooks/useAuth';
import Link from 'next/link';
import CustomLink from '@/src/components/CustomLink';
import Image from 'next/image';

const ResourcesListing = ({ topics, cta_link, cta_title }) => {
  const { loggedIn } = useAuth();
  const pathname = usePathname();

  const [inputValue, setInputValue] = useState('');
  const [getAll, setGetAll] = useState('');

  const [activeTopic, setActiveTopic] = useState(
    getAll || topics?.find((topic) => topic.children?.nodes?.length > 0)?.name
  );

  useEffect(() => {
    const explodedPath = pathname.split('/');

    if (explodedPath.length >= 2) {
      const activeTopicSlug = explodedPath.at(-2);
      const actualTopic = topics?.find((t) => t.slug === activeTopicSlug);
      if (actualTopic) {
        setActiveTopic(actualTopic.name);
      }
      if (getAll === 'all') {
        setActiveTopic('all');
      }
    }
  }, [pathname, topics, getAll]);

  const actionTopicsNames = [...new Set(topics?.map((topic) => topic?.name)?.flat())];

  const [selectedActionTeam, setSelectedActionTeam] = useState(null);

  const actionTeamsDesc =
    topics?.flatMap((topic) => ({
      name: topic?.name,
      description: topic?.description
    })) || [];
  const selectedDescription = actionTeamsDesc.find(
    (team) => team?.name === selectedActionTeam
  )?.description;

  let allResultsCount;

  if (inputValue && selectedActionTeam) {
    allResultsCount = useMemo(() => {
      let filtered = topics || [];
      filtered = filtered?.filter(
        (member) =>
          member?.name === selectedActionTeam &&
          member?.name?.toLowerCase()?.includes(inputValue?.toLowerCase())
      );

      const getResultsCount = (name) => {
        const topicWithDetails = topics.find((topic) => topic.name === name);
        return topicWithDetails?.children?.nodes?.filter(
          (subtopic) => {
            const subtopicMatches = subtopic?.name
              ?.toLowerCase()
              .includes(inputValue.toLowerCase());
            const resourcesMatch = subtopic?.resources?.nodes?.some((resource) =>
              resource.title.toLowerCase().includes(inputValue.toLowerCase())
            );
            const resourcesMatchLength = subtopic.resources?.nodes?.filter((resource) =>
              resource.title.toLowerCase().includes(inputValue.toLowerCase())
            ).length;
            return (subtopicMatches || resourcesMatch) && resourcesMatchLength > 0;
          }
          // subtopic.name.toLowerCase().includes(inputValue.toLowerCase()) &&
          // subtopic.resources?.nodes?.length > 0
        );
      };
      const searchData = getResultsCount(selectedActionTeam);
      return searchData || [];
    }, [topics, selectedActionTeam, inputValue]);
  } else if (inputValue) {
    allResultsCount = useMemo(() => {
      let filtered = topics || [];

      filtered = filtered?.flatMap((member) =>
        member?.children?.nodes?.filter(
          (subtopic) => {
            const subtopicMatches = subtopic?.name
              ?.toLowerCase()
              .includes(inputValue.toLowerCase());
            const resourcesMatch = subtopic?.resources?.nodes?.some((resource) =>
              resource.title.toLowerCase().includes(inputValue.toLowerCase())
            );
            const resourcesMatchLength = subtopic.resources?.nodes?.filter((resource) =>
              resource.title.toLowerCase().includes(inputValue.toLowerCase())
            ).length;
            return (subtopicMatches || resourcesMatch) && resourcesMatchLength > 0;
          }
          // list?.name?.toLowerCase()?.includes(inputValue?.toLowerCase())
        )
      );

      return filtered || [];
    }, [topics, inputValue]);
  } else {
    allResultsCount = useMemo(() => {
      let filtered = topics || [];

      if (selectedActionTeam) {
        filtered = filtered?.filter((member) => member?.name === selectedActionTeam);
      }

      return filtered?.map((i) => i?.children?.nodes)?.flat() || [];
    }, [topics, selectedActionTeam, inputValue]);
  }

  useEffect(() => {
    if (inputValue) {
      setSelectedActionTeam(null);
    } else {
      setSelectedActionTeam(actionTopicsNames?.[0]);
    }
  }, [inputValue]);

  return (
    <section className={clsx('pt-5 pb-20')} data-testid="resources-listing">
      <div className="container">
        <div className="flex flex-col lg:flex-row items-start gap-10">
          <Filters
            inputValue={inputValue}
            setInputValue={setInputValue}
            activeTopic={activeTopic}
            setActiveTopic={setActiveTopic}
            topics={topics}
            actionTopicsNames={actionTopicsNames}
            setSelectedActionTeam={setSelectedActionTeam}
            selectedActionTeam={selectedActionTeam}
            getAll={getAll}
            setGetAll={setGetAll}
          />
          <div className="lg:w-[70%] w-full">
            <div className="bg-brand-neutral-2 p-10">
              <Heading type="h2" otherClasses="font-medium text-brand-royal-blue font-manrope">
                {selectedActionTeam ? `${selectedActionTeam}` : 'All Resources'}
              </Heading>
              {selectedDescription && (
                <HtmlBlock
                  content={selectedDescription}
                  className="text-p2 font-manrope font-normal mt-5 [&>p>strong]:!text-brand-black"
                />
              )}
            </div>
            <Resources
              activeTopic={activeTopic}
              topics={topics}
              selectedActionTeam={selectedActionTeam}
              inputValue={inputValue}
              ctaLink={cta_link}
              ctaTitle={cta_title}
              loggedIn={loggedIn}
              allResultsCount={allResultsCount}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourcesListing;

const Filters = ({
  inputValue,
  setInputValue,
  topics,
  actionTopicsNames,
  setSelectedActionTeam,
  selectedActionTeam
}) => {
  const getResultsCount = (name) => {
    const topicWithDetails = topics.find((topic) => topic.name === name);
    return (
      topicWithDetails?.children?.nodes?.reduce((total, subtopic) => {
        const subtopicMatches = subtopic.name.toLowerCase().includes(inputValue.toLowerCase());
        const resourcesMatch = subtopic.resources?.nodes?.some((resource) =>
          resource.title.toLowerCase().includes(inputValue.toLowerCase())
        );
        const resourcesMatchLength = subtopic.resources?.nodes?.filter((resource) =>
          resource.title.toLowerCase().includes(inputValue.toLowerCase())
        ).length;
        if (subtopicMatches || resourcesMatch) {
          return total + (resourcesMatchLength || 0);
        }
        return total;
      }, 0) || 0
    );
  };

  // search all results

  const allResultsCount = useMemo(() => {
    if (!inputValue) return 0; // Return 0 if there's no input

    return topics.reduce((total, member) => {
      const topicCount = member.children.nodes.reduce((subTotal, subtopic) => {
        const subtopicMatches = subtopic.name.toLowerCase().includes(inputValue.toLowerCase());
        const resourcesMatch = subtopic.resources.nodes.some((resource) =>
          resource.title.toLowerCase().includes(inputValue.toLowerCase())
        );
        const resourcesMatchLength = subtopic.resources?.nodes?.filter((resource) =>
          resource.title.toLowerCase().includes(inputValue.toLowerCase())
        ).length;
        return subtopicMatches || resourcesMatch
          ? subTotal + resourcesMatchLength
          : subTotal;
      }, 0);
      return total + topicCount;
    }, 0);
  }, [topics, inputValue]);

  return (
    <div className="bg-brand-royal-blue transition-all flex flex-col w-full lg:w-[30%] pt-5">
      <div className="border-b border-b-white/10 mb-3">
        <div className="relative w-full pb-3 px-5">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            type="text"
            placeholder="Search by Keyword"
            className="border-b-solid w-full border border-white bg-transparent py-4 px-3 text-p4 text-white outline-none placeholder:text-white font-manrope rounded-lg"
          />
          {inputValue ? (
            <button onClick={() => setInputValue('')}>
              <Icon icon="cross-icon-white" otherClasses="absolute right-8 top-[0.8rem]" />
            </button>
          ) : (
            <Icon icon="search-icon-teal" otherClasses="absolute right-7 top-[0.9rem]" />
          )}
        </div>

        {inputValue && (
          <div className="flex justify-start items-center gap-4 flex-wrap px-5 py-3">
            <div className="rounded-[2rem] bg-white flex justify-center items-center w-fit gap-2 pl-3 pr-2 pt-[0.375rem] pb-2">
              <span className="text-brand-royal-blue text-p3 font-semibold">{inputValue}</span>
              <Image
                alt="cross"
                width={20}
                height={20}
                className="h-5 w-5 cursor-pointer"
                src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/09/cross.svg"
                onClick={() => setInputValue('')}
              />
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col">
        {inputValue && (
          <div
            onClick={() => setSelectedActionTeam(null)}
            className={clsx(
              'font-manrope cursor-pointer py-3 text-p3 transition-all w-full text-start font-normal px-5 border-b border-b-white/10  flex items-center justify-between',
              selectedActionTeam === null
                ? 'bg-brand-teal text-white'
                : 'bg-brand-royal-blue text-white',
              'hover:bg-brand-teal hover:text-white'
            )}
          >
            <span>{inputValue ? 'View All Results' : 'All Resources'}</span>

            <div className="w-8 h-8 rounded-full bg-brand-green flex items-center justify-center">
              {allResultsCount}
            </div>
          </div>
        )}

        {actionTopicsNames.map((topic, index) => (
          <div
            key={index}
            onClick={() => setSelectedActionTeam(topic)}
            className={clsx(
              'font-manrope cursor-pointer py-3 text-p3 transition-all w-full text-start font-normal px-5 border-b border-b-white/10 flex justify-between gap-5',
              selectedActionTeam === topic
                ? 'bg-brand-teal text-white'
                : 'bg-brand-royal-blue text-white',
              'hover:bg-brand-teal hover:text-white'
            )}
          >
            <span>{topic}</span>
            <span className="text-p3 text-white bg-brand-green rounded-full h-8 w-8 flex justify-center items-center">
              {getResultsCount(topic) || 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Resources = ({ ctaLink, ctaTitle, loggedIn, allResultsCount, inputValue }) => {
  const [activeSubtopic, setActiveSubtopic] = useState(null);

  return (
    <div className="flex flex-wrap mt-10 animate__animated animate__fadeInRight">
      {allResultsCount?.length === 0 ? (
        <div className="font-manrope w-full opacity-100">
          <span className="block w-full text-center p-5 text-p2 bg-brand-neutral-3">
            There are no results for that search, please try again.
          </span>
        </div>
      ) : (
        allResultsCount?.map((subtopic) => (
          <div
            key={subtopic?.id}
            className="w-full flex flex-col border-b border-b-brand-neutral-5 py-5"
          >
            <div
              className="w-full flex items-center justify-between cursor-pointer"
              onClick={() =>
                setActiveSubtopic(activeSubtopic === subtopic?.id ? null : subtopic?.id)
              }
            >
              <div>
                <div className="text-p1 font-manrope font-normal text-brand-royal-blue">
                  {subtopic?.name}
                </div>
                {/* {subtopic?.description && (
                  <HtmlBlock
                    content={subtopic.description}
                    className="text-p2 font-normal font-manrope mt-5"
                  />
                )} */}
              </div>
              <Icon
                icon="sky-blue-right-arrow"
                iconWidth={20}
                iconHeight={20}
                otherClasses={clsx(
                  'transition-transform transform mt-1',
                  activeSubtopic === subtopic?.id ? 'rotate-90' : 'rotate-0'
                )}
              />
            </div>
            {activeSubtopic === subtopic?.id && (
              <div className="p-5 mt-2 pl-10">
                {loggedIn ? (
                  <ul>
                    {subtopic?.resources?.nodes?.map((resource) => (
                      <li
                        key={resource.id}
                        className={clsx(
                          resource.title.toLowerCase().includes(inputValue.toLowerCase())
                            ? ''
                            : 'hidden'
                        )}
                      >
                        <div className="my-5">
                          <NextLink
                            href={
                              resource.resourcesFieldGroup?.url ||
                              resource.resourcesFieldGroup?.uploadFile?.node?.sourceUrl
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            otherClasses="text-brand-teal text-p2"
                          >
                            {resource.title}
                          </NextLink>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="bg-brand-teal py-10 text-center">
                    <Heading
                      type="h2"
                      otherClasses="font-bold text-brand-white text-p1 font-manrope mb-6"
                    >
                      {ctaTitle}
                    </Heading>
                    <CustomLink
                      variant="green-right-arrow"
                      anchor={ctaLink}
                      otherClasses="mb-6 mx-auto"
                    />
                    <Link
                      className="text-white font-semibold text-p2 pb-2 border-b-2 border-brand-green"
                      href="/member-portal"
                    >
                      Already a Member? Log in
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};
