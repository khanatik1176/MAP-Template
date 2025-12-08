"use client";

import { X, Home, MapIcon, MapPin, Settings, HelpCircle, Settings2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import {
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";

import logo from "../public/logo/ACI-Logo.png";
import { MobileSidebarProps } from "@/types/Global.types";



const menuHover = "hover:bg-green-50 hover:text-green-700";

export default function MobileSidebar({ open, setOpen }: MobileSidebarProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`sm:hidden fixed inset-0 z-40 transition-opacity ${open ? "opacity-100 visible" : "opacity-0 invisible"}`}
        aria-hidden={!open}
        onClick={() => setOpen(false)}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Panel */}
      <div
        className={`sm:hidden fixed top-0 left-0 z-50 h-full w-64 transform transition-transform ${open ? "translate-x-0" : "-translate-x-full"}`}
        role="dialog"
        aria-modal="true"
      >
        <div className="h-full bg-gradient-to-br from-green-50 via-white to-green-100 border-r shadow-lg flex flex-col">
          {/* Close button / header inside panel */}
          <div className="p-3 flex items-center justify-between border-b">
            <h2 className="text-lg font-semibold text-green-700 ml-[14px]">ACI Map</h2>
            <button aria-label="Close menu" onClick={() => setOpen(false)} className="inline-flex items-center justify-center h-8 w-8 rounded-md hover:bg-gray-100">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1">
            {/* Use a plain wrapper — do not render the UI Sidebar (it uses Radix Sheet on mobile) */}
            <div className="w-full bg-transparent shadow-none border-0">
              <SidebarHeader className="hidden" />
              <SidebarContent className="px-3">
                <SidebarGroup>
                  <SidebarGroupLabel>Main</SidebarGroupLabel>

                  <SidebarMenu>
                    <SidebarMenuItem>
                      <Link href="/dashboard">
                        <SidebarMenuButton onClick={() => setOpen(false)} className={menuHover}>
                          <Home className="w-4 h-4" />
                          Dashboard
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <Link href="/territory-map">
                        <SidebarMenuButton onClick={() => setOpen(false)} className={menuHover}>
                          <MapPin className="w-4 h-4" />
                          Territory Map
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <Link href="/district-map">
                        <SidebarMenuButton onClick={() => setOpen(false)} className={menuHover}>
                          <MapIcon className="w-4 h-4" />
                          District Map
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup className="mt-4">
                  <SidebarGroupLabel>Configurations</SidebarGroupLabel>

                  <SidebarMenu>
                    <SidebarMenuItem>
                      <Link href="/territory-mapping">
                        <SidebarMenuButton onClick={() => setOpen(false)} className={menuHover}>
                          <Settings2 className="w-4 h-4" />
                          Territory Mapping
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup className="mt-6">
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <Link href="/settings">
                        <SidebarMenuButton onClick={() => setOpen(false)} className={menuHover}>
                          <Settings className="w-4 h-4" />
                          Settings
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <Link href="/help">
                        <SidebarMenuButton onClick={() => setOpen(false)} className={menuHover}>
                          <HelpCircle className="w-4 h-4" />
                          Help
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroup>
              </SidebarContent>

              <SidebarFooter className="p-4 border-t mt-4">
                <div className="flex items-center gap-3">
                  <Image src={logo} width={34} height={34} className="rounded-full" alt="Avatar" />
                  <div className="text-sm">
                    <p className="font-medium">Full name</p>
                    <p className="text-gray-500 text-xs">user@example.com</p>
                  </div>
                </div>
              </SidebarFooter>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}