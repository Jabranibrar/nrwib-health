import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Icon from '@/src/components/Icon';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { ChevronRightIcon } from '@heroicons/react/16/solid';

const MemberAccountsNav = ({ block }) => {
  const { attributes } = block || {};

  const router = useRouter();
  const navItems = [
    {
      href: '/member-portal/',
      label: 'Dashboard',
      icon: 'dashboard-icon',
      iconHeight: 28,
      iconWidth: 28,
      target: '_self'
    },
    {
      href: '/member-portal/announcements/',
      label: 'Announcements',
      icon: 'announcements-icon',
      iconHeight: 38,
      iconWidth: 38,
      target: '_self'
    },
    {
      href: '/member-portal/forums/',
      label: 'Members Forum',
      icon: 'members-forum-icon',
      iconHeight: 30,
      iconWidth: 30,
      target: '_self'
    },
    {
      href: '/news/',
      label: 'News',
      icon: 'news-icon',
      iconHeight: 28,
      iconWidth: 28,
      target: '_blank'
    },
    {
      href: '/resources/',
      label: 'Resources',
      icon: 'resources-icon',
      iconHeight: 32,
      iconWidth: 32,
      target: '_blank'
    },
    {
      href: '/member-portal/action-teams/',
      label: 'Action Teams',
      icon: 'action-teams-icon',
      iconHeight: 34,
      iconWidth: 34,
      target: '_self',
      hasSubmenu: true // Indicate that this item has a submenu
    }
  ];

  return (
    <section data-testid="member-account-nav" className="relative my-10">
      <div className="container mx-auto">
        <nav className="bg-brand-royal-blue rounded-lg px-16">
          <ul className="relative flex items-center justify-between">
            {navItems.map((item, index) => {
              const isActive = router.asPath === item.href;
              return (
                <li className={`relative group py-6 ${item?.label == 'Members Forum' ? 'z-50' : ''}`} key={index}>
                  <Link
                    className={`relative font-medium flex items-center gap-x-3 text-lg transition-colors hover:text-brand-green ${
                      isActive ? 'text-brand-green' : 'text-white'
                    }`}
                    target={item.target}
                    href={item.href}
                  >
                    <Icon
                      otherClasses="shrink-0"
                      icon={item.icon}
                      iconHeight={item.iconHeight}
                      iconWidth={item.iconWidth}
                      style={{ fill: isActive ? '#BDD358' : 'currentColor' }} // Adjust icon color
                    />
                    <span>{item.label}</span>
                    {item.hasSubmenu && (
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="h-8 w-8 text-white hover:text-brand-teal -ml-2"
                      />
                    )}
                  </Link>
                  {item.hasSubmenu && (
                    <div
                      className={
                        'group-hover:[&>ul]:!opacity-100 group-hover:[&>ul]:pointer-events-auto '
                      }
                    >
                      <ul className="opacity-0 pointer-events-none transition-opacity absolute left-0 top-20 bg-brand-teal z-10 min-w-60 lg:min-w-[242px] ">
                        {attributes?.filter((attribute) => !attribute?.actionGroups?.hideFromFrontend)
                          .map((dept) => {
                          if (!dept) return null; // Ensure dept is valid

                          return (
                            <li key={dept.id}>
                              <Link
                                href={`/member-portal/action-teams/${dept.slug}`}
                                className="block px-6 py-4 bg-brand-teal text-white font-medium hover:bg-brand-green transition-colors border-b border-b-white border-opacity-20"
                              >
                                {dept.name}
                              </Link>
                            </li>
                          );
                        })}
                        <li>
                          <Link
                            href="/member-portal/action-teams/join-an-action-team"
                            className="block px-6 py-4 bg-brand-teal text-white font-medium hover:bg-brand-green transition-colors border-b border-b-white border-opacity-20"
                          >
                            <div
                              className={
                                'flex items-center gap-x-2 bg-brand-blue-sky px-6 py-4 rounded-md'
                              }
                            >
                              <span>Join an Action Team</span>
                              <ChevronRightIcon
                                aria-hidden="true"
                                className="h-8 w-8 text-white hover:text-brand-teal -ml-2"
                              />
                            </div>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </section>
  );
};

export default MemberAccountsNav;
