import Image from 'next/image';
import React from 'react';

export const SearchBox = (props) => {
  const { searchInputRef, refine, query, search_label, setSearchInput, handleSearch } = props;

  return (
    <div className="bg-white flex justify-between items-center py-3 px-4 rounded-[0.25rem] gap-8 lg:gap-[3.75rem] mt-6">
      <input
        type="text"
        ref={searchInputRef}
        placeholder={search_label || 'Search by Keyword'}
        value={query}
        autoFocus
        onChange={(e) => {
          refine(e.target.value);
          handleSearch(e.target.value);
        }}
        onBlur={() => {
          if (!query) {
            return;
          }

          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: 'search',
            search_term: query,
            search_type: 'global'
          });
        }}
        // onKeyDown={(event) => {
        //   if (event.keyCode === 13) {
        //     handleSearch();
        //   }
        // }}
        className="outline-none text-p2 font-normal text-brand-navy placeholder:text-brand-navy w-full"
      />
      <Image
        src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/NRWIB-Global-Icon-Dropdown.svg"
        alt="arrow-next"
        height={24}
        width={24}
        className="h-6 w-6"
      />
    </div>
  );
};
