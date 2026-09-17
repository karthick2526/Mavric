import React from 'react';
import {
  LayoutDashboard,
  ReceiptText,
  Target,
  Layers,
  TrendingUp,
  Activity,
  RefreshCw,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
  Shield,
  X
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ReceiptText },
  { id: 'goals', label: 'Goals', icon: Target },
  { id: 'scenarios', label: 'Scenarios', icon: Layers },
  { id: 'forecast', label: 'Forecast', icon: TrendingUp },
  { id: 'insights', label: 'Insights', icon: Activity },
  { id: 'subscriptions', label: 'Subscriptions', icon: RefreshCw },
  { id: 'snapshots', label: 'Snapshots', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings }
];

export const Sidebar = ({
  activePage,
  onSelectPage,
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile
}) => {
  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#141512] border-r border-[#2D2F2A] text-[#F1E8D7] justify-between transition-all duration-300">
      {/* Brand Logo & Tagline */}
      <div>
        <div className="h-16 px-4 flex items-center justify-between border-b border-[#2D2F2A]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#C9704C] to-[#C4A16A] flex items-center justify-center text-[#191A17] font-serif font-bold text-lg shrink-0 shadow-md">
              M
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <span className="font-serif font-bold text-lg tracking-tight text-[#F1E8D7] block leading-none">
                  Mavric
                </span>
                <span className="text-[10px] text-[#C4A16A] tracking-wider uppercase font-semibold block mt-0.5">
                  Scenario Planning
                </span>
              </div>
            )}
          </div>

          {/* Close for mobile drawer */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-[#F1E8D7]/60 hover:text-[#F1E8D7] hover:bg-[#20221D]"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onSelectPage(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#20221D] text-[#C4A16A] border border-[#2D2F2A] shadow-md'
                    : 'text-[#F1E8D7]/70 hover:text-[#F1E8D7] hover:bg-[#191A17]'
                } ${isCollapsed ? 'justify-center px-2' : ''}`}
                title={item.label}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? 'text-[#C4A16A]' : 'text-[#F1E8D7]/60 group-hover:text-[#F1E8D7]'
                  }`}
                />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer & Collapse Toggle */}
      <div className="p-3 border-t border-[#2D2F2A]">
        {!isCollapsed && (
          <div className="mb-3 p-3 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-xs">
            <div className="flex items-center gap-2 text-[#69745B] font-semibold text-[11px] mb-1">
              <Shield className="w-3.5 h-3.5" />
              <span>Isolated Sandbox</span>
            </div>
            <p className="text-[10px] text-[#F1E8D7]/50 leading-relaxed">
              Scenarios never mutate real ledger data until explicitly applied.
            </p>
          </div>
        )}

        {/* Desktop Collapse Button */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden md:flex w-full items-center justify-center gap-2 p-2 rounded-xl text-xs text-[#F1E8D7]/50 hover:text-[#F1E8D7] hover:bg-[#20221D] border border-transparent hover:border-[#2D2F2A] transition-all cursor-pointer"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:block shrink-0 h-screen sticky top-0 transition-all duration-300 z-40 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Slide-in Drawer with Backdrop */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
          />
          <div className="relative w-64 max-w-[80vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-300">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
