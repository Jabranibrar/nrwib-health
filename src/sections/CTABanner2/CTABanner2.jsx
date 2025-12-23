import CustomLink from '@/src/components/CustomLink';
import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import Image from 'next/image';
import React from 'react';

export default function CTABanner2(props) {
  const {
    image,
    background_color_1,
    background_color_2,
    heading,
    text,
    button_variant,
    button_anchor
  } = props;

  const button = {
    anchor: button_anchor,
    variant: button_variant
  };

  return (
    <section data-testid="cta-banner-2" className="relative overflow-hidden mb-10">
      <div className="relative z-20 top-[2.875rem] max-w-screen-xl lg:px-10 px-5 w-full mx-auto">
        <div className="absolute w-[90%] md:max-w-[51.2rem] md:w-full px-5 md:px-10 lg:pl-[3.875rem] lg:pr-[3.813rem] pt-[2.063rem] pb-10 flex flex-col justify-center items-center gap-4 bg-brand-neutral-2">
          <Heading otherClasses="text-[2.5rem] leading-[3.125rem] font-semibold text-brand-royal-blue text-center">
            {heading}
          </Heading>
          <HtmlBlock
            className="text-[1.25rem] leading-[1.875rem] text-brand-darker text-center"
            content={text}
          />
          {button.anchor && <CustomLink {...button} />}
        </div>
      </div>

      <div className="flex md:flex-row flex-col">
        <div className="w-full md:w-[48%] flex">
          <div className={`w-[33%] min-h-[28.55rem] h-full bg-${background_color_1}`}></div>
          <div className={`w-[67%] min-h-[28.55rem] h-full bg-${background_color_2}`}></div>
        </div>
        <div className="w-full md:w-[52%] min-h-[28.55rem] h-full relative">
          {image?.url && <Image src={image.url} alt="image" fill className="object-cover" />}
        </div>
      </div>
    </section>
  );
}
