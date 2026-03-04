"use client"

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Plus, 
  Search, 
  FileText, 
  LayoutDashboard,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';
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
import { useAuth } from '@/components/auth/AuthProvider';

const navItems = [
  { label: 'New Bill', icon: Plus, href: '/bills/new' },
  { label: 'Search Bill', icon: Search, href: '/bills/search' },
  { label: 'All Bills', icon: FileText, href: '/bills' },
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const isAuthRoute = pathname === '/login' || pathname === '/signup';

  React.useEffect(() => {
    if (isAuthRoute) return;
    if (loading) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthRoute, loading, pathname, router, user]);

  if (isAuthRoute) {
    return <div className="min-h-screen bg-background">{children}</div>;
  }

  if (loading) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full">
        <Sidebar className="no-print">
          <SidebarHeader className="p-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
                <span className="text-white text-xs font-extrabold tracking-[0.08em]">
                  ARC
                </span>
              </div>
              <div className="min-w-0 leading-tight">
                <div className="font-bold text-lg text-primary tracking-tight">SwiftBill</div>
                {profile?.companyName ? (
                  <div className="text-xs text-muted-foreground truncate">
                    {profile.companyName}
                  </div>
                ) : null}
              </div>
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
              {navItems.find(item => item.href === pathname)?.label || 'SwiftBill'}
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