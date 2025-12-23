import Heading from '@/src/components/Heading';
import Link from 'next/link';
import styles from './GlobalSearch.module.scss';
import clsx from 'clsx';
import React from 'react';
export const ExploreSection = (props) => {
  const { popular_pages } = props;
  const explorelinks = Array(popular_pages)
    ?.fill(null)
    ?.map((_, index) => {
      return {
        link: props?.[`popular_pages_${index}_link`]
      };
    });

  return (
    explorelinks?.length > 0 && (
      <div className="bg-brand-neutral">
        <div className="py-14 lg:px-10 px-5 mx-auto w-full max-w-screen-xl">
          <Heading otherClasses="text-brand-royal-blue text-h2 font-medium tracking-[0.05rem]">
            Explore Popular Pages
          </Heading>
          <div
            className={clsx(
              styles.gridCols,
              'grid grid-flow-row mt-8 gap-y-10 justify-between gap-x-5'
            )}
          >
            {explorelinks?.map((item, i) => {
              return (
                <Link
                  href={item?.link?.url || '#'}
                  key={i}
                  target="_blank"
                  className="text-brand-dark-grey text-h4 font-normal underline !w-fit"
                >
                  <span dangerouslySetInnerHTML={{__html: item?.link?.title}} />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    )
  );
};
