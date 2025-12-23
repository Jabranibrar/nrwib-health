import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import NextImage from '@/src/components/NextImage';
import React from 'react';
import styles from './HeroBanner.module.scss';
import clsx from 'clsx';

const HeroBanner = (props) => {
  const {
    heading,
    content,
    image,
    complementary_text,
    complementary_text_color,
    complementary_background_color
  } = props;

  return (
    <section data-testid="hero-banner" className="relative overflow-hidden">
      <div className="flex overflow-y-hidden">
        <div className="lg:w-[45%]">
          <div className="w-full h-[300px] bg-brand-blue"></div>
          <div className="w-full h-[200px] bg-brand-neutral-2"></div>
        </div>
        <div className="w-full lg:w-[55%] h-[500px]">
          <NextImage {...image} otherClasses="w-full h-full object-cover object-center" />
        </div>
      </div>
      {complementary_text && (
        <div className={`bg-${complementary_background_color} `}>
          <HtmlBlock
            content={complementary_text}
            className={`text-${complementary_text_color} text-p2 py-4 max-w-screen-xl w-full lg:px-10 px-5 mx-auto font-medium [&>p]:font-medium [&>a]:font-semibold [&>p>a]:font-semibold`}
          />
        </div>
      )}
      <div className="absolute left-16 top-40 w-[50%] border border-brand-teal h-[250px] xl:left-[calc(50vw-640px)]"></div>
      <div className="bg-white p-5 lg:p-10 absolute left-5 right-5 lg:left-24 top-28 min-h-[250px] flex items-center lg:w-[50%] xl:left-[calc(50vw-620px)]">
        <div>
          {heading && (
            <Heading
              type="h2"
              otherClasses="text-h2 lg:text-h1 font-semibold font-manrope text-brand-royal-blue"
            >
              {heading}
            </Heading>
          )}
          {content && (
            <HtmlBlock
              content={content}
              className={clsx(
                'text-p1 font-normal font-manrope mt-5 [&_strong]:!text-black',
                styles.heroBannerContent
              )}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
