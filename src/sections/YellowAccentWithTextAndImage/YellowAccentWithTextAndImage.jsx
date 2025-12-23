import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import NextImage from '@/src/components/NextImage';
import React from 'react';

const YellowAccentWithTextAndImage = (props) => {
  const { heading, content, image } = props;
  return (
    <section
      data-testid="yellow-accent-with-text-and-image"
      className="bg-brand-royal-blue border-r-[15px] border-r-brand-saffron my-10 relative overflow-hidden"
    >
      <div className="container">
        <div className="lg:w-[60%] py-10">
          {heading && (
            <Heading
              type="h2"
              otherClasses="lg:text-h2 font-manrope font-medium text-white pb-5 border-b border-b-white"
            >
              {heading}
            </Heading>
          )}
          {content && (
            <HtmlBlock
              content={content}
              className="text-white mt-5 text-p2 font-normal [&>a>strong]:!text-white [&>p>a]:!decoration-white font-manrope [&>p>strong]:!text-white "
            />
          )}
        </div>
      </div>
      <div className="w-[40%] absolute right-0 top-0 items-end justify-end lg:!flex hidden">
        <NextImage
          {...image}
          otherClasses="w-[90%] min-h-[300px] object-cover object-center z-10"
        />
      </div>
    </section>
  );
};

export default YellowAccentWithTextAndImage;
