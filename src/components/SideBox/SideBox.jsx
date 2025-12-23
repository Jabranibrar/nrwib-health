import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { find } from 'lodash';
import useLocalStorageState from '@/src/utils/useLocalStorageState';
import HtmlBlock from '../HtmlBlock';
import CustomLink from '../CustomLink';
import Heading from '../Heading';
import Icon from '../Icon';

export default function SideBox({ data }) {
  const { title, content, featuredImage, overlayFields, slug } = data || {};
  const { endDate, popUpTiming, callToActionLabel, callToActionUrl, startDate, popUpLocation } =
    overlayFields || {};
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
        className="modal fade fixed bottom-5 right-10 z-[9999] hidden bg-brand-blue pb-5 pl-6 pt-6 outline-none transition duration-150 ease-in-out"
      >
        <div className="relative m-auto flex w-full max-w-[300px] items-stretch justify-between">
          <div className="relative w-full py-8 pl-8 md:pr-8 lg:pr-12">
            <Heading
              type="h6"
              className="mb-4 font-arial text-h3 text-center font-semibold text-white pb-3 border-b-2 border-b-white"
            >
              {title}
            </Heading>
            <HtmlBlock className="mb-8 text-p2 font-light text-white" content={content} />
            <div className="flex justify-center">
              <CustomLink
                variant="green-right-arrow"
                anchor={{
                  url: callToActionUrl,
                  title: callToActionLabel,
                  target: '_blank'
                }}
                otherClasses="!py-3 !pl-6 !pr-3 !text-base !font-normal"
              />
            </div>
          </div>
        </div>
        <div className="z-50 py-2 box-border absolute -right-5 -top-5 bg-brand-saffron rounded-full w-10 h-10 flex items-center justify-center">
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
    </>
  );
}
