import HtmlBlock from '@/src/components/HtmlBlock';
import Image from 'next/image';
import Link from 'next/link';
import { Highlight } from 'react-instantsearch';
import { decode } from 'html-entities';
import styles from './GlobalSearch.module.scss'

export default function GlobalSearchResult({ hit }) {
  const { post_date } = hit;
  const date = new Date(post_date);

  const formattedDate = date?.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: '2-digit'
  });
  const getHighlightedContent = () => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = hit._highlightResult?.post_title?.value;
    return decode(tempDiv.innerHTML);
  };

  return (
    <Link
      href={hit?.url ? hit?.url : '#'}
      target="_blank"
      className="mt-6 flex flex-col gap-4 cursor-pointer"
    >
      <div className={`border border-brand-neutral-6 p-6 flex flex-row items-center ${styles.cardWrapper} gap-6`}>
        <div
          className={`h-auto ${hit?.post_thumbnail ? 'min-h-[8.7rem] sm:max-w-[15.3rem] ' : 'min-h-[4.7rem] max-w-[8rem] '} w-full relative`}
        >
          {hit?.post_thumbnail ? (
            <Image src={hit?.post_thumbnail} alt="image" fill className="object-cover" />
          ) : (
            <Image
              src="/images/LogoMark-FullColor.svg"
              alt="image"
              fill
              className="object-contain"
            />
          )}
        </div>

        <div className="flex flex-col justify-between gap-5 w-full">
        <div
            className="text-brand-royal-blue text-p1 leading-[125%] font-normal"
            dangerouslySetInnerHTML={{
              __html: getHighlightedContent()
            }}
          />

          <HtmlBlock content={formattedDate} className="text-brand-black-3 text-p4 font-normal" />
        </div>
      </div>
    </Link>
  );
}
