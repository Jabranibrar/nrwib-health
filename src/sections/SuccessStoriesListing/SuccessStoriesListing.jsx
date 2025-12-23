import clsx from 'clsx';
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
import HtmlBlock from '@/src/components/HtmlBlock';
import SingleSelect from '@/src/components/SingleSelect';
import Image from 'next/image';
import { XMasonry, XBlock } from "react-xmasonry";

const SuccessStoriesListing = (props) => {
  const { serverState } = props;

  const searchClient = useMemo(() => {
    const typesenseInstantsearchAdapter = new TypesenseInstantsearchAdapter({
      server: {
        apiKey: process.env.NEXT_PUBLIC_TYPESENSE_SEARCH_ONLY_API_KEY,
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
        query_by: 'post_title,',
        sort_by: '_text_match:desc',
        typo_tokens_threshold: 0
      }
    });

    const searchClient = typesenseInstantsearchAdapter.searchClient;

    return searchClient;
  }, []);

  return (
    <section className={clsx(`pt-5 pb-20`)}>
      <InstantSearchSSRProvider {...serverState}>
        <InstantSearch
          future={{ preserveSharedStateOnUnmount: true }}
          indexName="our-success-stories"
          searchClient={searchClient}
        >
          <Filters {...props} />
          <Configure hitsPerPage={250} />
          <Content />
        </InstantSearch>
      </InstantSearchSSRProvider>
    </section>
  );
};

export default SuccessStoriesListing;

const Content = (props) => {
  const [isMounted, setIsMounted] = useState(false);
  const { hits: masonryContent, results } = useInfiniteHits(props);
  const { status } = useInstantSearch();

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);
  return (
    <div className="container">
      <div className="mt-20 relative">
        <div className={`font-manrope ${'idle' === status ? 'opacity-100' : 'opacity-0'}`}>
          {results?.nbHits === 0 && (
            <span className="block w-full text-center py-5 text-p4 bg-brand-neutral-3 my-10">
            There are no results for that search, please try again.
          </span>
          )}
        </div>
        {
          isMounted && masonryContent?.length > 0 ? (
            <XMasonry maxColumns={3} targetBlockWidth={400}>
              {masonryContent?.map((item) => (
                <XBlock key={item.id} width={item.type === "Gallery" ? 2 : 1}>
                  {item.type === "Gallery" && <Stories story={item} />}
                  {item.type === "Video" && <Videos story={item} />}
                </XBlock>
              ))}
            </XMasonry>
          ) : null
        }
      </div>
    </div>
  );
};

const Stories = ({story}) => {

  return (
    <NextLink
      key={story.id}
      href={`/success-stories/${story.slug}`}
      otherClasses={'block p-4'}
    >
      <div className="border border-brand-neutral-5 p-5">
        <div className="flex gap-x-4">
          <div className="w-4/5">
            <div className={"block relative h-[300px]"}>
              <img
                src={story.images_gallery[0]}
                alt={story.images_gallery[0].alt || 'Gallery Image'}
                title={story.images_gallery[0].title || 'Image'}
                className="w-full h-full object-cover object-center"
              />
            </div>
            <div className="flex flex-col gap-10">
              <HtmlBlock
                content={story.post_title}
                className="text-p1 font-bold mt-5 font-manrope text-brand-royal-blue"
              />
              <div className="flex items-center justify-center text-black font-manrope border-b-2 border-b-brand-green font-normal text-p4 w-fit">
                Learn More
                <Icon icon="chevron-right" />
              </div>
            </div>
          </div>

          <div className="w-1/5 flex flex-col gap-4">
            {story.images_gallery.slice(1, 4).map((image, index) => (
              <div className="h-[calc(500px/4)]" key={index}>
                <img
                  src={image}
                  alt={image.alt || 'Gallery Image'}
                  title={image.title || 'Image'}
                  className="w-full h-full object-cover object-center"
                />
              </div>
            ))}

            {story.images_gallery.length > 4 && (
              <div className="relative h-[calc(500px/3)]">
                <img
                  src={story.images_gallery[4]}
                  alt={story.images_gallery[4]?.alt || 'Gallery Image'}
                  title={story.images_gallery[4]?.title || 'Image'}
                  className="w-full h-full object-cover object-center opacity-50"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
                  <Icon icon="circle-bg-white-plus-icon" iconHeight={28} iconWidth={28} />
                  <span className="text-white text-lg font-normal">
                              {story.images_gallery.length - 4} images
                            </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </NextLink>
  );
};

const Videos = ({story}) => {
  const [thumbnail, setThumbnail] = useState('');

  useEffect(() => {
    const fetchThumbnail = async () => {
      if (story?.video) {
        const videoUrl = story.video.replace(/<iframe[^>]*src="([^"]*)"[^>]*><\/iframe>/i, '$1');
        const thumb = `https://noembed.com/embed?url=${videoUrl}`;
        try {
          const response = await fetch(thumb);
          const data = await response.json();
          setThumbnail(data?.thumbnail_url?.replace(/_\d+x\d+/, ""));
        } catch (error) {
          console.error('Error fetching the thumbnail URL:', error);
        }
      }
    };

    fetchThumbnail();
  }, [story]);

  return (
    <NextLink
      href={`/success-stories/${story.slug}`}
      key={story.id}
      otherClasses={clsx('block w-full p-4')}
    >
      <div className="bg-brand-blue order-2 p-5 flex-shrink-0">
        <div className="w-full h-auto relative">
          {thumbnail ? (
            <Image
              src={thumbnail}
              height={250}
              width={1000}
              className="w-full h-[15rem] object-cover"
            />
          ) : (
            <NextImage
              url={'/images/Nrwib-health-logo.svg'}
              height={'256'}
              width={'1000'}
              otherClasses={`w-full h-[200px] bg-white object-contain object-center p-4`}
            />
          )}
          <NextImage
            url="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/09/Button_-Play.svg"
            height={50}
            width={50}
            otherClasses="absolute top-[35%] left-[45%] z-10"
          />
        </div>

        <HtmlBlock
          className="text-p1 font-medium mt-5 font-manrope text-white border-b-2 border-b-white pb-5"
          content={story.post_title}
        />

        <HtmlBlock
          content={
            story.post_excerpt.length > 50
              ? `${story.post_excerpt.slice(0, 200)}...`
              : story.post_excerpt
          }
          className="mt-5 text-p3 font-normal font-manrope text-white"
        />
      </div>
    </NextLink>
  );
};

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

  const { items: tags, refine: refineByTags } = useMenu({
    attribute: 'success_tags',
    limit: 100,
    sortBy: ['name:desc']
  });

  const [selectedTags, setSelectedTags] = useState([]);

  const handleTagChange = (selectedTag) => {
    if (selectedTag.value === 'clear' || selectedTag.value === 'All') {
      setSelectedTags([]);
      refineByTags(null);
    } else {
      setSelectedTags([selectedTag]);
      refineByTags(selectedTag.value);
    }
  };

  const tagsToShow = [{ label: 'All', value: 'All' }, ...tags];

  return (
    <div className="transition-al w-full flex lg:flex-row flex-col items-center justify-center py-10 border-t border-t-brand-neutral-5 border-b border-b-brand-neutral-5 mt-10">
      <div className="relative w-full border-b border-b-white/10 px-5 lg:w-[25%]">
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
          className="border-b-solid w-full border border-brand-neutral-5 bg-transparent py-3 px-3 text-p4 text-black outline-none placeholder:text-black font-manrope rounded-lg"
        />

        {inputValue ? (
          <button
            onClick={() => setInputValue('')}
            tabIndex="0"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
              }
            }}
          >
            <Icon icon="cross-icon-white" otherClasses="absolute right-8 top-[0.8rem]" />
          </button>
        ) : (
          <Icon icon="search-icon-teal" otherClasses="absolute right-7 top-[0.9rem]" />
        )}
      </div>

      <SingleSelect
        options={tagsToShow}
        value={selectedTags}
        onChange={handleTagChange}
        placeholder="Filter by Tags"
        backgroundColor="bg-white"
        iconColor="#3395D7"
        control="1px solid #D9D7DD"

      />
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
