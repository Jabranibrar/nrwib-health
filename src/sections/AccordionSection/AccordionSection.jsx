import CustomAccordion from '@/src/components/CustomAccordion';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { format, parse } from 'date-fns';

export default function AccordionSection(props) {
  const { accordion } = props;
  const [activeAccordion, setActiveAccordion] = useState(null);

  const handleAccordionClick = (index) => {
    if (!props[`accordion_${index}_text`] || props[`accordion_${index}_text`] === '') return;
    if (activeAccordion === index) {
      setActiveAccordion(null);
    } else {
      setActiveAccordion(index);
    }
  };

  const formatTime = (time) => {
    const parsedTime = parse(time, 'HH:mm:ss', new Date());
    const formattedTime = format(parsedTime, 'hh:mm a');
    return formattedTime;
  };

  useEffect(() => {
    for (let i = 0; i < accordion; i++) {
      if (props[`accordion_${i}_open`] === '1') {
        setActiveAccordion(i);
      }
    }
  }, []);

  return (
    <section data-testid="accordion-section" className="container mb-10">
      <div className="flex flex-col">
        {Array(accordion)
          .fill(null)
          .map((_, i) => {
            const isActive = activeAccordion === i;
            const timeText = props[`accordion_${i}_time`]
              ? formatTime(props[`accordion_${i}_time`])
              : false;

            return (
              <div key={i} onClick={() => handleAccordionClick(i)}>
                <CustomAccordion
                  key={i}
                  isOpen={isActive ? true : false}
                  bubbleText={timeText}
                  bubbleTextClasses={clsx(
                    isActive ? 'bg-white text-brand-blue-sky' : 'bg-brand-blue text-white',
                    'px-2 pt-1 pb-1 text-center text-p4 font-normal rounded-[0.25rem]'
                  )}
                  headingContainerClasses={clsx(
                    isActive ? 'bg-brand-blue' : 'bg-white',
                    'cursor-pointer md:px-7 py-7 px-5 border-t border-b border-brand-neutral-5'
                  )}
                  bodyContainerClasses="md:pr-[5.125rem] md:pl-[1.875rem] px-5 pt-[2.313rem] pb-[2.375rem] bg-brand-neutral-2"
                  bodyTextClasses="text-brand-grey-dark text-p2 font-normal tracking-[0.006rem]"
                  iconUrl="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/09/Group-2.svg"
                  activeAccordionIconUrl="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/09/Group-1-1.svg"
                  iconClasses="h-[1.375rem] w-[1.375rem]"
                  headingClasses={clsx(
                    isActive ? 'text-white' : 'text-brand-grey-dark',
                    'text-p1 font-medium'
                  )}
                  heading={props[`accordion_${i}_title`]}
                  body={props[`accordion_${i}_text`]}
                />
              </div>
            );
          })}
      </div>
    </section>
  );
}
