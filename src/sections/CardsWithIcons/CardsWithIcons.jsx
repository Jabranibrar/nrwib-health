import CustomLink from '@/src/components/CustomLink';
import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';
import NextImage from '@/src/components/NextImage';
import React from 'react';

const CardsWithIcons = (props) => {
  const cards = Array.from({ length: props.card }).map((_, i) => {
    return {
      icon: props[`card_${i}_icon`],
      content: props[`card_${i}_content`],
      anchor: props[`card_${i}_button_anchor`],
      variant: props[`card_${i}_button_variant`]
    };
  });

  return (
    <section data-testid="cards-with-icons" className="bg-brand-neutral-3 mt-10 p-10">
      <div className="container">
        <div className="flex items-center justify-center mb-10">
          {props.heading && (
            <Heading type="h2" otherClasses="text-brand-royal-blue font-manrope font-semibold">
              {props.heading}
            </Heading>
          )}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 items-center justify-between gap-5">
          {cards.map((card, i) => {
            const button = {
              anchor: card.anchor,
              variant: card.variant
            };
            const isEven = i % 2 === 0;
            const icon = card.icon;
            return (
              <div
                key={i}
                className={`w-full p-5 min-h-[300px] flex flex-col items-start justify-start gap-10 ${
                  isEven ? 'bg-brand-teal text-white' : 'bg-white text-black'
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-full  flex items-center justify-center overflow-hidden p-3 ${isEven ? 'bg-white' : 'bg-brand-teal'}`}
                >
                  <NextImage {...icon} otherClasses="w-full h-full object-contain object-center" />
                </div>
                <div className="flex flex-col items-start justify-between min-h-[180px]">
                  {card.content && (
                    <HtmlBlock
                      content={card.content}
                      className={`text-inherit font-manrope text-p2 font-normal ${isEven ? '[&>strong]:!text-white' : '[&>p>strong]:!text-black'} `}
                    />
                  )}
                  {button.anchor && <CustomLink {...button} otherClasses="mt-5 text-inherit" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CardsWithIcons;
