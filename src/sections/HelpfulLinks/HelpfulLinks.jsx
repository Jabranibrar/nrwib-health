import Heading from '@/src/components/Heading';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

function HelpFulLinks(props) {
  const { helpful_links } = props;

  return (
    <section
      className="w-full max-w-screen-xl lg:px-10 px-5 mx-auto mb-10"
      data-testid="helpful-links"
    >
      {Array(helpful_links)
        .fill(null)
        .map((_, index, arr) => {
          const isLast = index === arr.length - 1;

          return props[`helpful_links_${index}_link`]?.url ? (
            <Link
              rel="noopener noreferrer"
              target={'_blank'}
              href={props[`helpful_links_${index}_link`]?.url}
            >
              <div
                key={index}
                className={`bg-brand-neutral-3 hover:bg-brand-dark-grey/10 transition-all duration-300 w-full py-6 px-9 gap-5 flex justify-between items-center ${
                  isLast ? '' : 'mb-4'
                }`}
              >
                <Heading className="text-brand-royal-blue text-p1 font-medium">
                  {props[`helpful_links_${index}_link`]?.title}
                </Heading>

                <Image
                  src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/09/link-4-1.svg"
                  alt="link-icon"
                  width={24}
                  height={24}
                  className="min-h-6 min-w-6"
                />
              </div>
            </Link>
          ) : (
            <div
              key={index}
              className={`bg-brand-neutral-3 w-full py-6 px-9 gap-5 flex justify-between items-center ${
                isLast ? '' : 'mb-4'
              }`}
            >
              <Heading className="text-brand-royal-blue text-p1 font-medium">
                {props[`helpful_links_${index}_link`]?.title}
              </Heading>

              <Image
                src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/09/link-4-1.svg"
                alt="link-icon"
                width={24}
                height={24}
                className="min-h-6 min-w-6"
              />
            </div>
          );
        })}
    </section>
  );
}

export default HelpFulLinks;
