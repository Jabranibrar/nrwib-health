import React, { useState } from 'react';
import Heading from '../Heading';
import NextImage from '../NextImage';
import Icon from '../Icon';
import NextLink from '../NextLink';
import Link from 'next/link';
import HtmlBlock from '@/src/components/HtmlBlock';

const Footer = (props) => {
  const data = props.data.footer.footer;

  const [email, setEmail] = useState('');

  return (
    <section className={`relative ${props?.isPopup ? '' : 'z-[10]'}`}>
      <footer className="bg-brand-neutral-3 py-5 lg:py-10">
        <div className="container overflow-hidden">
          <div className="bg-brand-blue p-10 lg:p-20 relative flex flex-col lg:flex-row items-center justify-between">
            <Heading
              type="h2"
              otherClasses="font-manrope text-white font-medium w-full lg:w-[40%] lg:text-h2 text-h3 text-center lg:text-start lg:mb-0 mb-5"
            >
              {data.newsletterHeading}
            </Heading>
            <NextImage
              url="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Vector-26.svg"
              height={100}
              width={100}
              otherClasses="absolute bottom-0 left-0"
            />
            <NextImage
              url="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/Vector-27.svg"
              height={100}
              width={100}
              otherClasses="absolute top-0 right-0"
            />
            <NextImage
              url="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/unnamed-file.png"
              height={300}
              width={350}
              otherClasses="absolute top-0 right-[15%] h-full w-auto md:!block hidden"
            />
            <div className="w-[50%] flex flex-col items-center justify-center">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-white outline-none text-brand-darker placeholder:text-brand-darker text-p3 font-normal opacity-100 z-20"
                placeholder="Enter Email"
                required
              />
              <Link
                href={email ? `/subscribe/?email=${email}` : '/subscribe/'}
                className="border-brand-green flex gap-2 items-center justify-center border  !py-[10px] bg-brand-green !text-[16px] !font-normal rounded-lg text-white cursor-pointer font-manrope w-full text-center mt-5 z-10 h-[48px]"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
        <div className="container mt-10">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="w-full lg:w-[32%]">
              <NextLink Link href={'/'}>
                <NextImage
                  url={data.footerLogo.node.sourceUrl}
                  height={200}
                  width={200}
                  otherClasses="w-full"
                />
              </NextLink>
              <div className="border-t-2 border-t-brand-blue border-b-2 border-b-brand-blue my-5 text-p2 lg:text-p1 font-normal text-brand-royal-blue w-full py-2 font-manrope tracking-widest text-center">
                {data.taglineText}
              </div>
              <div className="flex items-center gap-5 justify-between w-full">
                {data.primaryButton?.anchor && (
                  <Link
                    href={data.primaryButton?.anchor?.url}
                    className="language-toggle border-brand-blue-sky hover:bg-brand-blue-hover flex gap-2 items-center justify-center border !px-[16px] !py-[10px] bg-brand-blue-sky !text-[16px] !font-normal rounded-lg text-white cursor-pointer font-manrope w-[50%] group transition-all duration-300"
                  >
                    {data.primaryButton.anchor.title}
                    <Icon
                      icon="button-arrow-icon"
                      iconHeight={20}
                      iconWidth={20}
                      className="group-hover:translate-x-2 transition-transform duration-300"
                    />
                  </Link>
                )}
                {data.secondaryButton?.anchor && (
                  <Link
                    href={data.secondaryButton?.anchor?.url}
                    className="language-toggle border-brand-blue-sky hover:border-brand-blue-hover group flex gap-2 items-center justify-center border !px-[16px] !py-[10px] !text-[16px] !font-normal rounded-lg text-brand-blue-sky cursor-pointer font-manrope w-[50%] transition-all duration-300 group"
                  >
                    {data.secondaryButton.anchor.title}
                    <Icon
                      icon="sky-blue-right-arrow"
                      iconHeight={12}
                      iconWidth={20}
                      className="group-hover:translate-x-2 transition-transform duration-300"
                    />
                  </Link>
                )}
              </div>
            </div>
            <div className="w-full lg:w-[1px] h-[1px] lg:h-[250px] bg-brand-blue"></div>

            <div className="w-full lg:w-[30%]">
              <Heading
                type="h3"
                otherClasses="text-h3 font-manrope font-bold w-full mb-5 text-black lg:text-start text-center"
              >
                {data.partnerHeading}
              </Heading>
              <NextLink href={data.partnersPrimaryUrl}>
                <div className="bg-white flex items-center justify-center w-full min-h-[100px] hover:scale-[1.1] py-2">
                  {' '}
                  <NextImage
                    url={data.partnersPrimaryImage.node.sourceUrl}
                    height={200}
                    width={200}
                    otherClasses="object-contain object-center"
                  />
                </div>
              </NextLink>
              <NextLink href={data.partnersSecondaryUrl}>
                <div className="bg-white flex items-center justify-center w-full min-h-[100px] mt-5 py-2 hover:scale-[1.1]">
                  <NextImage
                    url={data.partnersSecondaryImage.node.sourceUrl}
                    height={80}
                    width={80}
                    otherClasses="object-contain object-center"
                  />
                </div>
              </NextLink>
            </div>

            <div className="w-full lg:w-[1px] h-[1px] lg:h-[250px] bg-brand-blue"></div>

            <div className="w-full lg:w-[30%] bg-brand-teal py-10 px-5">
              <div className="text-white text-center text-p1 font-manrope">{data.slogan}</div>
              <div className="flex items-center justify-center mt-10">
                <NextImage
                  url="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/08/LogoMark-FullColor.svg"
                  height={55}
                  width={60}
                />
              </div>
            </div>
          </div>
        </div>
      </footer>
      <div className="bg-brand-blue py-5">
        <div className="container">
          <div className="flex lg:flex-row flex-col items-center justify-between">
            <div className="text-white font-manrope text-p3">
              <HtmlBlock
                content={props.data.footer.footerBottom.copyright}
                className="text-white [&>p]:!text-p3 font-normal [&>a>strong]:!text-white font-manrope [&>p>strong]:!text-white "
              />
            </div>
            <div className="text-white font-manrope text-p3">
              Site By{' '}
              <NextLink href={props.data.footer.footerBottom.siteBy.url}>
                {props.data.footer.footerBottom.siteBy.title}
              </NextLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
