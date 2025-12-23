import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { RxCross2 } from 'react-icons/rx';
import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import SingleSelect from '@/src/components/SingleSelect';
import styles from './FindASpeaker.module.scss';
import Link from 'next/link';

const FindASpeaker = (props) => {
  const { choose_speakers } = props;

  const initialData = choose_speakers?.map((speaker) => speaker?.node);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMembers, setFilteredMembers] = useState(initialData);
  const [selectedArea, setSelectedArea] = useState('All');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');

  const handleClearClick = () => {
    setSearchQuery('');
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleAreaChange = (selectedOption) => {
    setSelectedArea(selectedOption?.value || 'All');
  };

  const handleSpecialtyChange = (selectedOption) => {
    setSelectedSpecialty(selectedOption?.value || 'All');
  };

  const areaOptions = () => {
    const allAreas = choose_speakers
      .map((speaker) => speaker?.node?.areas?.nodes?.map((area) => area?.name))
      ?.flat();

    const uniqueArea = allAreas.filter((value, index, array) => array.indexOf(value) === index);
    return [
      { label: 'All', value: 'All' },
      ...uniqueArea.map((area) => ({ label: area, value: area }))
    ];
  };

  const specialOptions = () => {
    const allSpeciality = choose_speakers
      ?.map((speaker) => speaker?.node?.specialties?.nodes?.map((specialty) => specialty.name))
      .flat();
    const uniqueSpeciality = allSpeciality?.filter(
      (value, index, array) => array.indexOf(value) === index
    );
    return [
      { label: 'All', value: 'All' },
      ...uniqueSpeciality.map((special) => ({ label: special, value: special }))
    ];
  };

  useEffect(() => {
    let filtered = initialData;

    if (searchQuery) {
      filtered = filtered.filter((profile) => {
        const { title, content, aboutSpeaker, specialties, areas } = profile;
        const { designation } = aboutSpeaker;
        const area = areas.nodes?.map((area) => area?.name)?.toString();
        const special = specialties?.nodes?.map((specialty) => specialty.name)?.toString();

        return (
          title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
          designation?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
          area?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
          special?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
          content?.toLowerCase()?.includes(searchQuery?.toLowerCase())
        );
      });
    }
    if (selectedArea !== 'All') {
      filtered = filtered.filter((profile) => {
        const areaNames = profile.areas.nodes.map((area) => area.name);
        return areaNames.includes(selectedArea);
      });
    }

    if (selectedSpecialty !== 'All') {
      filtered = filtered.filter((profile) => {
        const specialtyNames = profile.specialties.nodes.map((specialty) => specialty.name);
        return specialtyNames.includes(selectedSpecialty);
      });
    }

    setFilteredMembers(filtered);
  }, [searchQuery, selectedArea, selectedSpecialty]);

  return (
    <section
      className="max-w-screen-xl w-full lg:px-10 px-5 mx-auto mb-10"
      data-testid="find-a-speaker"
    >
      <div className="w-full flex md:flex-row flex-col gap-7 items-center justify-center mx-auto px-3 md:px-8 mb-[3.75rem]">
        <div className="border-[0.063rem] border-brand-neutral-5 overflow-hidden !rounded-lg py-3 px-4 md:max-w-[25rem] w-full h-[3.125rem] flex flex-row items-center justify-between relative bg-white">
          <input
            placeholder="Search by Keyword"
            type="text"
            className="w-full outline-none font-light text-[1rem] leading-[1.5rem] text-brand-black-200 placeholder:text-brand-black-200 relative pr-5 !bg-white"
            value={searchQuery}
            onChange={handleSearchChange}
          />

          {searchQuery ? (
            <RxCross2
              size={24}
              color="#0082C8"
              className="absolute right-2 top-3 cursor-pointer"
              onClick={handleClearClick}
            />
          ) : (
            <Image
              src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/NRWIB-Global-Icon-Search-1.svg"
              alt="search icon"
              className="ml-4 flex-shrink-0 w-[1.5rem] h-[1.5rem]"
              width={24}
              height={24}
            />
          )}
        </div>
        <div className="md:max-w-[25rem] w-full">
          <SingleSelect
            isSearchable
            options={areaOptions()}
            placeholder="Area"
            placeholderColor="#232323"
            iconColor="#232323"
            backgroundColor="#FFFFFF"
            onChange={handleAreaChange}
          />
        </div>
        <div className="md:max-w-[25rem] w-full">
          <SingleSelect
            isSearchable
            options={specialOptions()}
            placeholder="Speciality"
            placeholderColor="#232323"
            iconColor="#232323"
            backgroundColor="#FFFFFF"
            onChange={handleSpecialtyChange}
          />
        </div>
      </div>
      <div className="flex flex-row flex-wrap justify-center gap-6">
        {filteredMembers.length > 0 ? (
          filteredMembers?.map((speaker, index) => {
            return <FindASpeakerCard key={index} data={speaker} />;
          })
        ) : (
          <div className="bg-brand-neutral-3 w-full block text-center text-base mt-10 p-5">
            There are no results for that search, please try again.
          </div>
        )}
      </div>
    </section>
  );
};

export default FindASpeaker;

export const FindASpeakerCard = ({ data, hideCTALink = false }) => {
  const { title, content, aboutSpeaker, featuredImage, specialties, areas } = data || {};
  const { designation } = aboutSpeaker;

  return (
    <Link
      href={`/for-educators/request-a-speaker-form/?speaker=${title}`}
      className={`${styles.cardStyle} max-w-[25.8rem] sm:max-w-full w-full py-6 px-4 border border-brand-neutral-5 transition-all ease-in-out duration-300 hover:border hover:border-brand-blue hover:scale-[0.95] flex flex-col justify-between gap-5 cursor-pointer`}
    >
      <div>
        <Image
          src={
            featuredImage?.node?.url ||
            'https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Client-TeamName.svg'
          }
          width={352}
          height={320}
          alt="headshot"
          className="w-full h-[23.6rem] mb-3 object-cover object-center"
        />
        <div className="p-3 bg-brand-neutral-2 mb-3 min-h-[5.5rem] h-auto">
          <Heading otherClasses={'text-brand-royal-blue text-p1 font-bold'}>
            {title}{designation ? `, ${designation}` : ''}
          </Heading>
          <div className="flex flex-row flex-wrap gap-2">
            {areas.nodes?.map((area, index) => {
              return (
                <Heading otherClasses="text-brand-dark-grey text-p3 font-normal">
                  {area?.name}
                </Heading>
              );
            })}
          </div>
        </div>
        <div>
          <div className="mb-4 flex flex-row flex-wrap gap-2">
            {specialties.nodes?.map((data, index) => {
              return (
                <Heading otherClasses="bg-brand-blue rounded-[1.25rem] w-fit px-3 py-1 text-brand-white text-p4 font-normal">
                  {data?.name}
                </Heading>
              );
            })}
          </div>
          <HtmlBlock content={content} className="text-brand-dark-grey text-p4 font-normal" />
        </div>
      </div>
      {!hideCTALink && (
        <div className="flex justify-center items-center gap-[0.625rem] pb-2 border-b-2 border-brand-green w-fit cursor-pointer">
          <p className="text-brand-darker text-p4 font-normal">Request this Speaker</p>
          <Image
            src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Vector-1.svg"
            alt=""
            height={16}
            width={16}
            className="h-4 w-4"
          />
        </div>
      )}
    </Link>
  );
};
