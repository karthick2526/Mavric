import React, { useState, useRef, useEffect } from 'react';
import { Bell, ChevronDown, User, Settings, LogOut, Check, Calendar, AlertCircle, Layers, Award, ShieldAlert, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useFinance } from '../../context/FinanceContext.jsx';
import { ConfirmDialog } from '../ui/ConfirmDialog.jsx';

export const Navbar = ({ pageTitle, breadcrumb, onToggleMobileSidebar }) => {
  const { user, logout } = useAuth();
  const { finance, markNotificationRead, markAllNotificationsRead, isSyncing } = useFinance();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const notifications = finance?.notifications || [];
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setIsProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getNotifIcon = (type) => {
    switch (type) {
      case 'milestone':
        return <Award className="w-4 h-4 text-[#C4A16A]" />;
      case 'payment':
        return <Calendar className="w-4 h-4 text-[#C9704C]" />;
      case 'cushion':
        return <AlertCircle className="w-4 h-4 text-[#69745B]" />;
      case 'scenario':
        return <Layers className="w-4 h-4 text-[#75677D]" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-[#C4A16A]" />;
    }
  };

  return (
    <>
      <header className="h-16 px-4 md:px-8 border-b border-[#2D2F2A] bg-[#191A17]/80 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between">
        {/* Left: Mobile hamburger & Breadcrumb */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="md:hidden p-2 rounded-lg text-[#F1E8D7]/70 hover:text-[#F1E8D7] hover:bg-[#20221D] cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2 text-[11px] font-medium text-[#F1E8D7]/40 uppercase tracking-wider">
              <span>Mavric</span>
              <span>/</span>
              <span className="text-[#C4A16A]">{breadcrumb || pageTitle}</span>
              {isSyncing && (
                <span className="inline-flex items-center gap-1 text-[10px] text-[#C4A16A]/70 lowercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C4A16A] animate-ping" />
                  syncing
                </span>
              )}
            </div>
            <h1 className="font-serif text-lg md:text-xl text-[#F1E8D7] leading-tight">
              {pageTitle}
            </h1>
          </div>
        </div>

        {/* Right: Notifications & User Dropdown */}
        <div className="flex items-center gap-3">
          {/* Notification Center */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-2.5 rounded-xl border border-[#2D2F2A] bg-[#20221D] hover:bg-[#262923] text-[#F1E8D7]/80 hover:text-[#F1E8D7] transition-colors relative cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#C9704C] text-[10px] font-bold text-white flex items-center justify-center shadow-md">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Popover */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#20221D] border border-[#2D2F2A] shadow-2xl shadow-black/80 py-3 z-50 overflow-hidden">
                <div className="px-4 pb-2.5 border-b border-[#2D2F2A] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm font-semibold text-[#F1E8D7]">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#C9704C]/20 text-[#C9704C] font-semibold">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllNotificationsRead}
                      className="text-xs text-[#C4A16A] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" />
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-[#2D2F2A]/50">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-xs text-[#F1E8D7]/50">
                      No notifications at this time.
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationRead(notif.id)}
                        className={`p-3.5 flex items-start gap-3 hover:bg-[#262923] cursor-pointer transition-colors ${
                          !notif.read ? 'bg-[#191A17]/40' : ''
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-[#191A17] border border-[#2D2F2A] shrink-0 mt-0.5">
                          {getNotifIcon(notif.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4 className="text-xs font-semibold text-[#F1E8D7] truncate">
                              {notif.title}
                            </h4>
                            <span className="text-[10px] text-[#F1E8D7]/40 shrink-0">
                              {notif.date}
                            </span>
                          </div>
                          <p className="text-xs text-[#F1E8D7]/70 mt-1 leading-snug">
                            {notif.message}
                          </p>
                        </div>
                        {!notif.read && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#C9704C] shrink-0 mt-2" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border border-[#2D2F2A] bg-[#20221D] hover:bg-[#262923] transition-colors cursor-pointer"
              aria-label="User menu"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={user?.name || 'Karthick'}
                className="w-7 h-7 rounded-lg object-cover border border-[#2D2F2A]"
              />
              <div className="text-left hidden sm:block">
                <span className="text-xs font-semibold text-[#F1E8D7] block leading-tight">
                  {user?.name || 'Karthick'}
                </span>
                <span className="text-[10px] text-[#F1E8D7]/50 block leading-tight">
                  {user?.role || 'Primary User'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#F1E8D7]/50" />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-[#20221D] border border-[#2D2F2A] shadow-2xl shadow-black/80 py-2 z-50">
                <div className="px-4 py-2 border-b border-[#2D2F2A]">
                  <p className="text-xs font-semibold text-[#F1E8D7] truncate">{user?.name}</p>
                  <p className="text-[11px] text-[#F1E8D7]/50 truncate">{user?.email}</p>
                </div>

                <div className="py-1">
                  <a
                    href="#settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#F1E8D7]/80 hover:text-[#F1E8D7] hover:bg-[#262923] transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-[#C4A16A]" />
                    <span>Profile</span>
                  </a>
                  <a
                    href="#settings"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-[#F1E8D7]/80 hover:text-[#F1E8D7] hover:bg-[#262923] transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-[#75677D]" />
                    <span>Preferences</span>
                  </a>
                </div>

                <div className="pt-1 border-t border-[#2D2F2A]">
                  <button
                    type="button"
                    onClick={() => {
                      setIsProfileOpen(false);
                      setShowLogoutConfirm(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-[#C9704C] hover:bg-[#C9704C]/10 transition-colors cursor-pointer text-left"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Popup */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={logout}
        title="Sign Out of Mavric"
        message="Are you sure you want to end your current session? You can sign back in anytime using the demo account."
        confirmText="Sign Out"
        cancelText="Stay Signed In"
        danger={true}
      />
    </>
  );
};
