import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import { FaAngleRight } from 'react-icons/fa6';
import Image from 'next/image';
import styles from './Accessibility.module.scss';
import AccessIcon from '../../images/accessibility-icon.svg';
import colorContrast from '../../../public/images/color-contrast.svg';
import highlightLinks from '../../../public/images/highlight-links.svg';
import textSize from '../../../public/images/Icon-TextSize.svg';
import letterSpacing from '../../../public/images/Icon-LetterSpacing.svg';
import cursorSize from '../../../public/images/Icon-CursorSize.svg';
import pauseAnimation from '../../../public/images/Icon-PauseAnimation.svg';
import closeButton from '../../images/close.svg';
import { useRouter } from 'next/router';
// import { translate } from '@/src/utils/i18n';

export default function Accessibility({ accessibilitySettings, setAccessibilitySettings }) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const { locale } = useRouter();

  if (!menuIsOpen) {
    return (
      <button
        type="button"
        className="fixed left-2.5 bottom-5 z-50 inline-block"
        aria-label="Accessibility"
        onClick={() => setMenuIsOpen(true)}
      >
        <Image src={AccessIcon} width={50} height={50} alt={'Accessibility'} />
      </button>
    );
  }

  const settingsAreDefault = Object.values(accessibilitySettings).every((settings) => !settings);

  return (
    <div className="z-[200] bg-white border border-brand-green fixed left-0 bottom-0 lg:bottom-5 p-4 text-white w-[300px] h-[400px]  lg:w-[400px] lg:h-[450px] overflow-hidden">
      <div
        className={`px-3 pb-3 flex items-center justify-between flex-wrap border-b-2 border-b-brand-green cursor-pointer `}
      >
        <h3 className="text-black font-bold text-p3 lg:text-p2">{'Accessibility Tools'}</h3>
        <div
          className={` mr-2 lg:mr-0 px-2 py-2 bg-brand-blue text-brand-black-200 font-medium rounded-lg flex items-center gap-2 ${
            settingsAreDefault ? ' hidden' : ''
          }`}
          onClick={() =>
            setAccessibilitySettings({
              colorContrast: false,
              highlightLinks: false,
              textSize: false,
              letterSpacing: false,
              pauseAnimations: false,
              cursorSize: false
            })
          }
        >
          {'Clear All'}
          <FaAngleRight color="#232323" size={14} />
        </div>
        <div>
          <button
            type="button"
            className="bg-brand-navy-light close-tool"
            onClick={() => setMenuIsOpen(false)}
          >
            <Image src={closeButton} width={30} height={30} alt={'Close'} />
          </button>
        </div>
      </div>
      <div
        className={`grid grid-cols-2 gap-2 pr-10 overflow-y-scroll my-5 w-[250px] h-[300px] lg:w-[350px] lg:h-[350px]`}
      >
        <div
          className="w-[100px] h-[100px] lg:w-[150px] lg:h-[130px] bg-brand-neutral flex text-black text-center flex-col items-center justify-center relative cursor-pointer"
          onClick={() =>
            setAccessibilitySettings((prevSettings) => ({
              ...prevSettings,
              colorContrast: !prevSettings.colorContrast
            }))
          }
        >
          <div className={styles.colorContrast}>
            <Image src={colorContrast} layout="fill" objectFit="contain" alt={'Color Contrast'} />
          </div>
          <div className={`font-manrope text-p2 font-light ${styles.label}`}>
            {'Color Contrast'.split(' ').map((word, index) => {
              if (index === 0) {
                return (
                  <>
                    {word} <br />
                  </>
                );
              }
              return word + ' ';
            })}
          </div>
          {accessibilitySettings.colorContrast ? (
            <div className="absolute bottom-2 right-2 w-7 h-7 bg-brand-blue rounded-full flex items-center justify-center">
              <FaCheck color="#232323" size={14} />
            </div>
          ) : null}
        </div>

        <div
          className="w-[100px] h-[100px] lg:w-[150px] lg:h-[130px] p-2 bg-brand-neutral flex text-black text-center flex-col items-center justify-center relative cursor-pointer"
          onClick={() =>
            setAccessibilitySettings((prevSettings) => ({
              ...prevSettings,
              highlightLinks: !prevSettings.highlightLinks
            }))
          }
        >
          <div className={styles.highlightLinks}>
            <Image src={highlightLinks} layout="fill" objectFit="contain" alt={'Highlight Links'} />
          </div>
          <div className={`font-manrope text-p2 font-light ${styles.label}`}>
            {'Highlight Links'.split(' ').map((word, index) => {
              if (index === 0) {
                return (
                  <>
                    {word} <br />
                  </>
                );
              }
              return word + ' ';
            })}
          </div>
          {accessibilitySettings.highlightLinks ? (
            <div className="absolute bottom-2 right-2 w-7 h-7 bg-brand-blue rounded-full flex items-center justify-center">
              <FaCheck color="#232323" size={14} />
            </div>
          ) : null}
        </div>

        <div
          className="w-[100px] h-[100px] lg:w-[150px] lg:h-[130px] p-2 bg-brand-neutral flex text-black text-center flex-col items-center justify-center relative cursor-pointer"
          onClick={() =>
            setAccessibilitySettings((prevSettings) => ({
              ...prevSettings,
              textSize: prevSettings.textSize < 2 ? prevSettings.textSize + 1 : 0
            }))
          }
        >
          <div className={styles.textSize}>
            <Image src={textSize} layout="fill" objectFit="contain" alt={'Text Size'} />
          </div>
          <div className={`font-manrope text-p2 font-light ${styles.label}`}>
            {'Text Size'.split(' ').map((word, index) => {
              if (index === 0) {
                return (
                  <>
                    {word} <br />
                  </>
                );
              }
              return word + ' ';
            })}
          </div>
          {accessibilitySettings.textSize ? (
            <div className="absolute bottom-2 right-2 w-7 h-7 bg-brand-blue rounded-full flex items-center justify-center">
              <FaCheck color="#232323" size={14} />
            </div>
          ) : null}
        </div>

        <div
          className="w-[100px] h-[100px] lg:w-[150px] lg:h-[130px] p-2 bg-brand-neutral flex text-black text-center flex-col items-center justify-center relative cursor-pointer"
          onClick={() =>
            setAccessibilitySettings((prevSettings) => ({
              ...prevSettings,
              letterSpacing: !prevSettings.letterSpacing
            }))
          }
        >
          <div className={styles.letterSpacing}>
            <Image src={letterSpacing} layout="fill" objectFit="contain" alt={'Letter Spacing'} />
          </div>
          <div className={`font-manrope text-p2 font-light ${styles.label}`}>
            {'Letter Spacing'.split(' ').map((word, index) => {
              if (index === 0) {
                return (
                  <>
                    {word} <br />
                  </>
                );
              }
              return word + ' ';
            })}
          </div>
          {accessibilitySettings.letterSpacing ? (
            <div className="absolute bottom-2 right-2 w-7 h-7 bg-brand-blue rounded-full flex items-center justify-center">
              <FaCheck color="#232323" size={14} />
            </div>
          ) : null}
        </div>

        <div
          className="w-[100px] h-[100px] lg:w-[150px] lg:h-[130px] p-2 bg-brand-neutral flex text-black text-center flex-col items-center justify-center relative cursor-pointer"
          onClick={() =>
            setAccessibilitySettings((prevSettings) => ({
              ...prevSettings,
              pauseAnimations: !prevSettings.pauseAnimations
            }))
          }
        >
          <div className={styles.pauseAnimations}>
            <Image
              src={pauseAnimation}
              layout="fill"
              objectFit="contain"
              alt={'Pause Animations'}
            />
          </div>
          <div className={`font-manrope text-p2 font-light ${styles.label}`}>
            {'Pause Animations'.split(' ').map((word, index) => {
              if (index === 0) {
                return (
                  <>
                    {word} <br />
                  </>
                );
              }
              return word + ' ';
            })}
          </div>
          {accessibilitySettings.pauseAnimations ? (
            <div className="absolute bottom-2 right-2 w-7 h-7 bg-brand-blue rounded-full flex items-center justify-center">
              <FaCheck color="#232323" size={14} />
            </div>
          ) : null}
        </div>

        <div
          className="w-[100px] h-[100px] lg:w-[150px] lg:h-[130px] p-2 bg-brand-neutral flex text-black text-center flex-col items-center justify-center relative cursor-pointer"
          onClick={() =>
            setAccessibilitySettings((prevSettings) => ({
              ...prevSettings,
              cursorSize: prevSettings.cursorSize < 2 ? prevSettings.cursorSize + 1 : 0
            }))
          }
        >
          <div className={styles.cursorSize}>
            <Image src={cursorSize} layout="fill" objectFit="contain" alt={'Cursor Size'} />
          </div>
          <div className={`font-manrope text-p2 font-light ${styles.label}`}>
            {'Cursor Size'.split(' ').map((word, index) => {
              if (index === 0) {
                return (
                  <>
                    {word} <br />
                  </>
                );
              }
              return word + ' ';
            })}
          </div>
          {accessibilitySettings.cursorSize ? (
            <div className="absolute bottom-2 right-2 w-7 h-7 bg-brand-blue rounded-full flex items-center justify-center">
              <FaCheck color="#232323" size={14} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
