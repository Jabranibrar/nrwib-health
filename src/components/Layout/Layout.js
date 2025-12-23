import React, { useEffect } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import BackToTop from '../BackToTop';
import Icon from '../Icon';
import Accessibility from '../Accessibility';
import useLocalStorageState from '@/src/utils/useLocalStorageState';
import OverlaysSection from '@/src/sections/OverlaySection';

export const Layout = (props) => {
  const {
    isPopup,
    isMemberPortal,
    children,
    onPrev,
    onNext,
    nextItem,
    previousItem,
    onClose,
    data,
    navbar,
    overlays
  } = props;
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child);
    }
    return child;
  });

  const [accessibilitySettings, setAccessibilitySettings] = useLocalStorageState(
    'accessibilitySettings',
    {
      colorContrast: false,
      highlightLinks: false,
      textSize: 0,
      letterSpacing: 0,
      pauseAnimations: false,
      cursorSize: 0
    }
  );

  useEffect(() => {
    if (accessibilitySettings.textSize > 0) {
      document.documentElement.style.setProperty(
        'font-size',
        `${75 + accessibilitySettings.textSize * 20}%`,
        'important'
      );
    } else {
      document.documentElement.style.fontSize = '';
    }
  }, [accessibilitySettings.textSize]);

  useEffect(() => {
    if (accessibilitySettings.letterSpacing > 0) {
      document.documentElement.style.letterSpacing = `${
        accessibilitySettings.letterSpacing * 0.05
      }em`;
    } else {
      document.documentElement.style.letterSpacing = '';
    }
  }, [accessibilitySettings.letterSpacing]);

  useEffect(() => {
    if (accessibilitySettings.colorContrast) {
      document.documentElement.classList.add('accessibility-color-contrast');
    } else {
      document.documentElement.classList.remove('accessibility-color-contrast');
    }
  }, [accessibilitySettings.colorContrast]);

  useEffect(() => {
    if (accessibilitySettings.highlightLinks) {
      document.documentElement.classList.add('accessibility-highlight-links');
    } else {
      document.documentElement.classList.remove('accessibility-highlight-links');
    }
  }, [accessibilitySettings.highlightLinks]);

  useEffect(() => {
    if (accessibilitySettings.pauseAnimations) {
      document.documentElement.classList.add('accessibility-pause-animations');
      document.getAnimations().forEach((animation) => {
        animation.cancel();
      });
    } else {
      document.documentElement.classList.remove('accessibility-pause-animations');
      document.getAnimations().forEach((animation) => {
        animation.play();
      });
    }
  }, [accessibilitySettings.pauseAnimations]);

  useEffect(() => {
    if (accessibilitySettings.cursorSize > 0) {
      document.documentElement.classList.add(
        `accessibility-cursor-size-${accessibilitySettings.cursorSize}`
      );
    } else {
      document.documentElement.classList.remove(
        'accessibility-cursor-size-1',
        'accessibility-cursor-size-2'
      );
    }
  }, [accessibilitySettings.cursorSize]);

  return (
    <>
      <OverlaysSection data={overlays} />

      <Header
        isMemberPortal={isMemberPortal}
        isPopup={isPopup}
        onClose={onClose}
        submenuData={data}
        allNavbarData={navbar}
      />

      <Accessibility
        accessibilitySettings={accessibilitySettings}
        setAccessibilitySettings={setAccessibilitySettings}
      />

      <BackToTop />

      {isPopup && (
        <PopupNavigation
          onPrev={onPrev}
          onNext={onNext}
          nextItem={nextItem}
          previousItem={previousItem}
        />
      )}

      <main>{childrenWithProps}</main>

      <Footer data={data} isPopup={isPopup} />
    </>
  );
};

export default Layout;

const PopupNavigation = ({ onPrev, onNext, nextItem, previousItem }) => {
  return (
    <div className="popup-navigation hidden md:!block lg:!block">
      {previousItem && (
        <div
          onClick={onPrev}
          className="pt-4 cursor-pointer min-h-[100px] border-r text-right px-4 transition-all border-brand-blue min-w-[100px] font-semibold fixed left-0 z-[100] top-[65vh] group"
        >
          <div className="flex items-center mb-2">
            <Icon
              icon="chevron-right"
              otherClasses="rotate-[-180deg]"
              iconWidth={20}
              iconHeight={20}
            />
            <div className="text-p2 text-brand-blue-sky font-semibold">Previous</div>
          </div>
          <div className="text-brand-dark-gray font-normal ">{previousItem}</div>
        </div>
      )}

      {nextItem && (
        <div
          onClick={onNext}
          className="pt-4 cursor-pointer min-h-[100px] border-l text-right px-4 transition-all border-brand-blue min-w-[100px] font-semibold fixed right-0 z-[100] top-[65vh] group"
        >
          <div className="flex items-center mb-2">
            <div className="text-p2 text-brand-blue-sky font-semibold">Next</div>
            <Icon icon="chevron-right" iconWidth={20} iconHeight={20} />
          </div>
          <div className="text-brand-dark-gray font-normal ">{nextItem}</div>
        </div>
      )}
    </div>
  );
};
