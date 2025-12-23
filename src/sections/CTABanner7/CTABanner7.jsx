import Image from 'next/image';
import React from 'react';
import Heading from '@/src/components/Heading';
import CustomLink from '@/src/components/CustomLink';
import styles from './CTABanner7.module.scss';

export default function CTABanner7(props) {
  const { title, image } = props;

  const buttons = [];

  for (let i = 0; i < props?.get_buttons; i++) {
    buttons.push({
      anchor: {
        title: props[`get_buttons_${i}_button_anchor`]?.title || '',
        url: props[`get_buttons_${i}_button_anchor`]?.url || '',
        target: props[`get_buttons_${i}_button_anchor`]?.target || ''
      },
      variant: props[`get_buttons_${i}_button_variant`] || ''
    });
  }
  return (
    <section data-testid="cta-banner-7" className={`bg-brand-neutral-3 pt-10`}>
      <div className={'container mx-auto'}>
        <div className={'flex md:flex-row flex-col md:gap-10 lg:gap-[3.75rem] bg-brand-neutral-2'}>
          <div
            className={`${styles.imageContainer} md:h-auto h-[32rem] w-full relative overflow-hidden ${styles.bgImage}`}
          >
            <Image
              src={
                image.url ||
                'https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/09/NRWIB-GetInvolved-BecomeanIndustryPartner-NenefitsofJoining-Image02.png'
              }
              fill
              className="object-contain object-bottom mt-4 !mx-4"
            />
          </div>
          <div className="w-full pt-24 pb-20 md:pl-0 pl-5 lg:pr-10 pr-5">
            <div className="w-full md:max-w-[53rem]">
              <Heading otherClasses={`text-brand-teal text-h2 font-medium mb-[1.25rem]`}>
                {title}
              </Heading>
              <div className={'flex items-center gap-x-6'}>
                {buttons.map((button, i) => {
                  return <CustomLink {...button} otherClasses="mt-4 !py-4" />;
                })}
                ;
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
