"use client"

import * as React from "react"
import {
  IconCalendarEvent,
  IconCamera,
  IconCar,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileReport,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePathname } from 'next/navigation';




export function AppSidebar({
  ...props
}) {

  const pathname = usePathname();

  const isActive = (path) => {
    return pathname === path || pathname.startsWith(`${path}/`);
  };

  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: IconDashboard,
        active: isActive('/dashboard') && !isActive('/dashboard/vehicles') && !isActive('/dashboard/bookings'),
      },
      {
        title: "Vehicles",
        url: "/dashboard/vehicles",
        icon: IconCar,
        active: isActive('/dashboard/vehicles'),
      },
      {
        title: "Bookings",
        url: "/dashboard/bookings",
        icon: IconCalendarEvent,
        active: isActive('/dashboard/bookings'),
      },
      {
        title: "Customers",
        url: "/dashboard/customers",
        icon: IconUsers,
        active: isActive('/dashboard/customers'),
      },
      {
        title: "Reports",
        url: "/dashboard/reports",
        icon: IconFileReport,
        active: isActive('/dashboard/reports'),
      },
    ],
    navClouds: [
      {
        title: "Capture",
        icon: IconCamera,
        isActive: true,
       url: "/dashboard",
        items: [
          {
            title: "Active Proposals",
           url: "/dashboard",
          },
          {
            title: "Archived",
           url: "/dashboard",
          },
        ],
      },
      {
        title: "Proposal",
        icon: IconFileDescription,
       url: "/dashboard",
        items: [
          {
            title: "Active Proposals",
           url: "/dashboard",
          },
          {
            title: "Archived",
           url: "/dashboard",
          },
        ],
      },
      {
        title: "Prompts",
        icon: IconFileAi,
       url: "/dashboard",
        items: [
          {
            title: "Active Proposals",
           url: "/dashboard",
          },
          {
            title: "Archived",
           url: "/dashboard",
          },
        ],
      },
    ],
    navSecondary: [
      {
        title: "Settings",
       url: "/dashboard",
        icon: IconSettings,
      },
      {
        title: "Get Help",
       url: "/dashboard",
        icon: IconHelp,
      },
      {
        title: "Search",
       url: "/dashboard",
        icon: IconSearch,
      },
    ],
    documents: [
      {
        name: "Data Library",
       url: "/dashboard",
        icon: IconDatabase,
      },
      {
        name: "Reports",
       url: "/dashboard",
        icon: IconReport,
      },
      {
        name: "Word Assistant",
       url: "/dashboard",
        icon: IconFileWord,
      },
    ],
  }
 


  return (
    (<Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>)
  );
}
