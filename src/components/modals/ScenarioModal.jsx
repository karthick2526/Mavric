import React, { useState } from 'react';
import { Modal } from '../ui/Modal.jsx';

export const ScenarioModal = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [salaryChange, setSalaryChange] = useState('0');
  const [rentChange, setRentChange] = useState('0');
  const [oneTimeExpense, setOneTimeExpense] = useState('0');
  const [monthlyExpenseChange, setMonthlyExpenseChange] = useState('0');
  const [durationMonths, setDurationMonths] = useState('6');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      description: description.trim(),
      salaryChange: parseFloat(salaryChange) || 0,
      rentChange: parseFloat(rentChange) || 0,
      oneTimeExpense: parseFloat(oneTimeExpense) || 0,
      monthlyExpenseChange: parseFloat(monthlyExpenseChange) || 0,
      durationMonths: parseInt(durationMonths, 10) || 6
    });

    onClose();
    setName('');
    setDescription('');
    setSalaryChange('0');
    setRentChange('0');
    setOneTimeExpense('0');
    setMonthlyExpenseChange('0');
    setDurationMonths('6');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Model New Scenario in Lab"
      subtitle="Simulate financial ripples without mutating active ledger records"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#F1E8D7]/75 mb-1.5">
            Scenario Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. MacBook Pro Purchase, Rent Hike Shock, Career Switch"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-[#F1E8D7] placeholder-[#F1E8D7]/30 text-sm focus:outline-none focus:border-[#75677D] transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-[#F1E8D7]/75 mb-1.5">
            Scenario Rationale / Description
          </label>
          <textarea
            rows="2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Upgrading hardware for remote contracting; testing runway impact..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-[#F1E8D7] placeholder-[#F1E8D7]/30 text-sm focus:outline-none focus:border-[#75677D] transition-colors resize-none"
          />
        </div>

        <div className="p-4 rounded-xl bg-[#191A17] border border-[#2D2F2A] space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#C4A16A]">
            Financial Parameters
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[#F1E8D7]/65 mb-1">
                Salary Change / mo (₹)
              </label>
              <input
                type="number"
                value={salaryChange}
                onChange={(e) => setSalaryChange(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 rounded-lg bg-[#20221D] border border-[#2D2F2A] text-[#F1E8D7] text-sm focus:outline-none focus:border-[#75677D]"
              />
              <span className="text-[10px] text-[#F1E8D7]/40">Use negative for salary drop</span>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#F1E8D7]/65 mb-1">
                Rent Change / mo (₹)
              </label>
              <input
                type="number"
                value={rentChange}
                onChange={(e) => setRentChange(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 rounded-lg bg-[#20221D] border border-[#2D2F2A] text-[#F1E8D7] text-sm focus:outline-none focus:border-[#75677D]"
              />
              <span className="text-[10px] text-[#F1E8D7]/40">e.g. +2400 for rent increase</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-[#F1E8D7]/65 mb-1">
                One-Time Lump Expense (₹)
              </label>
              <input
                type="number"
                min="0"
                value={oneTimeExpense}
                onChange={(e) => setOneTimeExpense(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 rounded-lg bg-[#20221D] border border-[#2D2F2A] text-[#F1E8D7] text-sm focus:outline-none focus:border-[#75677D]"
              />
              <span className="text-[10px] text-[#F1E8D7]/40">e.g. 50100 for hardware</span>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#F1E8D7]/65 mb-1">
                Amortization Duration (Months)
              </label>
              <select
                value={durationMonths}
                onChange={(e) => setDurationMonths(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#20221D] border border-[#2D2F2A] text-[#F1E8D7] text-sm focus:outline-none focus:border-[#75677D] cursor-pointer"
              >
                <option value="3">3 Months</option>
                <option value="6">6 Months</option>
                <option value="12">12 Months</option>
                <option value="24">24 Months</option>
              </select>
              <span className="text-[10px] text-[#F1E8D7]/40">Horizon for impact absorption</span>
            </div>
          </div>
        </div>

        <div className="pt-3 flex items-center justify-end gap-3 border-t border-[#2D2F2A]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#F1E8D7]/70 hover:text-[#F1E8D7] rounded-lg border border-[#2D2F2A] hover:bg-[#2D2F2A] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#75677D] text-[#F1E8D7] hover:bg-[#63566a] transition-all shadow-md cursor-pointer font-medium"
          >
            Add to Scenario Lab
          </button>
        </div>
      </form>
    </Modal>
  );
};
