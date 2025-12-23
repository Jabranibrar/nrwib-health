import CustomLink from '@/src/components/CustomLink';
import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import Image from 'next/image';
import React from 'react';

const RegisterCTA = (props) => {
  const {
    heading, text, image, button_anchor, button_variant,
    text_color,
    image_border_color,
    content_background_color,
    heading_color
  } = props;
  const button = {
    anchor: button_anchor,
    variant: button_variant
  };
  return (
    <section
      data-testid="register-cta"
      className="w-full max-w-screen-xl lg:px-10 px-5 mx-auto mb-10"
    >
      <div className="flex md:flex-row flex-col h-full">
        <div className="w-full lg:!max-w-[35rem] md:h-auto md:min-h-[inherit] min-h-[20rem] relative">
          {image?.url && <Image src={image?.url} fill className="object-cover" />}
          <Image
            src={'https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/09/Vector-1.svg'}
            alt="logo"
            width={100}
            height={97}
            className='absolute top-0 right-[-0.125rem] z-10'
          />
        </div>

        <div className={`bg-${content_background_color || 'brand-blue-sky'} sm:p-14 p-8 w-full border-l-[0.625rem] border-l-${image_border_color || 'brand-saffron'}`}>
          <Heading otherClasses={`text-h2 font-medium text-${heading_color || 'brand-white'} mb-3`}>{heading}</Heading>
          <HtmlBlock content={text} className={`text-p2 font-normal text-${text_color || 'brand-white'}`} />
          {button?.anchor?.url && <CustomLink {...button} otherClasses={'mt-8'} />}
        </div>
      </div>
    </section>
  );
};

export default RegisterCTA;
