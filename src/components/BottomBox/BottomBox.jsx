import React, { useEffect } from 'react';
import useLocalStorageState from '@/src/utils/useLocalStorageState';
import HtmlBlock from '@/src/components/HtmlBlock';
import { CustomLink } from '../CustomLink';
import Image from 'next/image';
import Icon from '../Icon';
import NextImage from '@/src/components/NextImage';

export default function BottomBox({ data }) {
  const { title, content, featuredImage, overlayFields, slug } = data || {};
  const { callToActionLabel, callToActionUrl, endDate, popUpTiming, startDate, popUpLocation } =
    overlayFields || {};

  const [popUPInLocalStorage, setPopUPInLocalStorage] = useLocalStorageState(`campaign-${slug}`);
  const modalHandler = (val) => {
    const modal = document.getElementById('modal');
    setPopUPInLocalStorage(true);
    if (val) {
      fadeInModal(modal);
    } else {
      fadeOutModal(modal);
    }
  };

  const fadeOutModal = (el) => {
    el.style.opacity = 1;
    (function fade() {
      if ((el.style.opacity -= 0.1) < 0) {
        el.style.display = 'none';
      } else {
        requestAnimationFrame(fade);
      }
    })();
  };

  const fadeInModal = (el, display) => {
    el.style.opacity = 0;
    el.style.display = display || 'block';
    (function fade() {
      let val = parseFloat(el.style.opacity);
      if (!((val += 0.2) > 1)) {
        el.style.opacity = val;
        requestAnimationFrame(fade);
      }
    })();
  };

  const closeModal = () => {
    modalHandler(false);
  };

  useEffect(() => {
    if (!popUPInLocalStorage) {
      setTimeout(
        function () {
          modalHandler(true);
        },
        parseInt(popUpTiming) * 1000
      );
    }
  }, []);

  return (
    <>
      <div
        id="modal"
        className="modal fade fixed bottom-0 left-0 transition duration-150 ease-in-out z-50 hidden w-full outline-none overflow-x-hidden lg:overflow-y-hidden bg-brand-teal p-6 lg:p-0 bottom-panel border-l-[40px] border-l-brand-saffron"
      >
        <div className="w-full m-auto relative">
          <div className="w-2/4 absolute left-0 top-0 h-full rounded-rb-[5rem]">
            <Image
              className="object-cover object-center rounded-br-[28rem]"
              src={featuredImage?.node?.sourceUrl ?? '/images/placeholder.jpg'}
              layout="responsive"
              width={featuredImage?.node?.mediaDetails?.width || 1000}
              height={featuredImage?.node?.mediaDetails?.height || 500}
              alt={featuredImage?.node?.title}
            />
          </div>
          <div className="absolute flex justify-center top-4 right-4 lg:top-12 lg:right-12 z-50">
            <div className="z-50 py-2 box-border absolute right-10 top-2 bg-brand-saffron rounded-full w-10 h-10 flex items-center justify-center">
              <button
                tabIndex="0"
                type="button"
                onClick={closeModal}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    // Prevent default behavior to avoid unintentional form submission
                    e.preventDefault();
                    closeModal();
                  }
                }}
              >
                <Icon icon="cross-icon-white-without-background" iconHeight={20} iconWidth={20} />
              </button>
            </div>
          </div>

          <div className="max-w-[1440px] lg:relative lg:overflow-hidden mx-auto flex flex-col items-stretch justify-end lg:flex-row lg:pl-32">
            <div className="w-full pt-[40px] pb-0 md:pb-[65px] lg:w-4 px-4 lg:px-0 flex flex-col items-center"></div>
            <div className="bottom-panel-content shrink-0 relative pr-8 lg:pr-14 xxl:pr-6 lg:pl-0 lg:w-[50%] w-full lg:min-h-[320px] overflow-hidden bg-brand-pink flex flex-col justify-center py-8">
              <h2 className="mt-8 lg:mt-0 block text-h1 font-medium mb-8 text-white">{title}</h2>
              <HtmlBlock className="mb-8 text-white text-p2 font-normal" content={content} />
              {callToActionUrl && (
                <CustomLink
                  variant="green-right-arrow"
                  anchor={{
                    url: callToActionUrl,
                    title: callToActionLabel,
                    target: '_blank'
                  }}
                  otherClasses="!py-3 !px-7 !font-normal text-p2 "
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
