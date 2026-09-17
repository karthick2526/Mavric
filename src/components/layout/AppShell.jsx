import React, { useState } from 'react';
import { Sidebar, NAV_ITEMS } from './Sidebar.jsx';
import { Navbar } from './Navbar.jsx';

export const AppShell = ({ activePage, onSelectPage, children }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const currentNav = NAV_ITEMS.find((item) => item.id === activePage) || NAV_ITEMS[0];

  return (
    <div className="min-h-screen bg-[#191A17] text-[#F1E8D7] flex">
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        onSelectPage={onSelectPage}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          pageTitle={currentNav.label}
          breadcrumb={currentNav.label}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
