import React from 'react';
import clsx from 'clsx';
import NextImage from '../NextImage';
import NextLink from '../NextLink';
import Icon from '../Icon';

export const CustomLink = ({
  otherClasses,
  variant,
  anchor,
  onClick = () => {},
  buttonLogo,
  scroll,
  scrollID
}) => {
  const { title, target, url } = anchor || {};

  if (!isNaN(variant)) variant = mapVariant(variant);

  let children;

  let cond =
    (variant != null && variant.constructor.name === 'Object' ? variant?.name : variant) +
    '-button';

  switch (cond) {
    case 'primary-button':
      children = (
        <>
          {title}
          <Icon icon="button-arrow-icon" iconHeight={20} iconWidth={20} />
        </>
      );
      break;
    case 'primary-outline-button':
      children = (
        <>
          {title}
          <Icon icon="button-arrow-icon" iconHeight={20} iconWidth={20} />
        </>
      );
      break;
    case 'green-right-arrow-button':
      children = (
        <>
          {title}
          <Icon icon="button-arrow-icon" iconHeight={20} iconWidth={20} />
        </>
      );
      break;
    case 'green-outline-right-arrow-button':
      children = (
        <>
          {title}
          <Icon icon="green-right" iconColor="#BDD358" iconHeight={16} iconWidth={16} />
        </>
      );
      break;
    case 'teal-right-arrow-button':
      children = (
        <>
          {title}
          <Icon icon="button-arrow-icon" iconHeight={20} iconWidth={20} />
        </>
      );
      break;
    case 'blue-sky-right-arrow-button':
      children = (
        <>
          {title}
          <Icon icon="button-arrow-icon" iconHeight={20} iconWidth={20} />
        </>
      );
      break;
    case 'white-right-arrow-button':
      children = (
        <>
          {title}
          <Icon icon="sky-blue-right-arrow" iconHeight={16} iconWidth={16} />
        </>
      );
      break;
    case 'blue-outline-white-bg-button':
      children = (
        <>
          {title}
          <Icon icon="sky-blue-right-arrow" iconHeight={16} iconWidth={16} />
        </>
      );
      break;
    case 'blue-outline-arrow-right-button':
      children = (
        <>
          {title}
          <Icon icon="sky-blue-right-arrow" iconHeight={16} iconWidth={16} />
        </>
      );
      break;

    default:
      children = <>{title}</>;
      break;
  }

  return (
    <NextLink
      href={scrollID ? `${url}/${scrollID}` : url}
      target={target}
      scroll={scroll}
      onClick={onClick}
      otherClasses={clsx(otherClasses, cond)}
    >
      {buttonLogo?.position === 'before' && (
        <NextImage otherClasses="!max-w-[4.813rem] !max-h-[1.875rem]" {...buttonLogo} />
      )}
      {children}
      {buttonLogo?.position === 'after' && (
        <NextImage otherClasses="!max-w-[4.813rem] !max-h-[1.875rem]" {...buttonLogo} />
      )}
    </NextLink>
  );
};

export default CustomLink;

export function mapVariant(variant) {
  const variants = {
    4: 'primary',
    5: 'primary-outline',
    6: 'secondary',
    7: 'secondary-outline',
    8: 'green-right-arrow',
    9: 'green-outline-right-arrow',
    10: 'teal-right-arrow',
    11: 'white-right-arrow',
    16: 'blue-outline-white-bg',
    105: 'blue-sky-right-arrow',
    120: 'blue-outline-arrow-right'
  };

  return variants[variant];
}
