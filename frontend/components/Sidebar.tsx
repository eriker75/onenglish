"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from 'next/navigation';
import { useSidebar } from "@/src/contexts/SidebarContext";
import { LayoutDashboard, Trophy, FileText, Users, BookOpen, BarChart3, School, Settings, LogOut, ChevronLeft, ChevronRight, Briefcase, CreditCard } from 'lucide-react';
import { cn } from "@/lib/utils";
import { logout } from '@/lib/demo-auth';

interface SidebarProps {
  variant?: "admin" | "student";
}

const Sidebar = ({ variant }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed, toggleSidebar } = useSidebar();

  const adminNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Trophy, label: "Challenges", href: "/dashboard/challenges" },
    { icon: FileText, label: "Answers", href: "/dashboard/answers" },
    { icon: Users, label: "Students", href: "/dashboard/students" },
    { icon: BookOpen, label: "Teachers", href: "/dashboard/teachers" },
    { icon: Briefcase, label: "Coordinators", href: "/dashboard/coordinators" },
    { icon: CreditCard, label: "Payments", href: "/dashboard/payments" },
    { icon: BarChart3, label: "Statistics", href: "/dashboard/statistics" },
    { icon: School, label: "Schools", href: "/dashboard/schools" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
  ];

  const navItems = adminNavItems;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-white border-r border-border shadow-sm z-40 transition-all duration-300 flex flex-col",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-6 flex-shrink-0">
        {/* Logo and Toggle Button */}
        {!isCollapsed ? (
          <div className="mb-8">
            <div className="w-full flex items-center justify-between gap-3">
              <div className="flex-1 max-w-[160px]">
                <Image
                  src="/OnEnglishLogo.png"
                  alt="On English"
                  width={200}
                  height={80}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
              <button
                onClick={toggleSidebar}
                className="p-2.5 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0"
                style={{ backgroundColor: '#FF0098', color: '#FFFFFF' }}
                title="Contraer sidebar"
                aria-label="Contraer sidebar"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-8 flex justify-center">
            <button
              onClick={toggleSidebar}
              className="p-2.5 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ backgroundColor: '#FF0098', color: '#FFFFFF' }}
              title="Expandir sidebar"
              aria-label="Expandir sidebar"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isCollapsed && "justify-center",
                  isActive
                    ? "bg-pink-50 text-pink-600 font-medium"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                title={isCollapsed ? item.label : ""}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-3 border-t border-border flex-shrink-0">
          <button
            onClick={handleLogout}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 transition-colors",
              isCollapsed && "justify-center"
            )}
            title="Logout"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>
  );
};

export default Sidebar;
