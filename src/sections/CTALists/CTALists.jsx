import CustomLink from '@/src/components/CustomLink';
import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';

export default function CTALists(data) {
  const { cta_cards, title, text, button_anchor, button_variant } = data;

  const button = {
    anchor: button_anchor,
    variant: button_variant
  };
  const sortedHeading = Array.from({ length: cta_cards }, (_, i) => i).sort((a, b) => {
    const headingA = data[`cta_cards_${a}_heading`];
    const headingB = data[`cta_cards_${b}_heading`];
    return headingA > headingB ? 1 : -1;
  });

  return (
    <section data-testid="cta-lists" className="mb-10 bg-brand-neutral-2">
      <div className="max-w-screen-xl lg:px-10 px-5  w-full mx-auto pt-20 pb-8">
        <div className="flex flex-col gap-7 mb-12">
          {sortedHeading.map((i) => {
              const image = data[`cta_cards_${i}_image`]?.url;
              const cardHeading = data[`cta_cards_${i}_heading`];
              const cardText = data[`cta_cards_${i}_text`];
              const textColor = data[`cta_cards_${i}_text_color`];
              const headingColor = data[`cta_cards_${i}_heading_color`];
              const bgColor = data[`cta_cards_${i}_content_background_color`];

              const cardButton = {
                anchor: data[`cta_cards_${i}_button_anchor`],
                variant: data[`cta_cards_${i}_button_variant`]
              };

              return (
                <div key={i} className="flex md:flex-row flex-col">
                  <div className="w-full lg:!max-w-[31.1rem] md:!max-w-[26rem] md:h-auto min-h-[20rem] relative">
                    {image && <Image src={image} fill className="object-cover" />}
                  </div>

                  <div
                    className={`bg-${bgColor} py-5 px-5 md:pl-10 lg:pr-12 lg:pl-[3.75rem] w-full`}
                  >
                    <Heading
                      otherClasses={`text-${headingColor} font-medium text-[2.5rem] leading-[3.125rem] mb-[0.875rem]`}
                    >
                      {cardHeading}
                    </Heading>
                    <div className="bg-white h-[0.063rem] w-full mb-[0.875rem]"></div>
                    <HtmlBlock
                      content={cardText}
                      className={`text-[1.25rem] leading-[1.875rem] font-normal text-${textColor}`}
                    />
                    {cardButton.anchor && (
                      <CustomLink
                        {...cardButton}
                        otherClasses={clsx(
                          cardButton.variant === '5' && 'hover:!border-white',
                          'mt-[1.313rem]'
                        )}
                      />
                    )}
                  </div>
                </div>
              );
            })}
        </div>
        <div className="bg-brand-saffron h-[0.063rem] w-full"></div>

        <div className="mt-10 flex flex-col justify-center items-center">
          <Heading otherClasses="text-brand-royal-blue font-medium text-[2.5rem] leading-[3.125rem] mb-5">
            {title}
          </Heading>

          <HtmlBlock
            content={text}
            className="text-[1.25rem] leading-[1.875rem] font-normal text-brand-dark-grey text-center"
          />

          {button.anchor && <CustomLink {...button} otherClasses="mt-6" />}
        </div>
      </div>
    </section>
  );
}
