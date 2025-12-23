import CustomLink from '@/src/components/CustomLink';
import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import Image from 'next/image';
import React from 'react';

export default function CTABanner1(props) {
  const {
    button_variant,
    button_anchor,
    image,
    heading,
    text,
    text_color,
    image_border_color,
    content_background_color,
    heading_color
  } = props;

  const button = {
    anchor: button_anchor,
    variant: button_variant
  };

  return (
    <section
      data-testid="cta-banner-1"
      className={`bg-${content_background_color} flex md:flex-row flex-col md:gap-10 lg:gap-[4.375rem] mb-10`}
    >
      <div className="md:max-w-[40%] lg:max-w-[33.1%] md:h-auto h-[32rem] w-full relative overflow-hidden">
        <div className={`bg-${image_border_color} absolute bottom-7 h-full w-full`}></div>
        {image?.url && <Image src={image.url} fill className="object-cover !top-7 !-left-7" />}
      </div>

      <div className="w-full py-[4.125rem] md:pl-0 pl-5 lg:pr-10 pr-5">
        <div className="w-full md:max-w-[57rem]">
          <Heading
            otherClasses={`text-${heading_color} mb-[2.125rem] text-[2.5rem] leading-[3.125rem] font-medium`}
          >
            {heading}
          </Heading>
          <HtmlBlock
            content={text}
            className={`text-${text_color} text-[1.25rem] leading-[1.875rem]`}
          />
          {button.anchor && <CustomLink {...button} otherClasses="mt-10" />}
        </div>
      </div>
    </section>
  );
}
