import React from 'react';
import CountUp from 'react-countup';
import Heading from '@/src/components/Heading';
import HtmlBlock from '@/src/components/HtmlBlock';

const StatsBlock = (props) => {
  const { stats_cards } = props;
  return (
    <section className="bg-brand-neutral-2 w-full mb-10 py-10">
      <div className="max-w-screen-xl w-full lg:px-10 px-5 mx-auto">
        <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-9">
          {Array(stats_cards)
            ?.fill(null)
            ?.map((_, index, array) => {
              const isLast = index === array.length - 1;
              const isEven = (index + 1) % 2 === 0;
              const isAtThree = (index + 1) % 3 === 0;
              const isPlus = props[`stats_cards_${index}_add_plus`] == 1;
              return (
                <div
                  className={`sm:max-w-[27.5rem] w-full pr-[2.25rem] ${isLast ? '' : `${isEven ? 'border-b sm:border-b-0 pb-8 sm:pb-0 lg:border-r border-white' : `${isAtThree ? 'border-b sm:border-b-0 pb-8 sm:pb-0 sm:border-r lg:border-none border-white' : 'border-b sm:border-b-0 pb-8 sm:pb-0 sm:border-r border-white'}`}`} `}
                  key={index}
                >
                  <Heading otherClasses={'text-oversized font-bold mb-3 text-brand-saffron'}>
                    <CountUp
                      duration={1}
                      end={props[`stats_cards_${index}_number`]}
                      enableScrollSpy
                    />
                    {isPlus && <span>+</span>}
                  </Heading>
                  <Heading otherClasses={'text-h2 text-brand-royal-blue mb-3 font-medium'}>
                    {props[`stats_cards_${index}_title`]}
                  </Heading>
                  <HtmlBlock
                    className="text-p2 text-brand-dark-grey"
                    content={props[`stats_cards_${index}_description`]}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </section>
  );
};

export default StatsBlock;
