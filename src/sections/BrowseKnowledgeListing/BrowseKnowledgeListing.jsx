import React, { useEffect, useState } from 'react';
import HtmlBlock from '@/src/components/HtmlBlock';
import Icon from '@/src/components/Icon';
import NextLink from '@/src/components/NextLink';
import clsx from 'clsx';
import Heading from '@/src/components/Heading';
import { usePathname } from 'next/navigation';
import NextImage from '@/src/components/NextImage';
import FuzzySearch from 'fuzzy-search';
import Image from 'next/image';
import { useRouter } from 'next/router';

const BrowseKnowledgeListing = (props) => {
  const [inputValue, setInputValue] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const { query } = router;
  const explodedPath = pathname.split('/');

  // Only show topics with resources
  const topics = props.topics.nodes
    .map((resource) => {
      const childrenWithResources = resource.children.nodes.filter(
        (child) => child.resources && child.resources.nodes && child.resources.nodes.length > 0
      );
      return childrenWithResources.length > 0
        ? { ...resource, children: { nodes: childrenWithResources } }
        : null;
    })
    .filter(Boolean);

  const [selectedTopic, setSelectedTopic] = useState(null);

  const [currentTopic, setCurrentTopic] = useState(
    topics.find((topic) => topic.slug === explodedPath.at(-2))?.name ||
      topics?.filter((topic) => topic.children.nodes.length > 0)[0]?.name
  );

  const [showNews, setShowNews] = useState(false);

  useEffect(() => {
    if (explodedPath.length >= 2) {
      const slug = explodedPath.at(-2);

      if (slug === 'news') {
        setShowNews(true);
        return;
      }

      const topic = topics.find((topic) => topic.slug === slug);

      if (topic) setCurrentTopic(topic.name);
    }
  }, []);
  useEffect(() => {
    if (query.search) {
      setInputValue(query.search);
    }
  }, [query.search]);

  useEffect(() => {
    if (inputValue) {
      setSelectedTopic(topics);
    } else {
      setSelectedTopic(topics?.[0]);
    }
  }, [inputValue]);
  return (
    <section className={clsx(`pt-5 pb-20 `)}>
      <div className="container">
        <div className="flex flex-col lg:flex-row items-start gap-10">
          <Filters
            inputValue={inputValue}
            setInputValue={setInputValue}
            topics={topics}
            currentTopic={currentTopic}
            setCurrentTopic={setCurrentTopic}
            selectedTopic={selectedTopic}
            setSelectedTopic={setSelectedTopic}
            showNews={showNews}
            setShowNews={setShowNews}
            news={props.news.nodes}
          />
          <div className="lg:w-[70%]">
            {selectedTopic && (
              <KnowledgeBase
                topics={topics}
                currentTopic={currentTopic}
                inputValue={inputValue}
                showNews={showNews}
                news={props.news.nodes}
              />
            )}

            {showNews && !selectedTopic && (
              <KnowledgeBase showNews={showNews} news={props.news.nodes} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrowseKnowledgeListing;

const Filters = ({
  inputValue,
  setInputValue,
  topics,
  currentTopic,
  setCurrentTopic,
  selectedTopic,
  setSelectedTopic,
  showNews,
  setShowNews,
  news
}) => {
  const [showTopics, setShowTopics] = useState(true);

  const handleTabClick = (topic) => {
    setSelectedTopic(topic);
    setCurrentTopic(topic.name);
    setShowNews(false); // Ensure "News" is deselected when a topic is clicked
  };

  const handleNewsClick = () => {
    setShowNews(true);
    setCurrentTopic(false);
  };

  const matchedNewsCount = news.filter((newsItem) => {
    const lowerInput = inputValue.toLowerCase();
    return (
      newsItem?.title?.toLowerCase()?.includes(lowerInput) ||
      newsItem?.content?.toLowerCase()?.includes(lowerInput)
    );
  }).length;

  return (
    <div className="bg-brand-royal-blue transition-all flex flex-col w-full lg:w-[30%] pt-5">
      <div className="relative w-full pb-5 border-b border-b-white/10 px-5">
        <input
          spellCheck={false}
          maxLength={512}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search by Keyword"
          className="border-b-solid w-full border border-white bg-transparent py-4 px-3 text-p4 text-white outline-none placeholder:text-white font-manrope rounded-lg"
        />
        {inputValue && (
          <button onClick={() => setInputValue('')}>
            <Icon icon="cross-icon-white" otherClasses="absolute right-8 top-[0.8rem]" />
          </button>
        )}
        {!inputValue && (
          <Icon icon="search-icon-teal" otherClasses="absolute right-7 top-[0.9rem]" />
        )}
        {inputValue && (
          <div className="flex justify-start items-center gap-4 flex-wrap py-3">
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
        <div
          className="text-white text-lg cursor-pointer border-b border-b-white/10 py-3 hover:bg-brand-teal hover:text-white px-5"
          onClick={() => setShowTopics(!showTopics)}
        >
          <div className="flex gap-2 items-center">
            <Icon
              icon="sky-blue-right-arrow"
              iconHeight={16}
              iconWidth={16}
              otherClasses={clsx(
                showTopics ? 'transform rotate-90' : 'transform rotate-0',
                'transition-transform duration-300'
              )}
            />
            Resources
          </div>
        </div>

        {showTopics && (
          <div>
            {topics.map((topic) => {
              // Count resources that match the search input
              const matchedResourcesCount = topic.children.nodes.reduce((count, subtopic) => {
                return (
                  count +
                  subtopic.resources.nodes.filter((resource) => {
                    const lowerInput = inputValue.toLowerCase();
                    return (
                      resource.title?.toLowerCase().includes(lowerInput) ||
                      resource.description?.toLowerCase().includes(lowerInput)
                    );
                  }).length
                );
              }, 0);

              // Count total subtopics matching search
              const subtopicsCount = topic.children.nodes.filter((subtopic) =>
                subtopic.resources.nodes.some((resource) => {
                  const lowerInput = inputValue.toLowerCase();
                  return (
                    resource.title?.toLowerCase().includes(lowerInput) ||
                    resource.description?.toLowerCase().includes(lowerInput)
                  );
                })
              ).length;
              return (
                <div
                  key={topic.id}
                  onClick={() => handleTabClick(topic)}
                  className={clsx(
                    'font-manrope cursor-pointer py-3 text-p3 transition-all w-full text-start font-normal px-5 border-b border-b-white/10 flex justify-between items-center text-white hover:bg-brand-teal hover:text-white pl-10',
                    topic.name === currentTopic && !showNews
                      ? 'bg-brand-teal text-white'
                      : 'bg-brand-royal-blue text-white'
                  )}
                >
                  <span>{topic.name}</span>

                  <span className="text-p3 text-white bg-brand-green rounded-full h-8 w-8 flex justify-center items-center">
                    {inputValue
                      ? matchedResourcesCount
                      : topic.children.nodes.reduce(
                          (count, subtopic) => count + (subtopic.resources.nodes.length || 0),
                          0
                        )}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        <div
          className={clsx(
            'text-white text-lg cursor-pointer flex items-center justify-between px-5',
            showNews ? 'bg-brand-teal text-white' : 'hover:bg-brand-teal hover:text-white'
          )}
          onClick={() => handleNewsClick()}
        >
          <div className="flex gap-2 items-center py-3">News</div>
          <span className="text-p3 text-white bg-brand-green rounded-full h-8 w-8 flex justify-center items-center">
            {matchedNewsCount}
          </span>
        </div>
      </div>
    </div>
  );
};

const KnowledgeBase = ({ currentTopic, topics, inputValue, showNews, news }) => {
  if (showNews) {
    const filteredNews = news.filter((newsItem) => {
      const lowerInput = inputValue?.toLowerCase();
      return (
        newsItem?.title?.toLowerCase()?.includes(lowerInput) ||
        newsItem?.content?.toLowerCase()?.includes(lowerInput)
      );
    });
    return (
      <div className="flex flex-wrap animate__animated animate__fadeInRight">
        {filteredNews.length === 0 ? (
          <div className="font-manrope w-full opacity-100">
            <span className="block w-full text-center py-5 text-p2 bg-brand-neutral-3 mb-10">
              There are no results for that search, please try again.
            </span>
          </div>
        ) : (
          filteredNews.map((newsItem) => {
            if (!newsItem) return null;

            let thumbnail = newsItem?.featuredImage?.node?.mediaItemUrl || newsItem.pdf_thumbnail;
            if (!thumbnail)
              thumbnail = `https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/eIOE_1.svg`;

            let link = `/news/${newsItem.slug}`;
            if (newsItem.pdf) link = newsItem.pdf;

            return (
              <NextLink
                key={`news-${newsItem.slug}`}
                target="_blank"
                href={link}
                otherClasses="hover:bg-brand-neutral-5 animate__animated animate__fadeInRight w-full md:w-[50%] flex justify-between flex-col relative py-5 p-5 mb-10 group transition-all duration-500 hover:scale-[1.1] bg-brand-neutral-3 min-h-[400px]"
              >
                <div className={'w-full h-full flex justify-between flex-col gap-3 '}>
                  <div>
                    <div className={'relative flex items-center justify-center bg-brand-neutral-2'}>
                      <NextImage
                        url={thumbnail}
                        width={1000}
                        height={1000}
                        otherClasses="w-full h-[300px] object-cover object-top"
                      />
                    </div>
                    <div className="mt-5 flex flex-1 flex-col items-center justify-center md:items-start md:justify-between gap-2 text-white min-h-[120px]">
                      <Heading
                        type="h3"
                        otherClasses="text-h3 font-medium font-manrope text-brand-royal-blue"
                      >
                        {newsItem.title}
                      </Heading>
                    </div>
                  </div>
                  <div className="text-black font-manrope font-normal text-p4">
                    {new Date(newsItem.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </NextLink>
            );
          })
        )}
      </div>
    );
  }

  const topic = topics.find((topic) => topic.name === currentTopic);
  const subtopics =
    topic?.children.nodes.filter((subtopic) =>
      subtopic.resources.nodes.some((resource) => {
        const lowerInput = inputValue.toLowerCase();
        const matchesTitle = resource.title?.toLowerCase().includes(lowerInput);
        const matchesDescription = resource.description?.toLowerCase().includes(lowerInput);
        return matchesTitle || matchesDescription;
      })
    ) || [];

  if (topic) {
    return (
      <div className="mb-5">
        <div className="bg-brand-neutral-2 p-10">
          <Heading type="h2" otherClasses="font-medium text-brand-royal-blue font-manrope">
            {topic.name}
          </Heading>
          <HtmlBlock
            content={topic.description}
            className="text-p2 font-manrope font-normal mt-5"
          />
        </div>
        <div className="flex flex-wrap mt-5 animate__animated animate__fadeInRight">
          {subtopics.length === 0 ? (
            <div className="font-manrope w-full opacity-100">
              <span className="block w-full text-center py-5 text-p2 bg-brand-neutral-3 mb-10">
                There are no results for that search, please try again.
              </span>
            </div>
          ) : (
            subtopics.map((subtopic) => (
              <SubtopicAccordion key={subtopic.id} subtopic={subtopic} inputValue={inputValue} />
            ))
          )}
        </div>
      </div>
    );
  }

  return null;
};

const SubtopicAccordion = ({ subtopic, inputValue }) => {
  const [activeSubtopic, setActiveSubtopic] = useState(null);

  const handleClick = (subtopicId) => {
    setActiveSubtopic(activeSubtopic === subtopicId ? null : subtopicId);
  };

  return (
    <div className="w-full flex flex-col border-b border-b-brand-neutral-5 py-5">
      <div
        className="w-full flex items-center justify-between cursor-pointer"
        onClick={() => handleClick(subtopic.id)}
      >
        <div>
          <div className="text-p1 font-manrope font-normal text-brand-royal-blue">
            {subtopic.name}
          </div>
          {subtopic.description && (
            <HtmlBlock
              content={subtopic.description}
              className="text-p2 font-normal font-manrope mt-5"
            />
          )}
        </div>
        <Icon
          icon="sky-blue-right-arrow"
          iconWidth={20}
          iconHeight={20}
          otherClasses={clsx(
            'transition-transform transform mt-1',
            activeSubtopic === subtopic.id ? 'rotate-90' : 'rotate-0'
          )}
        />
      </div>

      {activeSubtopic === subtopic.id && (
        <ul>
          {subtopic.resources.nodes.map((resource) => (
            <li
              key={resource.id}
              className={clsx(
                resource.title.toLowerCase().includes(inputValue.toLowerCase()) ? '' : 'hidden'
              )}
            >
              <div className="flex items-center gap-5 my-5 pl-10">
                <NextLink
                  href={
                    resource.resourcesFieldGroup.url ||
                    resource.resourcesFieldGroup.uploadFile.node.sourceUrl
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
      )}
    </div>
  );
};
