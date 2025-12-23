import CustomLink from '@/src/components/CustomLink';
import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import NextImage from '@/src/components/NextImage';
import React from 'react';

const ImageWithText1 = (props) => {
  const { heading, content, button_anchor, button_variant, image } = props;
  const button = {
    anchor: button_anchor,
    variant: button_variant
  };
  return (
    <section data-testid="image-with-text-1" className="bg-brand-royal-blue my-5">
      <div className="flex flex-col lg:flex-row justify-between gap-10">
        <div className="lg:w-[50%] px-5 lg:px-0 py-10 lg:ml-[calc(50vw-620px)]">
          {heading && (
            <Heading
              type="h2"
              otherClasses="lg:text-h2 font-manrope font-medium text-h3 text-white border-b border-b-white pb-5 lg:pb-10"
            >
              {heading}
            </Heading>
          )}
          {content && (
            <HtmlBlock
              content={content}
              className="text-white text-p2 font-normal mt-5 font-manrope"
            />
          )}
          {button.anchor && <CustomLink {...button} otherClasses="mt-5" />}
        </div>
        <div className="lg:w-[50%] px-5 lg:px-0 flex items-end lg:justify-end relative">
          <NextImage
            {...image}
            otherClasses="lg:w-[90%] max-h-[500px] h-[90%] object-cover object-center"
          />
          <NextImage
            url="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Vector-28.svg"
            height={200}
            width={200}
            otherClasses="absolute top-0 left-0 hidden md:!block"
          />
        </div>
      </div>
    </section>
  );
};

export default ImageWithText1;
