'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Stats, useInstantSearch, useSearchBox } from 'react-instantsearch';
import Image from 'next/image';
import { SearchBox } from './searchBox';

export default function GlobalSearchWidgets(props) {
  const { search_label, clear_text, setSearchInput } = props;
  const [searchSnippets, setSearchSnippets] = useState([]);

  const { query, refine, clear } = useSearchBox();
  // const { status } = useInstantSearch();
  const searchInputRef = useRef(null);
  const clearAll = () => {
    searchInputRef.current.value = '';
    refine('');
    searchInputRef?.current?.focus();
  };

  // const handleInputClick = () => {
  //   if (searchInputRef.current) {
  //     searchInputRef.current.focus();
  //   }
  // };
  const handleSearch = (value) => {
    if (value !== '') {
      const snippets = value.split(',')
      .map(snippet => snippet.trim())
      .filter(snippet => snippet !== '');

    setSearchSnippets(snippets);
    setSearchInput(snippets);
    } else {
      setSearchSnippets([]);
    }

  };

  const handleDeleteSnippet = (index) => {
    const filteredSnippets = searchSnippets.filter((item, i) => i !== index);
    setSearchSnippets(filteredSnippets);
    refine(filteredSnippets.join(' '));
  };

  const clearSnippets = () => {
    setSearchSnippets([]);
    clearAll();
  };

  useEffect(() => {
    refine(query + '');
    setTimeout(() => {
      refine(query);
    }, 500);
    let timer;
    const handleScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        if (window.scrollY > 0) {
          searchInputRef?.current?.blur();
        }
      }, 100);
    };

    if (query) {
      setSearchSnippets([query]);
    }
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <SearchBox
        query={query}
        search_label={search_label}
        searchInputRef={searchInputRef}
        refine={refine}
        handleSearch={handleSearch}
      />
      <div className="mt-6 flex justify-between items-start gap-5">
        <div className="flex justify-start items-center gap-4 flex-wrap">
          {searchSnippets.length > 0 &&
            searchSnippets.map((item, i) => {
              return (
                <div
                  key={i}
                  className="rounded-[2rem] bg-brand-green flex justify-center items-center w-fit gap-2 pl-3 pr-2 pt-[0.375rem] pb-2"
                >
                  <span className="text-white text-p3 font-semibold">{item}</span>
                  <Image
                    src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/09/Group-1763.svg"
                    alt="cross"
                    height={20}
                    width={20}
                    className="h-5 w-5 cursor-pointer"
                    onClick={() => handleDeleteSnippet(i)}
                  />
                </div>
              );
            })}
        </div>
        {query && (
          <button
            className="text-white text-center text-p2 font-medium text-wrap sm:text-nowrap"
            onClick={() => clearSnippets()}
          >
            {clear_text || 'Clear Search'}
          </button>
        )}
      </div>
    </>
  );
}
