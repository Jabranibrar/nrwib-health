import Image from 'next/image';
import React from 'react';
import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import CustomLink from '@/src/components/CustomLink';

export default function CTABanner8(props) {
  const { button_anchor, button_variant, heading, description, image } = props;
  const button = {
    anchor: button_anchor,
    variant: button_variant
  };
  return (
    <section
      data-testid="cta-banner-8"
      className={`bg-brand-neutral-2 py-10`}
    >
      <div className={"container mx-auto"}>
        <div className={"flex md:flex-row flex-col md:gap-10 lg:gap-[3.75rem] bg-brand-neutral-2"}>
          <div className="w-full lg:w-2/3 lg:pr-10">
            <div className="w-full md:max-w-[53rem]">
              <Heading
                otherClasses={`text-brand-royal-blue text-h1 font-semibold mb-6`}
              >
                {heading}
              </Heading>
              {
                description &&
                <HtmlBlock
                  content={description}
                  className="text-brand-black-200 text-h4 font-normal font-manrope leading-normal mb-10"
                />
              }
              {button.anchor && <CustomLink {...button} otherClasses="font-manrope px-4 !font-medium" />}
            </div>
          </div>
          {image?.url && (
            <div
              className={`shrink-0 md:h-auto h-[32rem] lg:w-1/3 relative overflow-hidden`}
            >
              <Image src={image.url} fill className="object-cover" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
