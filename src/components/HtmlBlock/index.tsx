import { HTMLAttributes } from 'react';
import styles from './HtmlBlock.module.scss';

interface HtmlBlockProps extends HTMLAttributes<HTMLDivElement> {
  content: string;
}

export default function HtmlBlock({ content = '', className = '', ...rest }: HtmlBlockProps) {
  const str = content
    // Replace links that are not internal (i.e., do not start with "/") and not "#"
    ?.replace(/<a\s+href=(?!(["']?\/|["']?#))/gi, '<a target="_blank" rel="noopener" href=')
    // Replace youtu.be links
    .replace(/youtu\.be\//gi, 'youtube.com/embed/')
    // Replace standard YouTube watch links
    .replace(/youtube\.com\/watch\?v=/gi, 'youtube.com/embed/');

  return (
    <div
      className={`${styles.htmlBlock} ${className}`}
      {...rest}
      dangerouslySetInnerHTML={{ __html: str }}
    />
  );
}
