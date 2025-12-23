import HtmlBlock from '@/src/components/HtmlBlock';
import React from 'react';
import styles from './SectionRichTextOnly.module.scss';
import clsx from 'clsx';

const SectionRichTextOnly = ({ content }) => {
  return (
    <section className="container mb-10">
      <HtmlBlock
        className={clsx(
          'text-p2  [&>p>strong]:!text-brand-darker [&>strong]:!text-brand-darker font-normal font-manrope',
          styles.content
        )}
        content={content}
      />
    </section>
  );
};

export default SectionRichTextOnly;
