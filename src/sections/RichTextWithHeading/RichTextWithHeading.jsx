import HtmlBlock from '@/src/components/HtmlBlock';
import React from 'react';

export default function RichTextWithHeading(props) {
  const { heading, description } = props;

  return (
    <section data-testid="rich-text-editor-with-heading" className={`container mx-auto my-12`}>
      <div className={"bg-brand-neutral-3 bg-[url('/images/richtext-with-heading-bg.svg')] py-14 px-16 bg-no-repeat bg-right-bottom"}>
        <h3 className={"text-brand-royal-blue text-h3 font-semibold pb-6 mb-6 border-b border-brand-blue-sky"}>{heading}</h3>
        <HtmlBlock content={description} className="text-brand-black-200 text-p3 pr-24" />
      </div>
    </section>
  );
}
