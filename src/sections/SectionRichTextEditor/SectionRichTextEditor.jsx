import HtmlBlock from '@/src/components/HtmlBlock';
import React from 'react';

export default function SectionRichTextEditor(props) {
  const { text, put_inside_container, enable_top_margin} = props;

  return (
    <section data-testid="rich-text-editor" className={`${put_inside_container ? 'container mx-auto' : 'max-w-[68.5rem]'} w-full px-5 mx-auto mb-10 ${enable_top_margin ? 'mt-16' : 'mt-0'}`}>
      <div className='bg-brand-neutral p-12 border-b-[0.25rem] border-b-brand-green'>
        <HtmlBlock content={text} className="text-[2rem] [&>p]:!text-[2rem] leading-[2.75rem] [&>p]:!leading-[2.75rem] text-center text-brand-royal-blue font-semibold" />
      </div>
    </section>
  );
}
