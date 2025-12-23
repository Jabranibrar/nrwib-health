import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Heading from '@/src/components/Heading';

export default function TabsNavigation(data) {
  const { heading, tabs } = data;

  return (
    <section data-testid="tabs-navigation" className="max-w-screen-xl lg:px-10 px-5 mx-auto my-16">
      {
        heading ?
          <>
            <Heading
              type="h2"
              otherClasses="text-h2 lg:text-h1 font-manrope font-semibold mb-12 text-brand-royal-blue text-center"
            >
              {heading}
            </Heading>
          </>: <></>
      }
      <div id={'tab-group-1'} className="flex justify-center items-center gap-6 flex-wrap">
        {Array(tabs)
          .fill(null)
          .map((_, i) => {
            return (
              <Link
                key={i}
                href={data[`tabs_${i}_tab`]?.url || ''}
                scroll={false}
                className={`px-6 py-4 text-p2 tracking-[0.006rem] font-normal rounded-lg border border-brand-teal ${data[`tabs_${i}_is_active`]?.includes('1') ? 'text-white bg-brand-teal' : 'bg-white text-brand-darker'} `}
              >
                {data[`tabs_${i}_tab`]?.title}
              </Link>
            );
          })}
      </div>
    </section>
  );
}
