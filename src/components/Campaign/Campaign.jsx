import React, { useEffect } from 'react';
import useLocalStorageState from '@/src/utils/useLocalStorageState';
import HtmlBlock from '@/src/components/HtmlBlock';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { find } from 'lodash';
import CustomLink from '../CustomLink';
import Icon from '../Icon';
import Heading from '../Heading';
import NextImage from '@/src/components/NextImage';

export default function Campaign({ data }) {
  const { title, content, featuredImage, overlayFields, slug } = data || {};
  const {
    callToActionLabel,
    callToActionUrl,
    closeLabel,
    endDate,
    popUpTiming,
    startDate,
    popUpLocation
  } = overlayFields || {};
  const router = useRouter();
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
  }, [router.asPath]);

  return (
    <>
      <div
        id="modal"
        className="modal fade fixed left-0 top-0 z-[9999] hidden h-screen w-full overflow-x-hidden bg-black/70 outline-none transition duration-150 ease-in-out overflow-y-scroll"
      >
        <div className="m-auto flex w-full max-w-4xl items-center justify-center bg-brand-teal">
          <div className="relative">
            <div className="relative text-center">
              <div className="w-full">
                <Heading
                  type="h2"
                  className="bg-brand-pink text-h3 font-semibold text-white py-6 px-6"
                >
                  {title}
                </Heading>
                <div className={'px-10'}>
                  <Image
                    src={featuredImage?.node?.sourceUrl ?? '/images/placeholder.jpg'}
                    layout="responsive"
                    width={featuredImage?.node?.mediaDetails?.width || 1000}
                    height={featuredImage?.node?.mediaDetails?.height || 500}
                    alt={featuredImage?.node?.title}
                    className="!h-[300px] object-cover object-center"
                  />
                </div>
                <div className="px-12 pb-9 pt-8 bg-brand-blue">
                  <HtmlBlock
                    className="mb-4 px-12 text-p2 [&>p]:!text-p2 [&>p]:!font-normal text-white"
                    content={content}
                  />
                  <div className="flex justify-center">
                    <CustomLink
                      variant="primary"
                      anchor={{
                        url: callToActionUrl,
                        title: callToActionLabel,
                        target: '_blank'
                      }}
                      otherClasses="!py-3 !px-7 !font-normal text-p2 !bg-brand-royal-blue !border-brand-royal-blue"
                    />
                  </div>
                </div>
                <div className={'bg-white py-4 flex justify-center'}>
                  <div className="z-50 py-2 box-border bg-brand-saffron rounded-full w-10 h-10 flex justify-center">
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
                      <Icon
                        icon="cross-icon-white-without-background"
                        iconHeight={20}
                        iconWidth={20}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
