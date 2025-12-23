import React from 'react';
import clsx from 'clsx';
import Image from 'next/image';

export const NextImage = (
  {
    otherClasses,
    url,
    mediaItemUrl,
    alt,
    mediaDetails: { height: mHeight = 0, width: mWidth = 0 } = {},
    height,
    width,
    priority = true,
    sizes,
    fill = false
  },
  props
) => {
  const nextImageClasses = clsx(otherClasses);
  if (!url && !mediaItemUrl) {
    return null;
  }

  return fill ? (
    <Image
      {...props}
      alt={alt}
      src={url || mediaItemUrl}
      className={nextImageClasses}
      priority={priority}
      sizes={sizes}
      fill={fill}
    />
  ) : (
    <Image
      {...props}
      alt={alt}
      src={url || mediaItemUrl}
      height={mHeight ? mHeight : height ? height : 0}
      width={mWidth ? mWidth : width ? width : 0}
      className={nextImageClasses}
      priority={priority}
      sizes={sizes}
    />
  );
};

export default NextImage;
