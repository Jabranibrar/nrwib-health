import CustomLink from '@/src/components/CustomLink';
import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import Image from 'next/image';
import React from 'react';

const CtaDoubleCta = (props) => {

  const { cards } = props;
  const ctaDoublectaClasses = 'relative w-full max-w-screen-xl lg:px-10 px-5 mx-auto mb-10';
  return (
    <section className={ctaDoublectaClasses} data-testid="cta-double-cta">
      <div className="w-full grid md:grid-cols-2 grid-cols-1 gap-10">
        {Array(cards)
          ?.fill(null)
          ?.map((_, index) => {
            const icon = props[`cards_${index}_icon`]?.url;
            const button = {
              anchor: props[`cards_${index}_button_anchor`],
              variant: props[`cards_${index}_button_variant`]
            };
            const button2 = {
              anchor: props[`cards_${index}_button_2_anchor`],
              variant: props[`cards_${index}_button_2_variant`]
            };
            const isEven = index;
            return (
              <div
                className={`${isEven % 2 === 0 ? 'bg-brand-blue-sky' : 'bg-brand-teal'} p-8 w-full flex flex-col justify-between`}
                key={index}
              >
                <div>
                  {icon && (
                    <Image
                      src={icon}
                      alt="icon"
                      width={62}
                      height={73}
                      className="mb-6 object-cover w-[3.875rem] h-[4.563rem]"
                    />
                  )}
                  <Heading otherClasses="text-h2 font-medium mb-4 text-white">
                    {props[`cards_${index}_heading`]}
                  </Heading>
                  <HtmlBlock
                    className="text-p2 font-normal text-white tracking-[0.006rem]"
                    content={props[`cards_${index}_text`]}
                  />
                </div>
                <div className={"flex gap-x-4 items-center"}>
                  <CustomLink {...button} otherClasses={`mt-[1.375rem] ${isEven % 2 === 0 && button?.variant == 5 ? "hover:!border-brand-white" : ""}`} />
                  <CustomLink {...button2} otherClasses={`mt-[1.375rem] ${isEven % 2 === 0 && button?.variant == 5 ? "hover:!border-brand-white" : ""}`} />
                </div>
              </div>
            );
          })}
      </div>
    </section>
  );
};

export default CtaDoubleCta;
