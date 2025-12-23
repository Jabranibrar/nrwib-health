import React from "react";
import clsx from "clsx";

const elements = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
};

export const Heading = ({ type, children, otherClasses, ...props }) => {
  const className = clsx(otherClasses);

  return React.createElement(
    elements[type] || elements.h1,
    { className, ...props },
    children
  );
};

export default Heading;
