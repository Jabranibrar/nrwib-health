import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import NextImage from '@/src/components/NextImage';
import React from 'react';

const ImageWithIconTopics = (props) => {
  const {
    image,
    primary_icon,
    primary_heading,
    primary_content,
    secondary_heading,
    secondary_content,
    secondary_icon
  } = props;
  return (
    <section data-testid="image-with-icon-topics" className="my-10">
      <div className="flex items-center bg-brand-neutral-2">
        <div className="lg:w-[40%] relative">
          <NextImage
            {...image}
            otherClasses="w-full h-full object-cover object-center min-h-[600px] lg:!block hidden"
          />
          <div className="absolute inset-0 z-0 bg-brand-teal opacity-30"></div>
        </div>
        <div className="lg:w-[60%] px-5 py-10 lg:p-20">
          <div className="relative">
            <Heading
              type="h2"
              otherClasses="text-h2 lg:text-h1 font-manrope font-medium text-brand-royal-blue"
            >
              {primary_heading}
            </Heading>
            <HtmlBlock
              content={primary_content}
              className="font-normal text-p2 font-manrope text-black mt-5"
            />
            <div className="w-24 h-24 rounded-full bg-brand-teal border-4 border-white p-5 absolute -left-32 top-10 lg:!block hidden">
              <NextImage {...primary_icon} otherClasses="w-full object-contain object-center" />
            </div>
          </div>
          <div className="mt-10 lg:mt-20 relative">
            <Heading
              type="h2"
              otherClasses="text-h2 lg:text-h1 font-manrope font-medium text-brand-royal-blue"
            >
              {secondary_heading}
            </Heading>
            <HtmlBlock
              content={secondary_content}
              className="font-normal text-p2 font-manrope text-black mt-5"
            />
            <div className="w-24 h-24 rounded-full bg-brand-green border-4 border-white p-5 absolute -left-32 top-10 lg:!block hidden">
              <NextImage {...secondary_icon} otherClasses="w-full object-contain object-center" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageWithIconTopics;
