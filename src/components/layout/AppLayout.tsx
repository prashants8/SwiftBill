"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Plus, 
  Search, 
  FileText, 
  LayoutDashboard,
  Truck,
  Settings,
  Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider, 
  SidebarTrigger,
  SidebarInset
} from '@/components/ui/sidebar';

const navItems = [
  { label: 'New Bill', icon: Plus, href: '/bills/new' },
  { label: 'Search Bill', icon: Search, href: '/bills/search' },
  { label: 'All Bills', icon: FileText, href: '/bills' },
  { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full">
        <Sidebar className="no-print">
          <SidebarHeader className="p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <Truck className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-primary tracking-tight">SwiftBill Freight</span>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-2">
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className={cn("w-5 h-5", pathname === item.href ? "text-primary" : "text-muted-foreground")} />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <div className="mt-auto p-4 border-t">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/settings" className="flex items-center gap-3">
                    <Settings className="w-5 h-5 text-muted-foreground" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </Sidebar>

        <SidebarInset className="bg-background flex flex-col">
          <header className="no-print h-14 border-b flex items-center px-6 sticky top-0 bg-background/80 backdrop-blur-md z-10">
            <SidebarTrigger className="mr-4" />
            <h1 className="font-semibold text-lg">
              {navItems.find(item => item.href === pathname)?.label || 'SwiftBill Freight'}
            </h1>
          </header>
          <main className="flex-1 p-6 overflow-auto">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}