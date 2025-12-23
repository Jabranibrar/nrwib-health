import CustomLink from '@/src/components/CustomLink';
import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import Image from 'next/image';
import React from 'react';
import styles from "./EventsIntroSection.module.scss"

const EventsIntroSection = (props) => {

  const { heading, text, image, button_anchor, button_variant } = props;
  const button = {
    anchor: button_anchor,
    variant: button_variant
  };
  return (
    <section
      data-testid="events-intro-section"
      className="w-full mb-10 bg-brand-neutral-3"
    >
      <div className={`flex md:flex-row flex-col h-full mx-auto`}>
        <div className="w-full lg:!max-w-[41%] md:h-auto md:min-h-[inherit] min-h-[20rem] relative">
          {image?.url && <Image src={image?.url} fill className="object-cover" />}
        </div>

        <div className={`bg-brand-neutral-3 sm:pt-[3.875rem] pl-[4.25rem] pb-[3.625rem] pr-8 w-full`}>
          <Heading otherClasses={'text-h2 font-medium text-brand-royal-blue mb-10'}>{heading}</Heading>
          <HtmlBlock content={text} className="text-p2 font-normal text-brand-black-200" />
          {button?.anchor?.url && <CustomLink {...button} otherClasses={'mt-8'} />}
        </div>
      </div>
    </section>
  );
};

export default EventsIntroSection;
