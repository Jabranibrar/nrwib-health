import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import NextImage from '@/src/components/NextImage';
import React from 'react';

const GreenAccentWithLeftImageAndRightContent = (props) => {
  const { heading, content, image } = props;
  return (
    <section data-testid="green-accent-with-left-image-and-right-content" className="my-10">
      <div className="container">
        <div className="flex items-center justify-between border-l-[15px] border-l-brand-green">
          <div className="lg:w-[40%]">
            <NextImage
              {...image}
              otherClasses="w-[90%] min-h-[300px] object-cover object-center z-10 lg:!block hidden"
            />
          </div>
          <div className="lg:w-[60%] ml-5">
            {heading && (
              <Heading
                type="h2"
                otherClasses="font-manrope font-semibold pb-5 border-b border-b-brand-neutral-2 text-brand-royal-blue"
              >
                {heading}
              </Heading>
            )}
            {content && (
              <HtmlBlock
                content={content}
                className="text-black mt-5 text-p2 font-normal font-manrope [&>p>strong]:!text-black [&>p>a>strong]:!text-black"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GreenAccentWithLeftImageAndRightContent;
