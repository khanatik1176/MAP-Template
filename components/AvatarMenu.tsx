'use client';
import React, { useState, useEffect, FC } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { LogOut,CircleUser } from 'lucide-react';
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import { AvatarMenuProps } from '@/types/Global.types';
import { getInitials } from '@/utils/functions/globalfunctions';

const AvatarMenu: FC<AvatarMenuProps> = ({ userData }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const defaultAvatarUrl = userData?.user_metadata?.avatar_url ||
    'https://via.placeholder.com/150/0000FF/808080?Text=Default+Avatar';

  const handleLogout = async () => {
    Cookies.remove('user_data');
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    router.replace('/sign-in');
  };

  const handleAvatarClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      event.target instanceof Node &&
      !(event.target as Element).closest('.avatar-menu-content')
    ) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const fallbackText = getInitials(userData);


  return (
    <div className='relative z-50'>
      <div onClick={handleAvatarClick} className='cursor-pointer'>
        <Avatar className='h-8 w-8 rounded-xl'>
          <AvatarImage src={defaultAvatarUrl} alt='Avatar' />
          <AvatarFallback className='bg-primary text-white'>
            {fallbackText || 'NA'}
          </AvatarFallback>
        </Avatar>
      </div>
      {isMenuOpen && (
        <div className='avatar-menu-content absolute right-0 z-10 mt-2 w-64 rounded border border-gray-200 bg-white shadow-lg'>
          <div className='flex items-center justify-between border-b bg-[#f1f5f9] px-4 py-3'>
            <div className='flex items-center gap-3'>
              <Avatar className='h-10 w-10 rounded-xl'>
                <AvatarImage src={defaultAvatarUrl} alt='Avatar' />
                <AvatarFallback className='bg-primary text-white'>
                  {'NA'}
                </AvatarFallback>
              </Avatar>
              <div className='flex flex-col'>
                <p className='text-sm font-semibold text-gray-900'>
                  {userData?.username || 'NA'}
                </p>
                <p className='text-xs text-gray-500'>{userData?.email}</p>
              </div>
            </div>
          </div>
          <ul className='py-1'>
            {/* <li className='cursor-pointer border-b px-4 py-2 text-start hover:bg-gray-100'>
              <Link href='/upgrade'>
                <div className='flex items-center gap-x-3'>
                  <span>
                    <Sparkles size={16} />
                  </span>
                  <span className='text-sm text-gray-700'>Upgrade to Pro</span>
                </div>
              </Link>
            </li>
            <li className='cursor-pointer border-b px-4 py-2 text-start hover:bg-gray-100'>
              <Link href='/account'>
                <div className='flex items-center gap-x-3'>
                  <span>
                    <BadgeCheck size={16} />
                  </span>
                  <span className='text-sm text-gray-700'>Account</span>
                </div>
              </Link>
            </li>
            <li className='cursor-pointer border-b px-4 py-2 text-start hover:bg-gray-100'>
              <Link href='/billing'>
                <div className='flex items-center gap-x-3'>
                  <span>
                    <CreditCard size={16} />
                  </span>
                  <span className='text-sm text-gray-700'>Billing</span>
                </div>
              </Link>
            </li>
            <li className='cursor-pointer px-4 py-2 text-start hover:bg-gray-100'>
              <div className='flex items-center gap-x-3'>
                <span>
                  <Moon size={16} />
                </span>
                <span className='text-sm text-gray-700'>Dark theme</span>
              </div>
            </li>*/}
                     <li className='cursor-pointer px-4 py-2 text-start hover:bg-gray-100'>
                      <Link href='/profile'>
              <div className='flex items-center gap-x-3'>
                <span>
                  <CircleUser size={16} />
                </span>
                <span className='text-sm text-gray-700'>View Profile</span>
              </div>
              </Link>
            </li> 
            <li className='mt-1 cursor-pointer border-t px-4 py-2 text-start hover:bg-gray-100'>
              <div className='flex items-center gap-x-3' onClick={handleLogout}>
                <span>
                  <LogOut size={16} className='text-red-500' />
                </span>
                <span className='text-sm text-red-500'>Sign out</span>
              </div>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default AvatarMenu;
