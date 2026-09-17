import React, { useState } from 'react';
import {
  RefreshCw,
  Plus,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useFinance } from '../context/FinanceContext.jsx';
import { formatCurrency } from '../utils/calculations.js';
import { Modal } from '../components/ui/Modal.jsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';

export const SubscriptionsPage = () => {
  const { user } = useAuth();
  const { finance, overviewMetrics, setFinance } = useFinance();

  const subscriptions = finance?.subscriptions || [];

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [subToDelete, setSubToDelete] = useState(null);

  // Form for adding subscription
  const [formData, setFormData] = useState({
    name: '',
    category: 'Entertainment',
    amount: '',
    billingCycle: 'monthly',
    nextBillingDate: '2026-10-01',
    priority: 'discretionary'
  });

  const handleToggleCancelable = (id) => {
    const updated = subscriptions.map((s) => {
      if (s.id === id) {
        return {
          ...s,
          priority: s.priority === 'cancelable' ? 'discretionary' : 'cancelable'
        };
      }
      return s;
    });
    setFinance({ ...finance, subscriptions: updated });
  };

  const handleAddSubscription = (e) => {
    e.preventDefault();
    const newSub = {
      id: `sub_${Date.now()}`,
      name: formData.name,
      category: formData.category,
      amount: Number(formData.amount),
      billingCycle: formData.billingCycle,
      nextBillingDate: formData.nextBillingDate,
      priority: formData.priority
    };
    setFinance({ ...finance, subscriptions: [newSub, ...subscriptions] });
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      category: 'Entertainment',
      amount: '',
      billingCycle: 'monthly',
      nextBillingDate: '2026-10-01',
      priority: 'discretionary'
    });
  };

  const handleDeleteSubscription = () => {
    if (!subToDelete) return;
    const updated = subscriptions.filter((s) => s.id !== subToDelete.id);
    setFinance({ ...finance, subscriptions: updated });
    setSubToDelete(null);
  };

  const totalMonthlyCost = subscriptions.reduce((sum, s) => {
    return sum + (s.billingCycle === 'annual' ? s.amount / 12 : s.amount);
  }, 0);

  const totalAnnualCost = totalMonthlyCost * 12;

  const cancelablePotentialSavings = subscriptions
    .filter((s) => s.priority === 'cancelable')
    .reduce((sum, s) => sum + (s.billingCycle === 'annual' ? s.amount / 12 : s.amount), 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#2D2F2A]">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#F1E8D7] tracking-tight">
            Subscriptions & Recurring Outflows
          </h2>
          <p className="text-xs text-[#F1E8D7]/60 mt-1">
            Audit automatic renewals and discover recurring cash recovery opportunities
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#75677D] hover:bg-[#64566b] text-[#F1E8D7] text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-[#75677D]/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Subscription</span>
        </button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-[#20221D] border border-[#2D2F2A] shadow-md">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#F1E8D7]/50 block mb-1">
            Total Monthly Drain
          </span>
          <div className="font-serif text-3xl font-bold text-[#F1E8D7]">
            {formatCurrency(totalMonthlyCost, user?.currency)}
          </div>
          <span className="text-xs text-[#F1E8D7]/60 mt-1 block">
            Across {subscriptions.length} recurring accounts
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#20221D] border border-[#2D2F2A] shadow-md">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#F1E8D7]/50 block mb-1">
            Annual Equivalent Cost
          </span>
          <div className="font-serif text-3xl font-bold text-[#C9704C]">
            {formatCurrency(totalAnnualCost, user?.currency)}
          </div>
          <span className="text-xs text-[#F1E8D7]/60 mt-1 block">
            Annualized recurring burn
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#20221D] border border-[#69745B]/30 shadow-md">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#69745B] block mb-1">
            Recoverable Monthly Savings
          </span>
          <div className="font-serif text-3xl font-bold text-[#69745B]">
            {formatCurrency(cancelablePotentialSavings, user?.currency)}
          </div>
          <span className="text-xs text-[#69745B]/80 mt-1 block font-medium">
            Tagged as cancelable or low priority
          </span>
        </div>
      </div>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscriptions.map((sub) => {
          const isCancelable = sub.priority === 'cancelable';
          const isEssential = sub.priority === 'essential';

          return (
            <div
              key={sub.id}
              className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                isCancelable
                  ? 'bg-[#20221D] border-[#C9704C]/40 shadow-lg'
                  : 'bg-[#20221D] border-[#2D2F2A]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      isEssential
                        ? 'bg-[#69745B]/20 text-[#69745B]'
                        : isCancelable
                        ? 'bg-[#C9704C]/20 text-[#C9704C]'
                        : 'bg-[#C4A16A]/20 text-[#C4A16A]'
                    }`}
                  >
                    {sub.priority}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSubToDelete(sub)}
                    className="p-1 text-[#F1E8D7]/30 hover:text-[#C9704C] transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <h3 className="font-serif text-xl text-[#F1E8D7] font-medium">{sub.name}</h3>
                <span className="text-[11px] text-[#F1E8D7]/50 block mt-0.5">{sub.category}</span>

                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#F1E8D7]">
                    {formatCurrency(sub.amount, user?.currency)}
                  </span>
                  <span className="text-xs text-[#F1E8D7]/50 lowercase">
                    / {sub.billingCycle}
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#2D2F2A] space-y-3">
                <div className="flex items-center justify-between text-xs text-[#F1E8D7]/60">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#C4A16A]" />
                    <span>Next renewal:</span>
                  </div>
                  <span className="font-mono font-medium text-[#F1E8D7]">{sub.nextBillingDate}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleCancelable(sub.id)}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    isCancelable
                      ? 'bg-[#69745B]/20 hover:bg-[#69745B]/30 text-[#69745B] border border-[#69745B]/30'
                      : 'bg-[#191A17] hover:bg-[#282B24] text-[#F1E8D7] border border-[#2D2F2A]'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>{isCancelable ? 'Mark as Retained' : 'Tag for Cancellation'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Subscription Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Recurring Subscription"
      >
        <form onSubmit={handleAddSubscription} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#F1E8D7]/75 mb-1.5">
              Service / Provider Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Spotify Premium"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-xs text-[#F1E8D7] focus:outline-none focus:border-[#C4A16A]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#F1E8D7]/75 mb-1.5">
                Amount ({user?.currency || 'INR'})
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="299"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-xs text-[#F1E8D7] focus:outline-none focus:border-[#C4A16A]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#F1E8D7]/75 mb-1.5">
                Billing Cycle
              </label>
              <select
                value={formData.billingCycle}
                onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-xs text-[#F1E8D7] focus:outline-none focus:border-[#C4A16A]"
              >
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#F1E8D7]/75 mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-xs text-[#F1E8D7] focus:outline-none focus:border-[#C4A16A]"
              >
                <option value="Entertainment">Entertainment</option>
                <option value="Productivity">Productivity</option>
                <option value="Fitness">Fitness</option>
                <option value="Cloud Storage">Cloud Storage</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#F1E8D7]/75 mb-1.5">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-xs text-[#F1E8D7] focus:outline-none focus:border-[#C4A16A]"
              >
                <option value="discretionary">Discretionary</option>
                <option value="essential">Essential</option>
                <option value="cancelable">Cancelable</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#2D2F2A]">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs text-[#F1E8D7]/60 hover:text-[#F1E8D7]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#75677D] hover:bg-[#64566b] text-white text-xs font-semibold"
            >
              Save Subscription
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!subToDelete}
        onClose={() => setSubToDelete(null)}
        onConfirm={handleDeleteSubscription}
        title="Remove Subscription"
        message={`Are you sure you want to remove "${subToDelete?.name}" from your tracked subscriptions?`}
        confirmText="Remove"
        danger={true}
      />
    </div>
  );
};
