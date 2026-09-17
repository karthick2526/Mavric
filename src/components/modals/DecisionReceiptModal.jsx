import React from 'react';
import { Modal } from '../ui/Modal.jsx';
import { formatCurrency } from '../../utils/calculations.js';
import { CheckCircle2, ShieldCheck, Download } from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';

export const DecisionReceiptModal = ({ isOpen, onClose, scenario, impact }) => {
  const { showToast } = useToast();
  if (!scenario || !impact) return null;

  const handleDownload = () => {
    showToast({
      title: 'Decision Receipt Exported',
      message: 'Summary snapshot saved to local receipts ledger.',
      type: 'success'
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Financial Decision Receipt"
      subtitle="Audit-ready snapshot of tested scenario, downstream impact, and trade-offs"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Receipt Header Paper Style */}
        <div className="p-5 rounded-xl bg-[#191A17] border border-[#2D2F2A] relative overflow-hidden font-mono text-xs">
          <div className="flex items-center justify-between pb-3 border-b border-dashed border-[#2D2F2A]">
            <div>
              <span className="font-serif font-bold text-sm tracking-wide text-[#F1E8D7]">MAVRIC FINANCE</span>
              <p className="text-[10px] text-[#F1E8D7]/40">DECISION REF: #{scenario.id}</p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#C4A16A] uppercase font-bold">VERIFIED PLAN</span>
              <p className="text-[10px] text-[#F1E8D7]/40">{scenario.createdAt || new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <div className="py-3 space-y-2 border-b border-dashed border-[#2D2F2A]">
            <div className="flex justify-between">
              <span className="text-[#F1E8D7]/60">Decision Chosen:</span>
              <span className="font-bold text-[#F1E8D7]">{scenario.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#F1E8D7]/60">Monthly Inflow (Post):</span>
              <span className="text-[#F1E8D7]">{formatCurrency(impact.scenarioPlan.income)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#F1E8D7]/60">Monthly Outflow (Post):</span>
              <span className="text-[#F1E8D7]">{formatCurrency(impact.scenarioPlan.expenses)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#F1E8D7]/60">Net Monthly Cushion:</span>
              <span className={`font-bold ${impact.cushionDelta >= 0 ? 'text-[#69745B]' : 'text-[#C9704C]'}`}>
                {formatCurrency(impact.scenarioPlan.available)} ({impact.cushionDeltaPercent}%)
              </span>
            </div>
          </div>

          <div className="py-3 space-y-2 border-b border-dashed border-[#2D2F2A]">
            <span className="text-[10px] uppercase tracking-wider text-[#C4A16A]">Evaluated Trade-Offs</span>
            <ul className="space-y-1 text-[11px] text-[#F1E8D7]/75 font-sans">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#69745B] shrink-0" />
                <span>Goal Delay Risk: {impact.goalDelayMonths} month(s) projected</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C4A16A] shrink-0" />
                <span>Risk Profile Assessed: {impact.riskLevel}</span>
              </li>
            </ul>
          </div>

          <div className="pt-3 text-[10px] text-[#F1E8D7]/40 text-center uppercase tracking-widest">
            MAVRIC • PLAN TODAY. UNDERSTAND TOMORROW.
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#F1E8D7]/70 hover:text-[#F1E8D7] rounded-lg border border-[#2D2F2A] hover:bg-[#2D2F2A] transition-colors cursor-pointer"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-[#C4A16A] text-[#191A17] hover:bg-[#b5935b] transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Save Receipt</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
