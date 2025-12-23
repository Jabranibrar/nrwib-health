import React from 'react';
import Link from 'next/link';
import useCheckIfExternalUrl from '../../hooks/useCheckIfExternalUrl';

export const NextLink = ({
  otherClasses,
  href,
  target,
  as,
  scroll,
  children,
  onClick,
  ...rest
}) => {
  const isExternalUrl = useCheckIfExternalUrl(href);

  return (
    <Link
      {...rest}
      onClick={onClick}
      as={as || ''}
      href={href || ''}
      className={otherClasses}
      target={target || (isExternalUrl ? '_target' : '_self')}
      rel={isExternalUrl || target === '_blank' ? 'noopener' : ''}
      scroll={typeof scroll !== 'undefined' ? scroll : true}
    >
      {children}
    </Link>
  );
};

export default NextLink;
