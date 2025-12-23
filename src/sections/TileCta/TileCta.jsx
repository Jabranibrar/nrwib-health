import CustomLink from '@/src/components/CustomLink';
import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import NextImage from '@/src/components/NextImage';
import React from 'react';

const TileCta = (props) => {
  const { heading, content, button_anchor, button_variant, is_reversed, image } = props;
  const button = {
    anchor: button_anchor,
    variant: button_variant
  };
  return (
    <section
      data-testid="tile-cta"
      className={`overflow-hidden ${Number(is_reversed) === 1 ? 'bg-brand-green' : 'bg-brand-blue'}`}
    >
      <div
        className={`flex gap-10 ${Number(is_reversed) === 1 ? 'flex-row-reverse xl:mr-[calc(50vw-620px)]' : 'xl:ml-[calc(50vw-620px)]'}`}
      >
        <div className="w-[50%] lg:py-10 py-5">
          {heading && (
            <Heading type="h2" otherClasses="font-manrope text-h2 text-white font-medium">
              {heading}
            </Heading>
          )}
          {content && (
            <HtmlBlock
              content={content}
              className="mt-5 text-white text-p2 font-normal font-manrope"
            />
          )}
          {button.anchor && <CustomLink {...button} otherClasses="mt-5" />}
        </div>
        <div className="w-[50%] relative overflow-hidden">
          <NextImage {...image} otherClasses="w-full h-[320px] object-cover object-center z-10" />
          <div
            className={`border  absolute top-6  z-20 p-20 h-[300px] w-[900px] ${Number(is_reversed) === 1 ? 'border-brand-blue xl:left-[calc(50vw-620px)] !-top-2' : 'border-brand-green xl:right-[calc(50vw-620px)]'}`}
          ></div>
        </div>
      </div>
    </section>
  );
};

export default TileCta;
