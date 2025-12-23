import React, { useState } from 'react';
import styles from './MemberCards.module.scss';
import NextImage from '@/src/components/NextImage';
import HtmlBlock from '@/src/components/HtmlBlock';
import Link from 'next/link';
import SingleSelect from '@/src/components/SingleSelect';
import Image from 'next/image';
import { RxCross2 } from 'react-icons/rx';

const MemberCards = (props) => {
  const { all_members_cards } = props;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);

  const filteredMembers = all_members_cards?.filter((data) => {
    const departmentName = data?.node?.departments?.edges[0]?.node?.name.toLowerCase();
    const searchTitle = data?.node?.title.toLowerCase();
    const nameMatch = searchTitle.includes(searchQuery.toLowerCase());

    const filterMatch =
      selectedFilters.length === 0 ||
      selectedFilters.some((filter) => filter.value === departmentName);

    return nameMatch && filterMatch;
  });

  const filterOptions = [
    { value: 'clear', label: 'All Action Groups' },
    ...Array.from(
      new Set(all_members_cards?.map((data) => data?.node?.departments?.edges[0]?.node?.name))
    ).map((optionText) => ({
      value: optionText?.toLowerCase(),
      label: optionText
    }))
  ];

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleFilterChange = (selectedOption) => {
    if (selectedOption.value === 'clear') {
      setSelectedFilters([]);
    } else {
      setSelectedFilters([selectedOption]);
    }
  };

  return (
    <section
      className="max-w-screen-xl w-full lg:p-10 p-5 mx-auto mb-10"
      data-testId="members-card"
    >
      <div className="flex sm:flex-row flex-col justify-center sm:items-center items-start gap-4 mb-5 relative">
        <div className="flex items-center sm:-mr-5 sm:w-auto w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Keyword"
            className={`md:w-[25rem] sm:w-[20rem] w-full py-[0.738rem] px-4 text-p4 placeholder:text-brand-dark-grey text-brand-dark-grey font-light !rounded-lg sm:mr-0 -mr-8  ${styles.inputField} ${
              searchQuery ? styles.inputFieldActive : ''
            }`}
          />
          {searchQuery ? (
            <button
              type="reset"
              className="relative sm:-left-[2.5rem] -left-[0.5rem] !top-3 w-7 h-7 z-10 translate-y-[-50%] "
              onClick={handleClearSearch}
            >
              <RxCross2 size={24} color="#0082C8" className="" />
            </button>
          ) : (
            <div className="relative sm:-left-[2.5rem] -left-[0.5rem] w-7 h-7">
              <Image
                src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/NRWIB-Global-Icon-Search.svg"
                alt="search-icon"
                fill
                className="absolute left-0 right-0"
              />
            </div>
          )}
        </div>
        <div className="md:w-[25rem] sm:w-[20rem] w-full ">
          <SingleSelect
            options={filterOptions}
            value={selectedFilters}
            onChange={handleFilterChange}
            placeholder="Filter by Action Groups"
            backgroundColor="bg-white"
            iconColor="#3395D7"
            placeholderColor="#646464"
            control="1px solid #C2C2C2"
          />
        </div>
      </div>
      {filteredMembers.length ? (
        <div className={`${styles.grid} gap-6 lg:gap-10 min-h-full h-full`}>
          {filteredMembers?.map((data, index) => (
            <div
              key={index}
              className={`${styles.gridBox} min-h-[24.3rem] h-full w-full rounded-0 bg-brand-neutral-3 flex flex-col justify-center items-center lg:gap-[1.875rem] gap-[1.25]`}
            >
              <div className="flex flex-col justify-between w-full h-full border-transparent border-b-2 hover:border-brand-teal">
                {data?.node?.memberFieldGroup?.websiteUrl ? (
                  <Link
                    href={data?.node?.memberFieldGroup?.websiteUrl || ''}
                    target="_blank"
                    className="flex flex-col items-center justify-center px-5 h-full"
                  >
                    <div className="relative w-[18.313rem] h-[17.6rem]">
                      {data?.node?.memberFieldGroup?.organizationLogo?.node?.sourceUrl ? (
                        <NextImage
                          url={data?.node?.memberFieldGroup?.organizationLogo?.node?.sourceUrl}
                          fill
                          alt={
                            data?.node?.memberFieldGroup?.organizationLogo?.node?.title || 'logo'
                          }
                          otherClasses="object-contain object-center absolute lg:pt-10 pt-6 lg:px-[1.25rem] px-[0.938rem] pb-10"
                        />
                      ) :
                        <div className={"flex items-center justify-center h-full"}>
                          <div className={"text-h2 font-normal text-brand-darker bg-white text-center p-3 "}>
                            {data?.node?.title}
                          </div>
                        </div>
                      }
                    </div>
                  </Link>
                ) : (
                  <div className="flex flex-col items-center justify-center px-5">
                    <div className="relative w-[18.313rem] h-[17.6rem]">
                      {data?.node?.memberFieldGroup?.organizationLogo?.node?.sourceUrl && (
                        <NextImage
                          url={data?.node?.memberFieldGroup?.organizationLogo?.node?.sourceUrl}
                          fill
                          alt={
                            data?.node?.memberFieldGroup?.organizationLogo?.node?.title || 'logo'
                          }
                          otherClasses="object-contain object-center absolute lg:pt-10 pt-6 lg:px-[1.25rem] px-[0.938rem] pb-10"
                        />
                      )}
                    </div>
                  </div>
                )}
                <div className="h-[0.063rem] bg-brand-neutral-5 w-full" />
                {data?.node?.memberFieldGroup?.linkToJobBoard?.url ? (
                  <Link
                    href={data?.node?.memberFieldGroup?.linkToJobBoard?.url || ''}
                    className="lg:px-[1.25rem] px-[0.938rem] h-full flex items-center justify-center gap-[0.625rem]"
                    target={"_blank"}
                    rel={"noopener noreferrer"}
                  >
                    <HtmlBlock
                      content={data?.node?.memberFieldGroup?.linkToJobBoard?.title || 'Browse Job Opportunities'}
                      className="text-p4 font-normal text-brand-darker hover:text-brand-blue-sky"
                    />
                    <div className="relative w-[0.563rem] h-4 ">
                      <NextImage
                        url="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Vector-1.svg"
                        alt="right-arrow-icon"
                        fill
                        otherClasses="object-contain object-center absolute r-0 t-0 "
                      />
                    </div>
                  </Link>
                ) : (
                  <Link
                    href={'/'}
                    className="lg:px-[1.25rem] px-[0.938rem] h-full flex items-center justify-center gap-[0.625rem] pointer-events-none opacity-0"
                    target={"_blank"}
                    rel={"noopener noreferrer"}
                  >
                    <HtmlBlock
                      content={data?.node?.memberFieldGroup?.linkToJobBoard?.title || 'Browse Job Opportunities'}
                      className="text-p4 font-normal text-brand-darker hover:text-brand-blue-sky"
                    />
                    <div className="relative w-[0.563rem] h-4 ">
                      <NextImage
                        url="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Vector-1.svg"
                        alt="right-arrow-icon"
                        fill
                        otherClasses="object-contain object-center absolute r-0 t-0 "
                      />
                    </div>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <h2 className="md:text-h2 text-h3 mt-10 text-brand-blue-sky font-medium text-center">
          No Member Found
        </h2>
      )}
    </section>
  );
};

export default MemberCards;
