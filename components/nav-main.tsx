'use client';

import React, { useEffect, useState } from 'react';
import { type LucideIcon, ChevronDown } from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';

export function NavMain({
  items,
  selectedItem,
  onItemClick,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon?: LucideIcon;
    }[];
    subNav?: {
      title: string;
      url: string;
      icon?: LucideIcon;
    }[];
  }[];
  selectedItem: string | null;
  onItemClick: (title: string) => void;
}) {
  const activeItems = [
    'Dashboard',
    'Territory Map',
    'District Map',
  ];
  const pathname = usePathname();

  // If the current path is /profile, /profile/edit, or /profile/change-password, set selectedItem to null
  const currentSelectedItem = ['/profile', '/profile/edit', '/profile/change-password'].includes(pathname)
    ? null
    : selectedItem;

  // Collapse state for Offline Devices subnav (controlled Collapsible)
  const [offlineOpen, setOfflineOpen] = useState<boolean>(false);

  // Open the offline subnav when a subitem inside it is selected
  useEffect(() => {
    const offlineItem = items.find((it) => it.title === 'Offline Devices');
    const subItems = offlineItem?.items ?? offlineItem?.subNav;
    const hasActiveSub = subItems?.some((s) => s.title === currentSelectedItem);
    setOfflineOpen(Boolean(hasActiveSub));
  }, [currentSelectedItem, items]);

  return (
    <SidebarGroup className='bg-black'>
      {/* <SidebarGroupLabel className='text-[#3D3D3DB2]'>Activities</SidebarGroupLabel> */}
      <SidebarMenu>
        {items.map((item) => {
          const subItems = item.items ?? item.subNav;
          const isOfflineParent = item.title === 'Offline Devices' && subItems && subItems.length > 0;

          return (
            <React.Fragment key={item.title}>
              <SidebarMenuItem>
                {isOfflineParent ? (
                  // Parent + chevron rendered in same visual space.
                  // Parent click ONLY selects the item (does NOT toggle collapse).
                  <div className="relative w-full flex items-center">
                    <SidebarMenuButton
                      className={cn(
                        'hover:bg-primary hover:text-white flex items-center w-full pr-10 ', // space for chevron
                        {
                          'bg-primary text-white': currentSelectedItem === item.title,
                          'hover:bg-sidebarHoverBg hover:text-black': currentSelectedItem !== item.title,
                          'cursor-not-allowed text-gray-400': !activeItems.includes(item.title),
                        }
                      )}
                      tooltip={item.title}
                      onClick={() => item.title && onItemClick(item.title)}
                      aria-expanded={offlineOpen}
                    >
                      {item.icon && (
                        <item.icon
                          className={cn('w-6 h-6', {
                            'text-white': currentSelectedItem === item.title,
                            'text-navbartextColor': currentSelectedItem !== item.title,
                            'text-gray-400': !activeItems.includes(item.title),
                          })}
                          strokeWidth={2}
                        />
                      )}
                      <span
                        className={cn('text-sm', {
                          'text-white': currentSelectedItem === item.title,
                          'text-navbartextColor': currentSelectedItem !== item.title,
                          'text-gray-400': !activeItems.includes(item.title),
                        })}
                      >
                        {item.title}
                      </span>
                    </SidebarMenuButton>

                    {/* Chevron visually inside same area (absolute), separate control that only toggles collapse */}
                    <button
                      type="button"
                      aria-label={offlineOpen ? 'Collapse offline subnav' : 'Expand offline subnav'}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOfflineOpen((v) => !v);
                      }}
                      title={offlineOpen ? 'Collapse' : 'Expand'}
                      className={cn(
                        'absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded transition-transform',
                        { 'rotate-180': offlineOpen }
                      )}
                    >
                      <ChevronDown
                        className={cn('w-4 h-4', {
                          'text-white': currentSelectedItem === item.title,
                          'text-navbartextColor': currentSelectedItem !== item.title,
                        })}
                        strokeWidth={2}
                      />
                    </button>
                  </div>
                ) : (
                  <Link href={item.url}>
                    <SidebarMenuButton
                      className={cn(
                        'hover:bg-primary hover:text-white flex items-center',
                        {
                          'bg-primary text-white': currentSelectedItem === item.title,
                          'hover:bg-sidebarHoverBg hover:text-black': currentSelectedItem !== item.title,
                          'cursor-not-allowed text-gray-400': !activeItems.includes(item.title),
                        }
                      )}
                      tooltip={item.title}
                      onClick={() => item.title && onItemClick(item.title)}
                    >
                      {item.icon && (
                        <item.icon
                          className={cn('w-6 h-6', {
                            'text-white': currentSelectedItem === item.title,
                            'text-navbartextColor': currentSelectedItem !== item.title,
                            'text-gray-400': !activeItems.includes(item.title),
                          })}
                          strokeWidth={2}
                        />
                      )}
                      <span
                        className={cn('text-sm', {
                          'text-white': currentSelectedItem === item.title,
                          'text-navbartextColor': currentSelectedItem !== item.title,
                          'text-gray-400': !activeItems.includes(item.title),
                        })}
                      >
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </Link>
                )}
              </SidebarMenuItem>

              {/* Only render subitems for Offline Devices inside Collapsible */}
              {isOfflineParent && (
                <Collapsible open={offlineOpen} onOpenChange={setOfflineOpen}>
                  <CollapsibleContent>
                    {subItems!.map((sub) => {
                      const subActive = currentSelectedItem === sub.title;
                      return (
                        <SidebarMenuItem key={`${item.title}-${sub.title}`}>
                          <Link href={sub.url}>
                            <SidebarMenuButton
                              className={cn('hover:bg-primary hover:text-white pl-10', {
                                'bg-primary text-white': subActive,
                                'hover:bg-sidebarHoverBg hover:text-black': !subActive,
                              })}
                              tooltip={sub.title}
                              onClick={() => onItemClick(sub.title)}
                            >
                              {sub.icon && (
                                <sub.icon
                                  className={cn('w-4 h-4 mr-2', {
                                    'text-white': subActive,
                                    'text-navbartextColor': !subActive,
                                  })}
                                  strokeWidth={2}
                                />
                              )}
                              <span
                                className={cn('text-sm', {
                                  'text-white': subActive,
                                  'text-navbartextColor': !subActive,
                                })}
                              >
                                {sub.title}
                              </span>
                            </SidebarMenuButton>
                          </Link>
                        </SidebarMenuItem>
                      );
                    })}
                  </CollapsibleContent>
                </Collapsible>
              )}
            </React.Fragment>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}