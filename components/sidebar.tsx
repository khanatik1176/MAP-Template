"use client";
import React, { FC } from "react";
import { SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";

type TSidebarprop = {
  children: React.ReactNode;
};

const Sidebar: FC<TSidebarprop> = ({ children }) => {


    return (
      <SidebarProvider>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <div className="w-full md:max-w-[calc(100%-260px)] md:relative md:left-[256px]">
            {children}
          </div>
        </div>
      </SidebarProvider>
    );
};

export default Sidebar;