"use client";

import {
  Home,
  MapIcon,
  MapPin,
  Settings,
  HelpCircle,
  Settings2,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
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

const menuHover = "hover:bg-green-50 hover:text-green-700";
const activeClasses = "bg-green-700 text-white";

export default function DesktopSidebar() {
  const pathname = usePathname() || "";

  const isActive = (path: string) => {
    // exact match or path is prefix (handles nested routes)
    if (!path) return false;
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <div className="hidden sm:block">
      <Sidebar className="w-64 bg-gradient-to-br from-green-50 via-white to-green-100 border-r shadow-sm h-screen fixed">
        {/* HEADER */}
        <SidebarHeader className="px-4 pt-2">
          <h1 className="text-lg font-semibold flex justify-center items-center gap-2">
            <span className="text-green-700">ACI Map</span>
          </h1>
        </SidebarHeader>

        {/* MAIN NAV */}
        <SidebarContent className="px-3">
          <SidebarGroup>
            <SidebarGroupLabel>Main</SidebarGroupLabel>

            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/dashboard">
                  <SidebarMenuButton
                    className={`${menuHover} ${isActive("/dashboard") ? activeClasses : ""}`}
                    aria-current={isActive("/dashboard") ? "page" : undefined}
                  >
                    <Home className="w-4 h-4" />
                    Dashboard
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link href="/territory-map">
                  <SidebarMenuButton
                    className={`${menuHover} ${isActive("/territory-map") ? activeClasses : ""}`}
                    aria-current={isActive("/territory-map") ? "page" : undefined}
                  >
                    <MapPin className="w-4 h-4" />
                    Territory Map
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link href="/district-map">
                  <SidebarMenuButton
                    className={`${menuHover} ${isActive("/district-map") ? activeClasses : ""}`}
                    aria-current={isActive("/district-map") ? "page" : undefined}
                  >
                    <MapIcon className="w-4 h-4" />
                    District Map
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          {/* COMMUNICATION */}
          <SidebarGroup className="mt-4">
            <SidebarGroupLabel>Configurations</SidebarGroupLabel>

            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/territory-mapping">
                  <SidebarMenuButton
                    className={`${menuHover} ${isActive("/territory-mapping") ? activeClasses : ""}`}
                    aria-current={isActive("/territory-mapping") ? "page" : undefined}
                  >
                    <Settings2 className="w-4 h-4" />
                    Territory Mapping
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>

          {/* SETTINGS */}
          <SidebarGroup className="mt-6">
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/settings">
                  <SidebarMenuButton
                    className={`${menuHover} ${isActive("/settings") ? activeClasses : ""}`}
                    aria-current={isActive("/settings") ? "page" : undefined}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <Link href="/help">
                  <SidebarMenuButton
                    className={`${menuHover} ${isActive("/help") ? activeClasses : ""}`}
                    aria-current={isActive("/help") ? "page" : undefined}
                  >
                    <HelpCircle className="w-4 h-4" />
                    Help
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>

        {/* FOOTER (USER INFO) */}
        <SidebarFooter className="p-4 border-t mt-4">
          <div className="flex items-center gap-3">
            <Image src={logo} width={34} height={34} className="rounded-full" alt="Avatar" />
            <div className="text-sm">
              <p className="font-medium">Full name</p>
              <p className="text-gray-500 text-xs">user@example.com</p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}