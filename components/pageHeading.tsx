// ...existing code...
'use client';
import React, { FC, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { IHeadingProps } from '@/types/Global.types';
import AvatarMenu from '@/components/AvatarMenu';
import { Bell } from 'lucide-react';
import NotificationPanel from '@/components/NotificationPanel';

type NotificationItem = {
  id: string;
  title: string;
  body?: string;
  date?: string;
  unread?: boolean;
};

const PageHeading: FC<IHeadingProps & { isHome?: boolean; userData?: any }> = ({
  title,
  subTitle,
  titleclassName,
  subTitleClassName,
  className,
  isHome,
  userData,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      title: 'New comment on your note',
      body: 'Nice work!',
      date: '2h ago',
      unread: true,
    },
    {
      id: '2',
      title: 'File processed',
      body: 'Your upload is ready',
      date: '1d ago',
    },
  ]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    setOpen(false);
  };

  return (
    <div className={cn(className, 'flex items-center justify-between')}>
      <div className='min-w-0'>
        <h3
          className={cn('text-2xl font-semibold md:text-2xl', titleclassName)}
        >
          {title}
        </h3>
        {subTitle ? (
          <p
            className={cn(
              'text-md pt-2 text-subHeading md:text-sm',
              subTitleClassName
            )}
          >
            {subTitle}
          </p>
        ) : null}
      </div>

      {isHome ? (
        <div
          ref={containerRef}
          className='relative hidden items-center gap-4 pb-5 pr-2 md:flex'
        >
          <button
            type='button'
            onClick={(e) => {
              e.stopPropagation();
              setOpen((s) => !s);
            }}
            className='relative inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 focus:outline-none'
          >
            <Bell className='h-5 w-5 cursor-pointer text-black' />
            {notifications.some((n) => n.unread) && (
              <span className='absolute right-0 top-0 h-2 w-2 rounded-full bg-red-500' />
            )}
          </button>

          {open && (
            <div className='absolute right-0 top-full z-50 mt-2'>
              <NotificationPanel
                notifications={notifications}
                onClose={() => setOpen(false)}
                // onMarkAllRead={markAllRead}
              />
            </div>
          )}

          <AvatarMenu userData={userData} />
        </div>
      ) : null}
    </div>
  );
};

export default PageHeading;
