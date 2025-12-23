import CustomLink from '@/src/components/CustomLink';
import clsx from 'clsx';
import React from 'react';

const NavigationTab = (props) => {
  const tabs = Array(props.tabs)
    .fill(null)
    .map((_, i) => {
      return {
        anchor: props[`tabs_${i}_anchor`],
        active: Boolean(parseInt(props[`tabs_${i}_active`]))
      };
    });
  return (
    <section className="mb-5">
      <div className="container pt-10 pb-5">
        <div id={'tab-group-1'} className="flex flex-wrap gap-4 items-center justify-center">
          {tabs.map((tab, index) => (
            <CustomLink
              key={index}
              variant={7}
              otherClasses={clsx(
                `!text-left lg:text-center !rounded-lg hover:!bg-brand-teal hover:!border-brand-teal !font-normal !w-full lg:!w-fit`,
                tab.active ? `!bg-brand-teal !border-brand-teal !text-white` : `border-brand-teal`
              )}
              anchor={tab.anchor}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NavigationTab;
