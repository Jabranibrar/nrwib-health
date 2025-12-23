import { useEffect } from 'react';
import useLocalStorageState from '@/src/utils/useLocalStorageState';
import HtmlBlock from '@/src/components/HtmlBlock';
import Icon from '../Icon';
import CustomLink from '../CustomLink';

export default function AnnouncementPanel({ data }) {
  const { title, content, featuredImage, overlayFields, slug } = data || {};
  const {
    callToActionLabel,
    callToActionUrl,
    endDate,
    popUpTiming,
    startDate,
    popUpLocation,
    announcementBarStyle
  } = overlayFields || {};

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
      setTimeout(function () {
        modalHandler(true);
      }, 0);
    }
  }, []);

  const truncatedContent = content.length > 50 ? content.slice(0, 140) + ' &#x2192;' : content;

  return (
    <>
      <div
        id="modal"
        className="modal fade announcement-panel relative z-50 hidden w-full overflow-x-hidden bg-brand-teal p-3 outline-none transition duration-150 ease-in-out lg:overflow-y-hidden"
      >
        <div className="m-auto w-full container relative py-5">
          {'Longer' == announcementBarStyle ? (
            <div className={'container mx-auto'}>
              <div className={'flex items-center justify-between'}>
                <div className={'w-full'}>
                  <h2 className="pr-2 text-p2 font-semibold text-white pb-2">{title}:</h2>
                  <HtmlBlock
                    className="inline text-p3 [&>p]:!text-p3 !font-normal text-white"
                    content={content}
                  />
                  <CustomLink
                    variant="primary"
                    anchor={{
                      url: callToActionUrl,
                      title: callToActionLabel,
                      target: '_blank'
                    }}
                    otherClasses="!py-3 font-semibold text-p2 !bg-brand-blue !border-brand-blue mt-3"
                  />
                </div>
                <div className="z-50 py-2 box-border absolute right-10 top-0 lg:top-12 bg-brand-blue rounded-full w-10 h-10 flex items-center justify-center">
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
          ) : (
            <div className="flex lg:flex-row flex-col items-center justify-start">
              <h2 className="pr-2 text-p2 font-semibold text-white lg:w-[10%]">{title}:</h2>
              <HtmlBlock
                className="inline text-p3 [&>p]:!text-p3 !font-normal text-white"
                content={truncatedContent}
              />
              <div className="z-50 py-2 box-border absolute right-10 top-2 bg-brand-blue rounded-full w-10 h-10 flex items-center justify-center">
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
          )}
        </div>
      </div>
    </>
  );
}
