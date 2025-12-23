import HtmlBlock from '@/src/components/HtmlBlock';
import NextImage from '@/src/components/NextImage';
import NextLink from '@/src/components/NextLink';
import React from 'react';

const IconWithContent = (props) => {
  const { image, content, link } = props;
  return (
    <section
      data-testid="icon-with-content"
      className="bg-brand-neutral my-5 lg:my-10 py-5 lg:py-10"
    >
      <div className="container">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-5">
          <div className="lg:w-[30%]">
            <NextLink href={link.url}>
              <NextImage
                {...image}
                otherClasses="w-full lg:w-[90%] min-h-[300px] object-contain object-center z-10"
              />
            </NextLink>
          </div>
          <div className="lg:w-[70%] bg-brand-teal p-5 lg:p-10">
            {content && (
              <HtmlBlock
                content={content}
                className="text-white text-p2 font-normal font-manrope [&>p>a]:!decoration-white"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IconWithContent;
