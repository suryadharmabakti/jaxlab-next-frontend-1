'use client';

import { type ReactNode, useState, createContext, useContext } from 'react';
import Sidebar from '@/components/Sidebar';

interface SidebarContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within an AppShell');
  }
  return context;
}

export default function AppShell({ children }: { children: ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <SidebarContext.Provider value={{ isSidebarOpen, toggleSidebar }}>
      <div className="flex min-h-screen bg-jax-bg">
        <Sidebar />
        <div
          className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'pl-72' : 'pl-20'}`}
        >
          <div className="px-6 py-6">{children}</div>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}
