import React, { useState } from 'react';
import { Modal } from '../ui/Modal.jsx';
import { useFinance } from '../../context/FinanceContext.jsx';
import { calculateAffordability, formatCurrency } from '../../utils/calculations.js';
import { CreditCard, Wallet, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const AffordModal = ({ isOpen, onClose }) => {
  const { finance, overviewMetrics } = useFinance();
  const [itemName, setItemName] = useState('Developer Laptop (MacBook)');
  const [itemPrice, setItemPrice] = useState('70000');
  const [emiMonths, setEmiMonths] = useState(6);

  const analysis = calculateAffordability(itemPrice, finance, emiMonths);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Can I Afford This?"
      subtitle="Compare instant cash vs monthly installment impact on your financial cushion and active goals"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#F1E8D7]/75 mb-1">
              Planned Purchase Item
            </label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-[#F1E8D7] text-sm focus:outline-none focus:border-[#C4A16A]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#F1E8D7]/75 mb-1">
              Purchase Price (₹)
            </label>
            <input
              type="number"
              min="1"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-[#F1E8D7] text-sm focus:outline-none focus:border-[#C4A16A]"
            />
          </div>
        </div>

        {/* Current Cushion Baseline */}
        <div className="p-3.5 rounded-xl bg-[#191A17] border border-[#2D2F2A] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-[#F1E8D7]/50">Current Monthly Cushion: </span>
            <span className="font-bold text-[#69745B]">{formatCurrency(overviewMetrics.availableCushion)}</span>
          </div>
          <div>
            <span className="text-[#F1E8D7]/50">Active Goals Need: </span>
            <span className="font-bold text-[#C4A16A]">{formatCurrency(overviewMetrics.totalGoalContribution)}/mo</span>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {/* Cash Scenario */}
          <div className="p-4 rounded-xl bg-[#191A17] border border-[#2D2F2A] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#2D2F2A]">
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-[#69745B]" />
                  <span className="text-sm font-semibold text-[#F1E8D7]">Full Cash Payment</span>
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                  analysis.cash.affordable
                    ? 'bg-[#69745B]/20 text-[#69745B]'
                    : 'bg-[#C9704C]/20 text-[#C9704C]'
                }`}>
                  {analysis.cash.affordable ? 'Feasible' : 'Dips in Reserves'}
                </span>
              </div>

              <div className="my-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#F1E8D7]/60">Total Outflow</span>
                  <span className="font-bold text-[#F1E8D7]">{formatCurrency(analysis.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#F1E8D7]/60">Interest Cost</span>
                  <span className="font-medium text-[#69745B]">₹0 (Zero interest)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#F1E8D7]/60">Immediate Impact</span>
                  <span className="font-medium text-[#F1E8D7]/90">{formatCurrency(-analysis.price)} on cash</span>
                </div>
              </div>
            </div>

            <div className="mt-3 p-2.5 rounded-lg bg-[#20221D] border border-[#2D2F2A] text-xs text-[#F1E8D7]/70 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#69745B] shrink-0 mt-0.5" />
              <span>{analysis.cash.impactNote}</span>
            </div>
          </div>

          {/* EMI Installment Scenario */}
          <div className="p-4 rounded-xl bg-[#191A17] border border-[#2D2F2A] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-[#2D2F2A]">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#C4A16A]" />
                  <span className="text-sm font-semibold text-[#F1E8D7]">Installment / EMI</span>
                </div>
                <select
                  value={emiMonths}
                  onChange={(e) => setEmiMonths(Number(e.target.value))}
                  className="bg-[#20221D] border border-[#2D2F2A] text-xs px-2 py-1 rounded text-[#C4A16A] focus:outline-none cursor-pointer"
                >
                  <option value={3}>3 Months</option>
                  <option value={6}>6 Months</option>
                  <option value={12}>12 Months</option>
                </select>
              </div>

              <div className="my-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#F1E8D7]/60">Monthly EMI</span>
                  <span className="font-bold text-[#C4A16A]">{formatCurrency(analysis.emi.monthlyCost)}/mo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#F1E8D7]/60">Total Cost</span>
                  <span className="font-medium text-[#F1E8D7]">{formatCurrency(analysis.emi.totalPaid)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#F1E8D7]/60">Est. Interest Cost</span>
                  <span className="font-medium text-[#C9704C]">+{formatCurrency(analysis.emi.interestCost)}</span>
                </div>
              </div>
            </div>

            <div className={`mt-3 p-2.5 rounded-lg border text-xs flex items-start gap-2 ${
              analysis.emi.collidesWithGoals
                ? 'bg-[#C9704C]/10 border-[#C9704C]/30 text-[#C9704C]'
                : 'bg-[#20221D] border-[#2D2F2A] text-[#F1E8D7]/70'
            }`}>
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{analysis.emi.impactNote}</span>
            </div>
          </div>
        </div>

        <div className="pt-3 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#C4A16A] text-[#191A17] hover:bg-[#b5935b] transition-colors cursor-pointer"
          >
            Close Analysis
          </button>
        </div>
      </div>
    </Modal>
  );
};
