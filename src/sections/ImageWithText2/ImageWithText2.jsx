import CustomLink from '@/src/components/CustomLink';
import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import NextImage from '@/src/components/NextImage';
import React from 'react';

const ImageWithText2 = (props) => {
  const { heading, content, button_anchor, button_variant, image, isMemberPortal } = props;
  const button = {
    anchor: button_anchor,
    variant: button_variant
  };

  return (
    <section data-testid="image-with-text-2" className={`bg-white my-5 ${isMemberPortal ? 'lg:mt-10 lg:mb-20' : 'lg:my-10'}`}>
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
          <div className="lg:w-[50%] flex justify-end relative">
            <NextImage
              {...image}
              otherClasses={`lg:w-[90%] ${isMemberPortal ? 'h-[500px] rounded-l-[40%]' : 'h-[90%] max-h-[400px] rounded-l-full'} object-cover object-center`}
            />
            <NextImage
              url="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Vector-29.svg"
              height={200}
              width={200}
              otherClasses={`absolute ${isMemberPortal ? '-bottom-8 left-8' : 'bottom-0 left-0'} md:!block hidden`}
            />
          </div>
          <div className="lg:w-[50%] py-10">
            {heading && (
              <Heading
                type="h2"
                otherClasses={`text-brand-royal-blue lg:text-h2 font-manrope ${isMemberPortal ? 'font-medium pb-2' : 'font-semibold border-b border-b-brand-blue pb-5'} text-h3 `}
              >
                {heading}
              </Heading>
            )}
            {content && (
              <HtmlBlock
                content={content}
                className={`text-black text-p2 font-normal mt-5 font-manrope ${isMemberPortal ? '[&>ul]:mt-7 [&>ul]:pt-7 [&>ul]:border-t [&>ul]:border-t-brand-blue' : ''}`}
              />
            )}
            {button.anchor && <CustomLink {...button} otherClasses="mt-5" />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageWithText2;
