'use client';

import { NotificationProps } from '@/types/Global.types';
import Link from 'next/link';
import React from 'react';



const NotificationItem: React.FC<{ n: Notification & { date?: string; unread?: boolean } }> = ({ n }) => (
  <div
    className={`flex gap-3 px-3 py-2 hover:bg-gray-50 ${n.unread ? 'bg-white' : ''}`}
  >
    <div className='flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-sm font-semibold text-gray-600'>
      {n.title?.[0] ?? 'N'}
    </div>
    <div className='min-w-0'>
      <div className='truncate text-sm font-medium text-gray-800'>
        {n.title}
      </div>
      {n.body && <div className='truncate text-xs text-gray-500'>{n.body}</div>}
      {n.date && <div className='mt-1 text-[11px] text-gray-400'>{n.date}</div>}
    </div>
  </div>
);

const NotificationPanel: React.FC<NotificationProps> = ({
  notifications = [],
  onClose,
  className = '',
}) => {
  return (
    <div
      className={`w-80 rounded-lg border bg-white shadow-lg ring-1 ring-black/5 overflow-hidden ${className}`}
      role='dialog'
      aria-label='Notifications'
    >
      <div className='flex items-center justify-between border-b bg-white px-3 py-2'>
        <div className='text-sm font-semibold'>Notifications</div>
        <button
          type='button'
          onClick={() => onClose?.()}
          aria-label='Close notifications'
          className='text-xs text-gray-500 hover:text-gray-700'
        >
          Close
        </button>
      </div>

      <div className='max-h-64 overflow-y-auto'>
        {notifications.length === 0 ? (
          <div className='p-4 text-center text-sm text-gray-500'>
            No notifications
          </div>
        ) : (
          notifications.map((n) => <NotificationItem key={n.id} n={n} />)
        )}
      </div>

      <div className='flex items-center justify-between border-t bg-white px-3 py-2 text-xs'>
        <button
          type='button'
          onClick={() => onClose?.()}
          className='text-[#CE7411] hover:underline'
        >
          Mark all read
        </button>
        <Link
          className='text-xs text-gray-500 hover:underline'
          href='/notifications'
        >
          See all
        </Link>
      </div>
    </div>
  );
};

export default NotificationPanel;
