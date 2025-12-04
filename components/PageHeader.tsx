import React from 'react';
import AvatarMenu from '@/components/AvatarMenu';
import PageTitle from '@/components/PageTitle';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Bell } from 'lucide-react';

interface PageHeaderProps {
  title: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
  return (
    <>
      <PageTitle title={title} />
      <div className='flex items-center justify-between px-4 pb-4 pt-8 md:hidden'>
        <span className='md:hidden'>
          <SidebarTrigger />
        </span>
        <div className='flex items-center gap-4'>
          <Bell className='h-5 w-5 cursor-pointer text-black' />
          <AvatarMenu />
        </div>
      </div>
    </>
  );
};

export default PageHeader;
