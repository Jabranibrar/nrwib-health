import Image from 'next/image';
import React from 'react';
import Heading from '../../components/Heading';
import HtmlBlock from '../../components/HtmlBlock';
import CustomLink from '../../components/CustomLink';

export default function CTABanner5(props) {
  const { button_anchor, button_variant, title, text, image } = props;
  const button = {
    anchor: button_anchor,
    variant: button_variant
  };

  return (
    <section data-testid="cta-banner-6" className={`relative mb-10`}>
      <div className={'container mx-auto mt-24'}>
        <div className={'bg-brand-royal-blue border-brand-green border-b-4 pl-8 lg:pl-20 pr-8'}>
          <div className={'flex items-center justify-center flex-wrap lg:flex-nowrap gap-x-16'}>
            <div className="py-16 w-full">
              <Heading otherClasses={`font-manrope text-white text-h2 font-medium mb-6 block`}>
                {title}
              </Heading>

              <HtmlBlock content={text} className="font-manrope text-white text-p2 mb-8 block" />

              {button.anchor && (
                <CustomLink {...button} otherClasses="font-manrope mt-4 !font-normal" />
              )}
            </div>
            {image?.url && (
              <div className={`shrink-0 w-full max-w-lg relative overflow-hidden -top-8`}>
                <Image
                  src={image.url}
                  width={image?.width}
                  height={image?.height}
                  className="w-full block object-cover object-center"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
