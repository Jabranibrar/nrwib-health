import Heading from '@/src/components/Heading';
import NextImage from '@/src/components/NextImage';
import NextLink from '@/src/components/NextLink';
import React from 'react';

const PdfGrid = (props) => {
  return (
    <section className="container my-10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        {props.pdfs.map((pdf) => (
          <NextLink
            href={pdf.url}
            otherClasses="w-[32%] p-5 bg-brand-neutral-3 hover:bg-brand-neutral-5 transition-all duration-200 ease-in border border-brand-neutral-5"
            key={pdf.url}
          >
            <div className="relative">
              <div className="absolute top-2 left-2 p-2 bg-brand-blue rounded-lg text-white">
                {pdf.tag}
              </div>
              <NextImage
                height={1000}
                width={1000}
                url={pdf.thumbnail}
                alt=""
                otherClasses="object-cover h-[393px]"
              />
            </div>
            <Heading
              type="h3"
              otherClasses="font-manrope text-brand-royal-blue font-medium mt-5 mb-10"
            >
              {pdf.title}
            </Heading>
            <NextImage
              height={50}
              width={50}
              url="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/download-pdf-button.svg"
              alt=""
            />
          </NextLink>
        ))}
      </div>
    </section>
  );
};

export default PdfGrid;
