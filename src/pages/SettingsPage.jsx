import React, { useState } from 'react';
import {
  User,
  Settings as SettingsIcon,
  Database,
  RotateCcw,
  Download,
  Trash2,
  Check,
  Shield,
  Palette
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useFinance } from '../context/FinanceContext.jsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import { SEED_FINANCE_DATA } from '../services/mockData.js';

export const SettingsPage = () => {
  const { user, updateUser } = useAuth();
  const { finance, setFinance } = useFinance();

  const [name, setName] = useState(user?.name || 'Karthick');
  const [email, setEmail] = useState(user?.email || 'karthick@mavric.demo');
  const [currency, setCurrency] = useState(user?.currency || 'INR');
  const [fiscalCycleStart, setFiscalCycleStart] = useState(user?.fiscalCycleStart || 1);
  const [themeAccent, setThemeAccent] = useState(user?.themeAccent || 'charcoal');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleSavePreferences = (e) => {
    e.preventDefault();
    updateUser({
      name,
      email,
      currency,
      fiscalCycleStart,
      themeAccent
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(finance, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `mavric-ledger-${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetSeed = () => {
    setFinance(SEED_FINANCE_DATA);
    setShowResetConfirm(false);
  };

  const handleClearAll = () => {
    const emptyState = {
      transactions: [],
      goals: [],
      scenarios: [],
      subscriptions: [],
      snapshots: [],
      notifications: []
    };
    setFinance(emptyState);
    setShowClearConfirm(false);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="pb-2 border-b border-[#2D2F2A]">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#F1E8D7] tracking-tight">
          Workspace Settings & Preferences
        </h2>
        <p className="text-xs text-[#F1E8D7]/60 mt-1">
          Manage currency standards, fiscal calendars, and ledger persistence
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-[#69745B]/15 border border-[#69745B]/30 text-xs text-[#69745B] flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Your workspace preferences have been saved successfully.</span>
        </div>
      )}

      {/* User Profile Form */}
      <form onSubmit={handleSavePreferences} className="p-6 sm:p-8 rounded-3xl bg-[#20221D] border border-[#2D2F2A] shadow-xl space-y-6">
        <div className="flex items-center gap-2 text-[#C4A16A] pb-3 border-b border-[#2D2F2A]">
          <User className="w-5 h-5" />
          <h3 className="font-serif text-lg text-[#F1E8D7]">Profile Information</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#F1E8D7]/75 mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-xs text-[#F1E8D7] focus:outline-none focus:border-[#C4A16A]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#F1E8D7]/75 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-xs text-[#F1E8D7] focus:outline-none focus:border-[#C4A16A]"
            />
          </div>
        </div>

        {/* Preferences */}
        <div className="flex items-center gap-2 text-[#C4A16A] pt-4 pb-3 border-b border-[#2D2F2A]">
          <SettingsIcon className="w-5 h-5" />
          <h3 className="font-serif text-lg text-[#F1E8D7]">Localization & Formatting</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#F1E8D7]/75 mb-1.5">
              Currency Format
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-xs text-[#F1E8D7] focus:outline-none focus:border-[#C4A16A]"
            >
              <option value="INR">Indian Rupee (₹ INR)</option>
              <option value="USD">US Dollar ($ USD)</option>
              <option value="EUR">Euro (€ EUR)</option>
              <option value="GBP">British Pound (£ GBP)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#F1E8D7]/75 mb-1.5">
              Monthly Salary / Fiscal Cycle Start Day
            </label>
            <select
              value={fiscalCycleStart}
              onChange={(e) => setFiscalCycleStart(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-xs text-[#F1E8D7] focus:outline-none focus:border-[#C4A16A]"
            >
              <option value={1}>1st of each month</option>
              <option value={5}>5th of each month</option>
              <option value={10}>10th of each month</option>
              <option value={25}>25th of each month</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-[#2D2F2A]">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-[#C4A16A] hover:bg-[#b5935b] text-[#191A17] text-xs font-semibold shadow-lg shadow-[#C4A16A]/20 transition-all cursor-pointer"
          >
            Save Preferences
          </button>
        </div>
      </form>

      {/* Data Management Section */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#20221D] border border-[#2D2F2A] shadow-xl space-y-6">
        <div className="flex items-center gap-2 text-[#C4A16A] pb-3 border-b border-[#2D2F2A]">
          <Database className="w-5 h-5" />
          <h3 className="font-serif text-lg text-[#F1E8D7]">Data Management & Ledger Operations</h3>
        </div>

        <div className="space-y-4 text-xs">
          {/* Export JSON */}
          <div className="p-4 rounded-2xl bg-[#191A17] border border-[#2D2F2A] flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-[#F1E8D7]">Export Raw Financial JSON</h4>
              <p className="text-[#F1E8D7]/60 mt-0.5">
                Download full data dump containing transactions, goals, scenarios, and snapshots.
              </p>
            </div>
            <button
              type="button"
              onClick={handleExportJSON}
              className="px-4 py-2 rounded-xl bg-[#20221D] hover:bg-[#282B24] border border-[#2D2F2A] text-xs font-semibold text-[#F1E8D7] flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ml-4"
            >
              <Download className="w-3.5 h-3.5 text-[#C4A16A]" />
              <span>Export</span>
            </button>
          </div>

          {/* Reset Seed Data */}
          <div className="p-4 rounded-2xl bg-[#191A17] border border-[#2D2F2A] flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-[#F1E8D7]">Reset to Demo Seed Data</h4>
              <p className="text-[#F1E8D7]/60 mt-0.5">
                Re-populate transactions, goals, and scenarios back to Karthick's default demo baseline.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowResetConfirm(true)}
              className="px-4 py-2 rounded-xl bg-[#20221D] hover:bg-[#282B24] border border-[#2D2F2A] text-xs font-semibold text-[#C4A16A] flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ml-4"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Seed</span>
            </button>
          </div>

          {/* Clear All */}
          <div className="p-4 rounded-2xl bg-[#191A17] border border-[#C9704C]/30 flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-[#C9704C]">Purge All Records</h4>
              <p className="text-[#F1E8D7]/60 mt-0.5">
                Wipe all transactions, goals, scenarios, and custom snapshots completely.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="px-4 py-2 rounded-xl bg-[#C9704C]/20 hover:bg-[#C9704C]/30 border border-[#C9704C]/40 text-xs font-semibold text-[#C9704C] flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ml-4"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Wipe Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reset Seed Confirm Dialog */}
      <ConfirmDialog
        isOpen={showResetConfirm}
        onClose={() => setShowResetConfirm(false)}
        onConfirm={handleResetSeed}
        title="Reset to Initial Seed Data"
        message="This will replace current changes with the default demo dataset for Karthick. Unsaved custom scenarios will be lost."
        confirmText="Reset to Defaults"
        danger={true}
      />

      {/* Clear All Confirm Dialog */}
      <ConfirmDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearAll}
        title="Purge Workspace Records"
        message="Are you sure you want to purge all records? This removes all ledger rows and goals."
        confirmText="Confirm Purge"
        danger={true}
      />
    </div>
  );
};
