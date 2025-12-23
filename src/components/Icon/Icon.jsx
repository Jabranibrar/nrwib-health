import React from 'react';

export const Icon = ({
  icon,
  iconColor,
  stroke,
  iconWidth = 26,
  iconHeight = 26,
  otherClasses,
  ...props
}) => {
  return (
    <svg
      stroke={stroke}
      className={otherClasses}
      data-testid="icon"
      style={{ stroke: iconColor }}
      width={`${iconWidth / 16}rem`}
      height={`${iconHeight / 16}rem`}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <use href={`/sprite.svg#${icon}`} xlinkHref={`/sprite.svg#${icon}`}></use>
    </svg>
  );
};

export default Icon;
