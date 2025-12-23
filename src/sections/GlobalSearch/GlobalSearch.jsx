import React, { useMemo, useState } from 'react';
import Heading from '@/src/components/Heading';

import { Configure, InstantSearch, InstantSearchSSRProvider, Stats } from 'react-instantsearch';
import { getServerState } from 'react-instantsearch';
import TypesenseInstantsearchAdapter from 'typesense-instantsearch-adapter';
import { history } from 'instantsearch.js/es/lib/routers';
import { simple } from 'instantsearch.js/es/lib/stateMappings';
import GlobalSearchWidgets from './GlobalSearchWIdgets';
import CustomGlobalInfiniteHits from './CustomGlobalInfiniteHits';
import { ExploreSection } from './ExporeResults';

export default function GlobalSearch(props) {
  const { search_title } = props;
  const [searchInput, setSearchInput] = useState('');
  const routing = {
    router: history({
      getLocation() {
        if (typeof window !== 'undefined') {
          return window.location;
        }
        return new URL(process.env.NEXT_PUBLIC_NEXTJS_SITE_URL + '/search/');
      }
    }),
    stateMapping: simple()
  };
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
        query_by: 'post_title',
        sort_by: '_text_match:desc, post_date:desc',
        typo_tokens_threshold: 0
      }
    });

    const searchClient = typesenseInstantsearchAdapter.searchClient;

    return searchClient;
  }, []);

  return (
    <section data-testid="global-search">
      <InstantSearchSSRProvider {...getServerState}>
        <InstantSearch
          future={{ preserveSharedStateOnUnmount: true }}
          indexName="global_search_item"
          queryByWeights="3,1"
          searchClient={searchClient}
          routing={routing}
        >
          <Configure attributesToSnippet={['post_content:20']} hitsPerPage={12} />
          <div className="bg-brand-teal">
            <div className="py-10 lg:px-10 px-5 max-w-screen-xl mx-auto w-full">
              {search_title && (
                <Heading otherClasses="text-white text-h2 font-medium tracking-[0.05rem]">
                  {search_title}
                </Heading>
              )}

              <GlobalSearchWidgets {...props} setSearchInput={setSearchInput} />
            </div>
          </div>
          {searchInput && <Stats
            translations={{
              rootElementText({ nbHits }) {
                return (
                  /* query?.split(/\s+/).length === 1 || */
                  parseInt(nbHits) > 0 ? null : (
                    <p className="py-20 text-[1.5rem] leading-[2.2rem] text-brand-gray-600 text-center font-medium">
                      There are currently no results for that search, please try again.
                    </p>
                  )
                );
              }
            }}
          />}
          <CustomGlobalInfiniteHits />
          <ExploreSection {...props} />
        </InstantSearch>
      </InstantSearchSSRProvider>
    </section>
  );
}
