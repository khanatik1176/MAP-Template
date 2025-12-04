import React from 'react';
import AvatarMenu from '@/components/AvatarMenu';
import GlobalBreadCrumb from '@/components/globalBreadCrumb';
import { Bell } from 'lucide-react';
import { BreadcrumbWithAvatarProps } from '@/types/Global.types';



const BreadcrumbWithAvatar: React.FC<BreadcrumbWithAvatarProps> = ({
  initialData,
  initialLink,
  secondaryData,
  secondaryLink,
  userData,
}) => {
  return (
    <div className='flex items-center justify-between px-3 pt-4 lg:px-4'>
      <GlobalBreadCrumb
        initialData={initialData}
        initialLink={initialLink}
        secondaryData={secondaryData}
        secondaryLink={secondaryLink}
      />
      <span className='hidden items-center gap-4 pr-2 md:flex'>
        <Bell className='h-5 w-5 cursor-pointer text-black' />
        <AvatarMenu userData={userData} />
      </span>
    </div>
  );
};

export default BreadcrumbWithAvatar;
