'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Icon from '../Icon';
import NextImage from '../NextImage';
import clsx from 'clsx';
import NextLink from '../NextLink';
import Image from 'next/image';
import useAuth from '@/src/hooks/useAuth';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { usePathname } from 'next/navigation';

const Header = ({ isMemberPortal, isPopup, onClose, submenuData }) => {
  const { user } = useAuth();
  const pathName = usePathname();
  const { headerMenuButton, button, logos, allMenus, account } = submenuData;
  const [activeButton, setActiveButton] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [actionSubmenu, setActionSubmenu] = useState('');

  allMenus.forEach((item) => (item.isActive = false));

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleIconPosition = (buttonName) => {
    setActiveButton(activeButton === buttonName ? null : buttonName);
  };

  useEffect(() => {
    const closeSubMenu = (event) => {
      // Check if the click is outside the submenu
      const submenu = document.querySelector('.submenu');
      if (submenu && !submenu.contains(event.target)) {
        setActionSubmenu(false);
        toggleIconPosition('');
      }
    };

    window.addEventListener('click', closeSubMenu);
    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('click', closeSubMenu);
    };
  }, [setActionSubmenu]);

  return (
    <div className="relative z-[100] bg-white ">
      <div className="w-full bg-white">
        <header className={`border-b border-b-brand-neutral-2 relative ${isPopup ? '' : 'z-[50]'}`}>
          <nav className="container bg-white flex items-center justify-between py-4">
            <div className={`${isPopup ? '' : 'hidden lg:!block'}`}>
              <NextLink href={'/'}>
                <NextImage url={logos?.logo?.node?.sourceUrl} height={200} width={200} />
              </NextLink>
            </div>
            {!isPopup ? (
              <div className=" flex items-center justify-center lg:justify-end gap-5 w-full lg:w-max">
                <div className="flex items-center justify-center lg:justify-end gap-5 flex-wrap ">
                  <Link target={'_self'} href="/search">
                    <Icon
                      icon="search-icon-blue-sky"
                      iconHeight={28}
                      iconWidth={28}
                      otherClasses="cursor-pointer"
                    />
                  </Link>
                  <div className="bg-brand-neutral-6 h-[2rem] w-[1px]" />
                  {user?.firstName && user?.lastName ? (
                    <>
                      <Menu as="div" className="relative flex items-center">
                        <div>
                          <MenuButton className="items-center inline-flex w-full justify-center gap-x-1">
                            <Icon
                              icon="user-icon"
                              iconHeight={32}
                              iconWidth={32}
                              otherClasses="cursor-pointer"
                            />
                            <span
                              className={
                                'font-medium text-lg text-brand-blue-sky relative top-0.5 ml-2'
                              }
                            >{`${user?.firstName} ${user?.lastName}`}</span>
                            <ChevronDownIcon
                              aria-hidden="true"
                              className="-mr-2 h-10 w-10 text-brand-blue-sky"
                            />
                          </MenuButton>
                        </div>

                        <MenuItems
                          transition
                          className="absolute top-10 right-0 z-[9999] mt-2 w-56 origin-top-right bg-white transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                        >
                          <div className="block">
                            <MenuItem>
                              <a
                                href="/member-portal/"
                                className="py-4 font-medium text-lg text-white bg-brand-teal block px-6 data-[focus]:bg-brand-green data-[focus]:text-white border-b border-b-white border-opacity-20"
                              >
                                Dashboard
                              </a>
                            </MenuItem>
                            <MenuItem>
                              <a
                                href="/member-portal/account-settings/"
                                className="py-4 font-medium text-lg text-white bg-brand-teal block px-6 data-[focus]:bg-brand-green data-[focus]:text-white border-b border-b-white border-opacity-20"
                              >
                                Account Settings
                              </a>
                            </MenuItem>
                            <MenuItem>
                              <a
                                href="/logout/"
                                className="py-4 font-medium text-lg text-white bg-brand-teal block px-6 data-[focus]:bg-brand-green data-[focus]:text-white"
                              >
                                Logout
                              </a>
                            </MenuItem>
                          </div>
                        </MenuItems>
                      </Menu>
                    </>
                  ) : (
                    <Link
                      className={'flex items-center gap-x-2'}
                      target={account?.menuTitles?.parentTitle?.target || '_blank'}
                      href={account?.menuTitles?.parentTitle?.url || '/'}
                    >
                      <Icon
                        icon="user-icon"
                        iconHeight={28}
                        iconWidth={28}
                        otherClasses="cursor-pointer"
                      />
                    </Link>
                  )}
                  {/* <div className="bg-brand-neutral-6 h-[2rem] w-[1px]"></div>
                  <button
                    type="button"
                    className="language-toggle border-brand-blue-sky flex gap-2 items-center border !px-[12px] !py-[5px] bg-transparent !text-[16px] !font-normal rounded-full text-brand-blue-sky cursor-pointer font-manrope"
                  >
                    Eng
                    <Icon icon="dropdown-blue-arrow" iconHeight={20} iconWidth={20} />
                  </button> */}
                  {button?.url && (
                    <Link
                      href={button?.url || '/'}
                      target={button?.target || '_blank'}
                      className="language-toggle border-brand-green flex gap-2 items-center border !px-[16px] !py-[10px] bg-brand-green hover:bg-brand-green-hover transition-all duration-300 group !text-[16px] !font-normal rounded-lg text-white cursor-pointer ml-4 font-manrope"
                    >
                      {button?.title}
                      <Icon
                        icon="button-arrow-icon"
                        iconHeight={20}
                        iconWidth={20}
                        otherClasses={'group-hover:translate-x-2 transition-transform duration-300'}
                      />
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-10">
                {isMemberPortal ? (
                  <>
                    {user?.firstName && user?.lastName ? (
                      <>
                        <Menu as="div" className="relative flex items-center">
                          <div>
                            <MenuButton className="items-center inline-flex w-full justify-center gap-x-1">
                              <Icon
                                icon="user-icon"
                                iconHeight={32}
                                iconWidth={32}
                                otherClasses="cursor-pointer"
                              />
                              <span
                                className={
                                  'font-medium text-lg text-brand-blue-sky relative top-0.5 ml-2'
                                }
                              >{`${user?.firstName} ${user?.lastName}`}</span>
                              <ChevronDownIcon
                                aria-hidden="true"
                                className="-mr-2 h-10 w-10 text-brand-blue-sky"
                              />
                            </MenuButton>
                          </div>

                          <MenuItems
                            transition
                            className="absolute top-10 right-0 z-[9999] mt-2 w-56 origin-top-right bg-white transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                          >
                            <div className="block">
                              <MenuItem>
                                <a
                                  href="/member-portal/"
                                  className="py-4 font-medium text-lg text-white bg-brand-teal block px-6 data-[focus]:bg-brand-green data-[focus]:text-white border-b border-b-white border-opacity-20"
                                >
                                  Dashboard
                                </a>
                              </MenuItem>
                              <MenuItem>
                                <a
                                  href="/member-portal/account-settings/"
                                  className="py-4 font-medium text-lg text-white bg-brand-teal block px-6 data-[focus]:bg-brand-green data-[focus]:text-white border-b border-b-white border-opacity-20"
                                >
                                  Account Settings
                                </a>
                              </MenuItem>
                              <MenuItem>
                                <a
                                  href="/logout/"
                                  className="py-4 font-medium text-lg text-white bg-brand-teal block px-6 data-[focus]:bg-brand-green data-[focus]:text-white"
                                >
                                  Logout
                                </a>
                              </MenuItem>
                            </div>
                          </MenuItems>
                        </Menu>
                      </>
                    ) : (
                      <Link
                        className={'flex items-center gap-x-2'}
                        target={account?.menuTitles?.parentTitle?.target || '_blank'}
                        href={account?.menuTitles?.parentTitle?.url || '/'}
                      >
                        <Icon
                          icon="user-icon"
                          iconHeight={28}
                          iconWidth={28}
                          otherClasses="cursor-pointer"
                        />
                      </Link>
                    )}
                    <div className="bg-brand-neutral-6 h-[2rem] w-[1px]"></div>
                  </>
                ) : (
                  <></>
                )}
                <button onClick={toggleMobileMenu} className="flex items-center">
                  <Icon icon="menu" iconHeight={36} iconWidth={36} />
                </button>
                <div onClick={onClose} className="cursor-pointer">
                  <Image src="/images/close-popup.svg" width={42} height={42} alt="Close" />
                </div>
              </div>
            )}
          </nav>
        </header>

        <div
          className={`border-b border-b-brand-neutral-2 ${isPopup ? 'hidden' : 'block lg:hidden'} `}
        >
          <div className="container bg-white flex items-center justify-between py-4">
            <div>
              <NextLink href={'/'}>
                <NextImage url={logos?.logo?.node?.sourceUrl} height={200} width={200} />
              </NextLink>
            </div>

            <div className="lg:hidden block">
              <button onClick={toggleMobileMenu} className="flex items-center">
                <Icon icon="menu" iconHeight={28} iconWidth={28} />
              </button>
            </div>
          </div>
        </div>
        <div
          className={`w-full ${isPopup ? 'absolute z-[200]' : 'absolute z-20 lg:relative'} border-b border-b-brand-neutral-2 submenu`}
        >
          {!isPopup && (
            <div className="w-full  hidden lg:!flex container   items-center justify-between ">
              <ul className=" flex items-center justify-between w-full">
                {allMenus?.map((item, index) => {
                  const title = item?.menuItems?.menuTitles?.parentTitle?.title;
                  const linkUrl = item?.menuItems?.menuTitles?.parentTitle?.url;

                  const parentSlug =
                    item?.menuItems?.menuTitles?.submenuCategory?.map(
                      (item) => item?.category?.url
                    ) || [];
                  const parentItemSlug =
                    item?.menuItems?.menuTitles?.submenuCategory?.map(
                      (item) => item?.allSubLinks?.length > 0 && item?.allSubLinks
                    ) || [];
                  const childSlug =
                    (parentItemSlug && parentItemSlug?.flat()?.map((sub) => sub?.link?.url)) || [];

                  let isActive =
                    pathName !== '/' &&
                    (actionSubmenu === title ||
                      linkUrl?.includes(pathName) ||
                      parentSlug?.includes(pathName) ||
                      parentItemSlug?.includes(pathName));

                  // Ensure isActive is not true for childSlug
                  if (childSlug?.includes(pathName) && !pathName.startsWith('/who-we-are')) {
                    isActive = false;
                  }

                  // Check if any menu item is active
                  if (allMenus.find((item) => item.isActive === true)) {
                    isActive = true;
                  }

                  // If isActive is true, set the item's isActive to false
                  if (isActive) {
                    item.isActive = false;
                  }

                  return (
                    <>
                      <li key={index} className="w-max relative h-[106px] flex group ">
                        {item?.menuItems?.menuTitles?.showSubmenu ? (
                          <button
                            className="font-manrope text-p3 font-normal flex items-center justify-center gap-2  "
                            onClick={() => {
                              toggleIconPosition(title);
                              setActionSubmenu(actionSubmenu === title ? '' : title);
                            }}
                          >
                            {title}
                            <Icon
                              icon="gray-chevron"
                              otherClasses={clsx(
                                'transition-transform transform mt-1',
                                activeButton === title ? 'rotate-0' : 'rotate-90'
                              )}
                              iconHeight={20}
                              iconWidth={20}
                            />
                          </button>
                        ) : (
                          <Link
                            href={linkUrl || '/'}
                            onClick={() => setActionSubmenu('')}
                            className="font-manrope text-p3 font-normal flex items-center justify-center gap-2"
                          >
                            {title}
                          </Link>
                        )}
                        <div
                          className={`absolute bottom-0 left-0 w-full h-[5px] bg-brand-green group-hover:block  ${isActive ? 'block' : 'hidden'} `}
                        />
                      </li>
                      {actionSubmenu === title && (
                        <Submenu sunMenuData={item} setActionSubmenu={setActionSubmenu} />
                      )}
                    </>
                  );
                })}
                {headerMenuButton?.url && (
                  <div className="py-4">
                    <Link
                      href={headerMenuButton?.url || '/'}
                      onClick={() => setActionSubmenu('')}
                      className="w-max language-toggle border-brand-blue-sky hover:bg-brand-blue-hover group transition-all duration-300 flex gap-2 items-center border !px-[22px] !py-[10px] bg-brand-blue-sky !text-[16px] !font-normal rounded-lg text-white cursor-pointer font-manrope"
                    >
                      {headerMenuButton?.title}
                      <Icon
                        icon="button-arrow-icon"
                        iconHeight={20}
                        iconWidth={20}
                        otherClasses={
                          'brand-white group-hover:translate-x-2 transition-transform duration-300'
                        }
                      />
                    </Link>
                  </div>
                )}
              </ul>
            </div>
          )}

          {isMobileMenuOpen && (
            <div
              className={`container relative bg-brand-blue-sky py-4 flex flex-col gap-4 ${isPopup ? '' : 'lg:hidden'}`}
            >
              <div className="flex items-center justify-end gap-5 flex-wrap border-b-[0.063rem] pb-8 border-opacity-20 border-white">
                <Link target={'_self'} href="/search">
                  <Icon
                    icon="search-icon-white"
                    iconHeight={28}
                    iconWidth={28}
                    otherClasses="cursor-pointer"
                  />
                </Link>
                <div className="bg-brand-white h-[2rem] w-[1px]" />
                {user?.firstName && user?.lastName ? (
                  <>
                    <Menu as="div" className="relative flex items-center">
                      <div>
                        <MenuButton className="items-center inline-flex w-full justify-center gap-x-1">
                          <Image
                            icon="user-icon"
                            iconHeight={32}
                            iconWidth={32}
                            otherClasses="cursor-pointer"
                          />
                          <span
                            className={'font-medium text-lg text-brand-white relative top-0.5 ml-2'}
                          >{`${user?.firstName} ${user?.lastName}`}</span>
                          <ChevronDownIcon
                            aria-hidden="true"
                            className="-mr-2 h-10 w-10 text-brand-white"
                          />
                        </MenuButton>
                      </div>

                      <MenuItems
                        transition
                        className="absolute top-10 right-0 z-[9999] mt-2 w-56 origin-top-right bg-white transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                      >
                        <div className="block">
                          <MenuItem>
                            <a
                              href="/member-portal/"
                              className="py-4 font-medium text-lg text-white bg-brand-teal block px-6 data-[focus]:bg-brand-green data-[focus]:text-white border-b border-b-white border-opacity-20"
                            >
                              Dashboard
                            </a>
                          </MenuItem>
                          <MenuItem>
                            <a
                              href="/member-portal/account-settings/"
                              className="py-4 font-medium text-lg text-white bg-brand-teal block px-6 data-[focus]:bg-brand-green data-[focus]:text-white border-b border-b-white border-opacity-20"
                            >
                              Account Settings
                            </a>
                          </MenuItem>
                          <MenuItem>
                            <a
                              href="/logout/"
                              className="py-4 font-medium text-lg text-white bg-brand-teal block px-6 data-[focus]:bg-brand-green data-[focus]:text-white"
                            >
                              Logout
                            </a>
                          </MenuItem>
                        </div>
                      </MenuItems>
                    </Menu>
                  </>
                ) : (
                  <Link
                    className={'flex items-center gap-x-2'}
                    target={account?.menuTitles?.parentTitle?.target || '_blank'}
                    href={account?.menuTitles?.parentTitle?.url || '/'}
                  >
                    <Image
                      src="https://nrwib-health.3lanemarketing.com/wp-content/uploads/2024/09/NRWIB-Global-Icon-Login.svg"
                      height={40}
                      width={40}
                      alt="icon"
                      className="cursor-pointer w-10 h-10"
                    />
                  </Link>
                )}
                {/* <div className="bg-brand-white h-[2rem] w-[1px]"></div>
                <button
                  type="button"
                  className="language-toggle border-brand-white flex gap-2 items-center border !px-[12px] !py-[5px] bg-transparent !text-[16px] !font-bold rounded-3xl text-brand-white cursor-pointer font-manrope"
                >
                  Eng
                  <Icon icon="white-chevron" iconHeight={20} iconWidth={20} className="rotate-90" />
                </button> */}
              </div>

              <div
                className={`${isPopup ? 'lg:right-[8.5rem] right-[7rem]' : 'right-[1.5rem]'}  bg-brand-blue-sky rotate-45 h-5 w-5 absolute top-0 -translate-y-1/2 `}
              ></div>
              {allMenus?.map((item, index) => {
                const title = item?.menuItems?.menuTitles?.parentTitle?.title;
                const linkUrl = item?.menuItems?.menuTitles?.parentTitle?.url;

                return (
                  <div
                    key={index}
                    className="w-full border-b-[0.063rem] pb-5 border-opacity-20 border-white "
                  >
                    {item?.menuItems?.menuTitles?.showSubmenu ? (
                      <button
                        className="w-full text-white font-manrope text-p3 font-normal flex items-center justify-between "
                        onClick={() => {
                          toggleIconPosition(title);
                          setActionSubmenu(actionSubmenu === title ? '' : title);
                        }}
                      >
                        {title}
                        {
                          <Icon
                            icon="white-chevron"
                            otherClasses={clsx(
                              'transition-transform transform',
                              activeButton === title ? 'rotate-90' : 'rotate-0'
                            )}
                            iconHeight={20}
                            iconWidth={20}
                          />
                        }
                      </button>
                    ) : (
                      <Link
                        href={linkUrl || '/'}
                        onClick={() => {
                          setActionSubmenu('');
                          setIsMobileMenuOpen(false);
                        }}
                        className="w-full !text-white font-manrope text-p3 font-normal flex items-center justify-between"
                      >
                        {title}

                        {/* <Icon icon="white-chevron" iconHeight={20} iconWidth={20} /> */}
                      </Link>
                    )}
                    {actionSubmenu === title && (
                      <Submenu
                        sunMenuData={item}
                        setActionSubmenu={setActionSubmenu}
                        isPopup={isPopup}
                      />
                    )}
                  </div>
                );
              })}
              <div className="flex gap-6">
                {/*<Link*/}
                {/*  href={headerMenuButton?.url || '/'}*/}
                {/*  onClick={() => {*/}
                {/*    setActionSubmenu('');*/}
                {/*    setIsMobileMenuOpen(false);*/}
                {/*  }}*/}
                {/*  className="w-max language-toggle border-brand-blue flex gap-2 items-center border !px-[16px] !py-[10px] bg-brand-blue hover:bg-brand-blue-hover !text-[16px] !font-normal rounded-lg text-white cursor-pointer font-manrope"*/}
                {/*>*/}
                {/*  {headerMenuButton?.title}*/}
                {/*  <Icon icon="button-arrow-icon" iconHeight={20} iconWidth={20} />*/}
                {/*</Link>*/}
                <Link
                  href={button?.url || '/'}
                  target={button?.target || '_blank'}
                  className="w-fit language-toggle border-brand-green flex gap-2 items-center border !px-[16px] !py-[10px] bg-brand-green hover:bg-brand-green-hover transition-all duration-300 group !text-[16px] !font-normal rounded-lg text-white cursor-pointer  font-manrope"
                >
                  {button?.title}
                  <Icon
                    icon="button-arrow-icon"
                    iconHeight={20}
                    iconWidth={20}
                    otherClasses={'group-hover:translate-x-2 transition-transform duration-300'}
                  />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {actionSubmenu && (
        <div className="w-full h-screen absolute top-0 left-0 lg:bg-brand-teal/70 z-[-2]" />
      )}
    </div>
  );
};

export default Header;

const Submenu = ({ sunMenuData, setActionSubmenu, isPopup }) => {
  const { image, submenuCategory } = sunMenuData?.menuItems?.menuTitles;

  return (
    <div
      className={`${isPopup ? 'relative overflow-hidden mt-3' : 'relative lg:absolute lg:top-[107px]'} top-0 left-0 w-full h-auto z-50 `}
    >
      {/*       <div className={`${isPopup ? "" :"lg:bg-brand-teal/70 lg:h-[100vh]"} `}>
       */}{' '}
      <div className="max-w-[1215px] mx-auto  ">
        <div className="w-full min-h-[21.313rem] !flex flex-col-reverse sm:flex-row  sm:gap-9 gap-0   bg-white">
          <div className="w-full h-full flex items-start gap-6 sm:gap-14 flex-wrap px-10 py-10 md:max-w-[60%] sm:max-w-[50%]">
            {submenuCategory?.map((cat, index) => (
              <div key={index} className="w-max flex flex-col gap-3">
                <Link
                  href={cat?.category?.url || '/'}
                  onClick={() => setActionSubmenu('')}
                  className="border-l-4 mb-2 pl-5 border-brand-green text-p1 font-bold text-brand-royal-blue m-0 p-0"
                >
                  {cat?.category?.title}
                </Link>
                {cat?.allSubLinks?.map((subLink, index) => (
                  <div key={index} className="pl-5 w-max flex flex-col gap-4">
                    <NextLink
                      href={subLink?.link?.url || '/'}
                      onClick={() => setActionSubmenu('')}
                      otherClasses="text-p2 font-normal text-brand-darker !no-underline p-0 m-0"
                    >
                      {subLink?.link?.title}
                    </NextLink>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="relative w-full  h-auto sm:min-h-[inherit] min-h-[30rem] flex-shrink-0  sm:max-w-[50%] md:max-w-[40%] ">
            {image?.node?.mediaItemUrl && (
              <NextImage
                otherClasses="object-cover"
                url={image?.node?.mediaItemUrl}
                fill
                alt={image?.node?.title}
              />
            )}
          </div>
        </div>
      </div>
    </div>
    /*     </div>
     */
  );
};
