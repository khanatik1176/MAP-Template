'use client';

import {
  Battery,
  CircuitBoard,
  Cpu,
  Database,
  HeartPulse,
  Home,
  Map,
  MapPin,
  Timer,
  Tractor,
} from 'lucide-react';


import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { TeamSwitcher } from './team-switcher';
import { NavMain } from './nav-main';

import SidebarLogo from '../public/logo/MT_Logo.png';

const defaultData = {
  user: {
    name: 'Khan Atik Faisal',
    email: '',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Motor Telematics',
      logo: SidebarLogo,
      // plan: 'User',
    },
  ],
  navMain: [
    {
      title: 'Map',
      url: '/map',
      icon: MapPin,
      isActive: true,
    },
    {
      title: 'Device Runtimes',
      url: '/device-runtimes',
      icon: Timer,
    },
    {
      title: 'Sensors',
      url: '/sensors',
      icon: Cpu,
    },
        {
      title: 'Heart Beats',
      url: '/heartbeats',
      icon: HeartPulse,
    },
        {
      title: 'Locations',
      url: '/locations',
      icon: Map,
    },
            {
      title: 'Device External Voltages',
      url: '/device-external-voltages',
      icon: CircuitBoard,
    },
    {
      title: 'Yamaha Battery',
      url: '/yamaha-battery',
      icon: Battery,
    },
    {
      title: 'Offline Devices',
      url: '/offline-devices',
      icon: Tractor,
       subNav: [
        {
          title: 'Dashboard',
          url: '/offline-devices/dashboard',
          icon: Home,
        },
        {
          title: 'Location',
          url: '/offline-devices/location',
          icon: Map,
        },
        {
          title: 'Storage',
          url: '/offline-devices/storage',
          icon: Database,
        },
      ],
    }

  ],
};

const isScreenBelowMd = () => {
  return window.matchMedia('(max-width: 768px)').matches;
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const { toggleSidebar } = useSidebar();
  // console.log("🚀 ~ AppSidebar ~ toggleSidebar:", toggleSidebar)

  useEffect(() => {
    const savedSelectedItem = localStorage.getItem('selectedItem');
    if (savedSelectedItem) {
      setSelectedItem(savedSelectedItem);
    } else {
      setSelectedItem('Dashboard');
    }
  }, []);

  useEffect(() => {
    const matchedItem = defaultData.navMain.find(item => pathname.startsWith(item.url));
    if (matchedItem) {
      setSelectedItem(matchedItem.title);
    }
  }, [pathname]);

  const handleItemClick = (title: string) => {
    setSelectedItem(title);
    localStorage.setItem('selectedItem', title);
    if (isScreenBelowMd()) {
      toggleSidebar();
    }
  };

  const userData = {
    name:defaultData.user.name,
    email:defaultData.user.email,
    avatar: defaultData.user.avatar,
  };

  const data = {
    ...defaultData,
    user: userData,
  };

  return (
    <Sidebar side='left' variant='sidebar' collapsible='icon' {...props} className='border-none'>
      <SidebarHeader className='bg-[#F1F5F9]'>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className='bg-[#F1F5F9]'>
        <NavMain items={data.navMain} selectedItem={selectedItem} onItemClick={handleItemClick} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}