import React, { useState, useEffect } from 'react';
import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import NextImage from '@/src/components/NextImage';
import NextLink from '@/src/components/NextLink';
import SingleSelect from '@/src/components/SingleSelect';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

const JoinActionTeamCTA = (props) => {
  const { heading, description, image, learn_more } = props;
  const params = useSearchParams();
  const teams = params.get('team');
  const actionTeams = props.departments;
  const router = useRouter();

  const options = actionTeams.filter((attribute) => !attribute?.actionGroups?.hideFromFrontend).map((team) => ({
    value: team.name,
    label: team.name,
    url: team.slug
  }));

  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    if (teams) {
      const foundOption = options.find((option) => option.value === teams);
      if (foundOption) {
        setSelectedTeam(foundOption);
      }
    }
    // Only teams should be a dependency
  }, [teams]);

  const handleSelectChange = (selectedOption) => {
    setSelectedTeam(selectedOption);
    if (selectedOption) {
      window.location.href = `/member-portal/action-teams/${selectedOption.url}`;
    }
  };

  return (
    <section
      className={'relative bg-brand-neutral-2 py-10 mb-10'}
      data-testid="action-team-hero-banner"
    >
      <section className="relative">
        <div className={'container mx-auto'}>
          <div className={`mx-auto !flex lg:flex-row flex-col`}>
            <div className="relative lg:pr-14 px-5 lg:pl-0 lg:max-w-[70%] w-full flex justify-center flex-col">
              <p
                className={`w-fit text-p4 inline-block font-medium text-brand-dark-grey-1 bg-white px-5 py-[0.38rem] mb-4 rounded-[1.875rem]`}
              >
                For Members Only
              </p>
              {heading && (
                <Heading otherClasses={'text-h1 font-semibold text-brand-royal-blue mb-6'}>
                  {heading}
                </Heading>
              )}
              {description && (
                <HtmlBlock
                  className="text-h4 font-normal font-manrope leading-normal font-normal text-brand-black-200 [&>strong]:!text-brand-black-200"
                  content={description}
                />
              )}
              <div className="bg-white w-full p-5 mt-5">
                {learn_more?.title && (
                  <NextLink href={learn_more.url} otherClasses="text-p1 font-manrope font-normal">
                    Need to Learn More?{' '}
                    <span className="text-brand-teal underline font-bold">{learn_more.title}</span>
                  </NextLink>
                )}

                <SingleSelect
                  options={options}
                  value={selectedTeam} // Set selected value
                  onChange={handleSelectChange} // Call the new function
                  placeholder="Pick An Action Team"
                  placeholderFontSize="16px"
                  className="w-[55%] placeholder:text-brand-grayish text-p3 bg-white border border-brand-teal font-light h-[3.125rem] rounded-lg active:outline-none focus:outline-none mt-5 z-10"
                />
              </div>
            </div>
            <div className="w-[30%] bg-white flex items-center justify-center">
              <div className="bg-white py-5 px-5">
                <NextImage {...image} otherClasses="w-full h-48 object-contain object-center" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default JoinActionTeamCTA;
