import CustomLink from '@/src/components/CustomLink';
import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';
import AuthContent from '@/src/components/AuthContent';

export default function ActionTeamWidget(data) {

  const { action_groups } = data;

// Define background colors
  const bgColors = ['brand-royal-blue', 'brand-blue-sky', 'brand-teal'];
  const sortedActionGroups = action_groups?.sort((a, b) => a.name.localeCompare(b.name));
  return (
    <AuthContent>
      <section data-testid="action-team-widget">
        <div className="max-w-screen-xl lg:px-10 px-5 w-full mx-auto pt-16 pb-8">
          <div className="flex flex-col gap-y-10 mb-12">
            {sortedActionGroups?.map((item, index) => {
              const image = item?.image;
              const cardHeading = item?.name;
              const cardText = item?.description;
              const textColor = 'white';
              const headingColor = 'white';
              const bgColor = bgColors[index % bgColors.length]; // Cycle through background colors

              const cardButton = {
                anchor: {
                  'url': `/member-portal/action-teams/join-an-action-team/?team=${item?.name}`,
                  'title': 'Interested in Joining? Contact Us',
                  'target': '_blank'
                },
                variant: '5',
              };

              const cardButton2 = {
                anchor: {
                  'url': `/member-portal/action-teams/${item?.slug}`,
                  'title': `Browse ${cardHeading}`,
                },
                variant: '5',
              };

              return (
                <div key={index} className="flex md:flex-row flex-col">
                  <div className="w-full lg:!max-w-[31.1rem] md:!max-w-[26rem] md:h-auto min-h-[20rem] relative">
                    {image && <Image src={image} fill className="object-cover" />}
                  </div>

                  <div
                    className={`bg-${bgColor} py-10 px-5 md:pl-10 lg:pr-12 lg:pl-[3.75rem] w-full`}
                  >
                    <Heading
                      otherClasses={`text-${headingColor} font-semibold text-h3 mb-6`}
                    >
                      {cardHeading}
                    </Heading>
                    <div className="bg-white h-[0.063rem] w-72 mb-[0.875rem]"></div>
                    <HtmlBlock
                      content={cardText}
                      className={`text-p2 font-normal text-${textColor} mb-6`}
                    />
                    <div className={"flex gap-x-4 items-center"}>
                      {cardButton.anchor && (
                        <CustomLink
                          {...cardButton}
                          otherClasses={clsx(
                            cardButton.variant === '5' && 'hover:!border-white !font-medium',
                          )}
                        />
                      )}
                      {cardButton2.anchor && (
                        <CustomLink
                          {...cardButton2}
                          otherClasses={clsx(
                            cardButton.variant === '5' && 'hover:!border-white !font-medium',
                          )}
                        />
                      )}

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </AuthContent>

  );
}
