import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Configure,
  InstantSearch,
  InstantSearchSSRProvider,
  useInfiniteHits,
  useInstantSearch,
  useSearchBox
} from 'react-instantsearch';
import TypesenseInstantsearchAdapter from 'typesense-instantsearch-adapter';
import React from 'react';
import Icon from '@/src/components/Icon';
import NextLink from '@/src/components/NextLink';
import NextImage from '@/src/components/NextImage';
import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import CustomLink from '@/src/components/CustomLink';

const NewsListing = (props) => {
  const { serverState } = props;

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
        query_by: 'post_title,post_content,news_content',
        sort_by: 'sort_by_date:desc',
        typo_tokens_threshold: 0
      }
    });

    const searchClient = typesenseInstantsearchAdapter.searchClient;

    return searchClient;
  }, []);

  return (
    <section className={clsx(`pt-5 pb-20`)}>
      <div className="container">
        <InstantSearchSSRProvider {...serverState}>
          <InstantSearch
            future={{ preserveSharedStateOnUnmount: true }}
            indexName="news"
            searchClient={searchClient}
          >
            <Configure hitsPerPage={250} />
            <div className="flex flex-col lg:flex-row gap-10">
              <Filters {...props} />
              <div className="bg-brand-neutral-5 w-[1px]"></div>
              <News {...props} />
            </div>
          </InstantSearch>
        </InstantSearchSSRProvider>
      </div>
    </section>
  );
};

export default NewsListing;

const Filters = (props) => {
  const { refine, clear } = useSearchBox({ ...props, queryHook });

  const inputRef = useRef(null);

  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (inputValue.length === 0) {
      clear();
    } else {
      refine(inputValue);
    }
  }, [inputValue, refine, clear]);

  return (
    <div className="transition-all flex flex-col w-full lg:w-[30%]">
      <div className="relative w-full pb-5 border-b border-b-white/10">
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
          className="border-b-solid w-full border border-brand-neutral-5 bg-transparent py-4 px-3 text-p4 text-brand-darker outline-none placeholder:text-brand-darker font-manrope rounded-lg"
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
          >
            <Icon icon="cross-icon-blue" otherClasses="absolute right-6 top-[0.8rem]" />
          </button>
        ) : (
          <Icon icon="search-icon-teal" otherClasses="absolute right-7 top-[0.9rem]" />
        )}
      </div>

      <CallToActionSection {...props} />
    </div>
  );
};

const News = (props) => {
  const { hits, results } = useInfiniteHits(props);

  const { status } = useInstantSearch();

  let data = [...hits];

  if (status === 'loading' || status === 'stalled')
    return <div className="w-full lg:w-[70%] h-[50vh]"></div>;

  return (
    <div className="w-full lg:w-[70%]">
      <div className={`font-manrope ${'idle' === status ? 'opacity-100' : 'opacity-0'}`}>
        {results?.nbHits === 0 ? (
          <span className="block w-full text-center py-5 text-p2 bg-brand-neutral-3 my-10">
            There are no results for that search, please try again.
          </span>
        ) : results?.nbHits < 2 ? (
          <div className="py-4 mb-6">{`${results?.nbHits} Result`}</div>
        ) : (
          <div className="py-4 mb-6">{`${results?.nbHits} Results`}</div>
        )}
      </div>

      <div className="flex gap-10 flex-wrap">
        {data.map((news) => {
          if (!news) return undefined;
          let thumbnail = news.post_thumbnail;
          if (!thumbnail) thumbnail = news.pdf_thumbnail;
          if (!thumbnail)
            thumbnail = `https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/eIOE_1.svg`;

          let link = `/news/${news.slug}`;
          if (news.pdf) link = news.pdf;

          return (
            <NextLink
              id={news.id}
              key={`news-${news.slug}`}
              href={link}
              shallow
              otherClasses="hover:bg-brand-neutral-5 animate__animated animate__fadeInRight w-full md:w-[45%] items-stretch flex justify-between flex-col relative py-5 p-5 mb-10 group transition-all duration-500 hover:scale-[1.1] bg-brand-neutral-3 min-h-[400px]"
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
                      {news.post_title}
                    </Heading>
                  </div>
                </div>
                <div className=" text-black font-manrope font-normal text-p4">{news.post_date}</div>
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

const CallToActionSection = ({
  cta_button_anchor,
  cta_button_variant,
  cta_title,
  cta_image,
  cta_content
}) => {
  const button = {
    variant: cta_button_variant,
    anchor: cta_button_anchor
  };

  return (
    <section>
      <div className="bg-brand-neutral flex items-center justify-center w-full p-10">
        <NextImage otherClasses="w-[162px] h-auto" {...cta_image} />
      </div>
      <div className="bg-brand-teal p-10 text-center">
        <Heading type="h2" otherClasses="text-h2 font-medium mb-5 text-white text-center">
          {cta_title}
        </Heading>

        <HtmlBlock className="text-p2 font-manrope font-normal text-white" content={cta_content} />

        <div className="flex justify-center mt-5">
          <CustomLink {...button} />
        </div>
      </div>
    </section>
  );
};
