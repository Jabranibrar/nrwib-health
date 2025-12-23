import clsx from 'clsx';
import Link from 'next/link';

export default function SubTabs(data) {
  const { tabs } = data;

  return (
    <section data-testid="sub-tabs" className="w-full mb-10 bg-brand-neutral-3">
      <div className="w-full max-w-screen-xl lg:px-10 px-5 py-6 mx-auto flex flex-wrap sm:flex-row flex-col justify-center items-center">
        {Array(tabs)
          .fill(null)
          .map((_, i) => {
            return (
              <Link
                key={i}
                href={data[`tabs_${i}_tab`]?.url ?? ''}
                className={clsx(
                  data[`tabs_${i}_is_active`] === '1'
                    ? 'text-white bg-brand-blue-sky'
                    : 'text-brand-blue-sky bg-white',
                  'border border-brand-blue-sky text-p2 font-normal tracking-[0.006rem] py-4 px-10 w-full sm:w-fit text-center'
                )}
                scroll={false}
              >
                {data[`tabs_${i}_tab`]?.title}
              </Link>
            );
          })}
      </div>
    </section>
  );
}
