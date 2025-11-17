'use client';

import React from 'react';
import { useSidebar } from '@/src/contexts/SidebarContext';

interface DashboardContentProps {
  children: React.ReactNode;
  className?: string;
}

const DashboardContent = ({ children, className = '' }: DashboardContentProps) => {
  const { isCollapsed } = useSidebar();

  return (
    <main className={`${isCollapsed ? 'ml-20' : 'ml-64'} p-8 transition-all duration-300 ${className}`}>
      {children}
    </main>
  );
};

export default DashboardContent;
