import CustomLink from '@/src/components/CustomLink';
import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import NextImage from '@/src/components/NextImage';
import React from 'react';

const CtaBanner3 = (props) => {
  const { heading, content, button_variant, button_anchor, image } = props;
  const button = {
    anchor: button_anchor,
    variant: button_variant
  };
  return (
    <section data-testid="cta-banner-3" className="bg-brand-neutral-3 py-10 mb-10">
      <div className="container">
        <div className="bg-brand-royal-blue border-l-[20px] border-l-brand-saffron">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-[50%] flex items-end">
              <NextImage
                {...image}
                otherClasses="w-[90%] h-[90%] max-h-[350px] object-cover object-center"
              />
            </div>
            <div className="lg:w-[50%] p-10">
              {heading && (
                <Heading type="h3" otherClasses="text-h2 font-medium font-manrope text-white">
                  {heading}
                </Heading>
              )}
              {content && (
                <HtmlBlock
                  content={content}
                  className="text-p2 font-manrope font-normal mt-5 text-white"
                />
              )}
              {button.anchor && <CustomLink {...button} otherClasses="mt-5" />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaBanner3;
