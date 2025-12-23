import Image from 'next/image';
import React from 'react';
import Heading from '../../components/Heading';
import HtmlBlock from '../../components/HtmlBlock';
import CustomLink from '../../components/CustomLink';
import styles from './CTABanner5.module.scss';
import { usePathname } from 'next/navigation';

export default function CTABanner5(props) {
  const { button_anchor, button_variant, title, text, image } = props;

  const pathname = usePathname();

  const button = {
    anchor: button_anchor,
    variant: button_variant
  };

  return (
    <section
      data-testid="cta-banner-5"
      className={`bg-brand-neutral flex md:flex-row flex-col md:gap-10 lg:gap-[3.75rem] border-b-[0.5rem] border-brand-saffron ${pathname.includes('become-our-partner') ? 'mb-0' : 'mb-10'}`}
    >
      {image?.url && (
        <div
          className={`${styles.imageContainer} md:h-auto h-[32rem] w-full relative overflow-hidden ${styles.bgImage}`}
        >
          <Image src={image.url} fill className="object-contain object-bottom mt-4 !mx-4" />
        </div>
      )}

      <div className="w-full pt-[3.813rem] pb-[3.375rem] md:pl-0 pl-5 lg:pr-10 pr-5">
        <div className="w-full md:max-w-[53rem]">
          <Heading
            otherClasses={`text-brand-teal text-[2.5rem] leading-[3.125rem] font-medium mb-[1.25rem]`}
          >
            {title}
          </Heading>

          <HtmlBlock
            content={text}
            className="text-brand-darker text-[1.25rem] leading-[1.875rem]"
          />

          {button.anchor && <CustomLink {...button} otherClasses="mt-4" />}
        </div>
      </div>
    </section>
  );
}
