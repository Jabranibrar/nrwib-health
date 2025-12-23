import Image from 'next/image';
import Heading from '../Heading';
import HtmlBlock from '../HtmlBlock';
import clsx from 'clsx';

export default function CuatomAccordion({
  heading,
  body,
  iconUrl,
  iconClasses,
  headingClasses,
  headingContainerClasses,
  bodyContainerClasses,
  bodyTextClasses,
  isOpen,
  bubbleText,
  bubbleTextClasses,
  activeAccordionIconUrl
}) {
  const accordionIcon = isOpen ? (activeAccordionIconUrl ?? iconUrl) : iconUrl;

  const showIcon = !body || body === '';

  return (
    <div>
      <div
        className={clsx(
          headingContainerClasses,
          'flex justify-between items-center gap-5 transition-all duration-300'
        )}
      >
        <div className="flex justify-center items-center gap-[1.188rem]">
          {bubbleText && <span className={bubbleTextClasses}>{bubbleText}</span>}
          <Heading otherClasses={headingClasses}>{heading}</Heading>
        </div>
        {!showIcon && (
          <div
            className={clsx(iconClasses ? iconClasses : 'h-[1.375rem] w-[1.375rem] ', 'relative')}
          >
            <Image
              src={accordionIcon}
              fill
              className={clsx(
                !activeAccordionIconUrl && isOpen && 'rotate-90',
                'transition-all duration-300'
              )}
            />
          </div>
        )}
      </div>

      <div className={clsx(isOpen ? 'block' : 'hidden', bodyContainerClasses)}>
        <HtmlBlock content={body} className={bodyTextClasses} />
      </div>
    </div>
  );
}
