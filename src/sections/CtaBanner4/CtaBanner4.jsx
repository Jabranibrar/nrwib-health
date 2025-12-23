import CustomLink from '@/src/components/CustomLink';
import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import NextImage from '@/src/components/NextImage';
import React from 'react';

const CtaBanner4 = (props) => {
  const { heading, content, button_anchor, button_variant, image, button_text } = props;

  const button = {
    anchor: button_anchor,
    variant: button_variant
  };

  return (
    <section data-testid="Cta-banner-4" className="bg-brand-teal my-5 lg:my-10 relative">
      <div className="container pt-10 pb-2 lg:pb-5">
        <div className="lg:w-[50%] z-20">
          {heading && (
            <Heading type="h2" otherClasses="text-h2 font-manrope font-medium text-white">
              {heading}
            </Heading>
          )}
          {content && (
            <HtmlBlock
              content={content}
              className="text-white font-normal text-p2 mt-5 mb-5 lg:mb-20 [&>strong]:!text-white font-manrope"
            />
          )}
          <div className="flex items-center gap-2 ">
            {button_text && (
              <HtmlBlock
                content={button_text}
                className="text-white text-p3 lg:text-p2 font-medium z-[20] font-manrope"
              />
            )}
            {button.anchor && <CustomLink {...button} otherClasses="z-20" />}
          </div>
        </div>
      </div>
      <div className="absolute top-0 right-0 w-[35%] min-h-[200px] rounded-bl-[200px] overflow-hidden lg:!block hidden">
        <NextImage
          {...image}
          otherClasses="w-full h-[60%] max-h-[280px] object-cover object-center"
        />
      </div>
      <div className="bg-brand-blue absolute bottom-0 left-0 p-10 w-full lg:w-[50vw] max-h-[20px] rounded-tr-[100px]"></div>
    </section>
  );
};

export default CtaBanner4;
