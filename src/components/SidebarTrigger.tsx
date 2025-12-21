'use client';

import { useSidebar } from '@/components/AppShell';

export default function SidebarTrigger() {
  const { toggleSidebar, isSidebarOpen  } = useSidebar();

  return (
    <button
      onClick={toggleSidebar}
      className="text-gray-500 hover:bg-gray-100 hover:text-gray-700 rounded-lg transition-colors"
      title="Toggle Sidebar"
    >
      <img
        src="/siderbar.svg"
        alt="Toggle Sidebar"
        className={`h-5 w-5 transition-transform duration-300 ${
          isSidebarOpen  ? 'rotate-0' : 'rotate-180'
        }`}
      />
    </button>
  );
}
