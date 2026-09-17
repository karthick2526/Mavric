import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal.jsx';

export const GoalModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [title, setTitle] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [category, setCategory] = useState('Savings');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setTargetAmount(initialData.targetAmount ? String(initialData.targetAmount) : '');
      setCurrentAmount(initialData.currentAmount ? String(initialData.currentAmount) : '0');
      setMonthlyContribution(initialData.monthlyContribution ? String(initialData.monthlyContribution) : '');
      setTargetDate(initialData.targetDate || '2027-12-31');
      setCategory(initialData.category || 'Savings');
    } else {
      setTitle('');
      setTargetAmount('');
      setCurrentAmount('0');
      setMonthlyContribution('');
      setTargetDate('2027-12-31');
      setCategory('Savings');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !targetAmount) return;

    onSave({
      ...(initialData ? { id: initialData.id } : {}),
      title: title.trim(),
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount) || 0,
      monthlyContribution: parseFloat(monthlyContribution) || 0,
      targetDate,
      category
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Milestone Goal' : 'Create New Financial Goal'}
      subtitle="Define target dates and recurring contributions for planned aspirations"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#F1E8D7]/75 mb-1.5">
            Goal Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Emergency Fund, New Laptop, Japan Trip"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-[#F1E8D7] placeholder-[#F1E8D7]/30 text-sm focus:outline-none focus:border-[#C4A16A] transition-colors"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#F1E8D7]/75 mb-1.5">
              Target Amount (₹)
            </label>
            <input
              type="number"
              min="1"
              required
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="75000"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-[#F1E8D7] placeholder-[#F1E8D7]/30 text-sm focus:outline-none focus:border-[#C4A16A] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#F1E8D7]/75 mb-1.5">
              Current Saved (₹)
            </label>
            <input
              type="number"
              min="0"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
              placeholder="32000"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-[#F1E8D7] placeholder-[#F1E8D7]/30 text-sm focus:outline-none focus:border-[#C4A16A] transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#F1E8D7]/75 mb-1.5">
              Monthly Contribution (₹)
            </label>
            <input
              type="number"
              min="0"
              required
              value={monthlyContribution}
              onChange={(e) => setMonthlyContribution(e.target.value)}
              placeholder="9500"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-[#F1E8D7] placeholder-[#F1E8D7]/30 text-sm focus:outline-none focus:border-[#C4A16A] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#F1E8D7]/75 mb-1.5">
              Target Completion Date
            </label>
            <input
              type="date"
              required
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-[#F1E8D7] text-sm focus:outline-none focus:border-[#C4A16A] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#F1E8D7]/75 mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-[#F1E8D7] text-sm focus:outline-none focus:border-[#C4A16A] transition-colors cursor-pointer"
          >
            <option value="Security">Security & Emergency</option>
            <option value="Work">Work & Tech Equipment</option>
            <option value="Travel">Travel & Experiences</option>
            <option value="Housing">Housing & Relocation</option>
            <option value="Savings">General Wealth & Savings</option>
          </select>
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
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#C4A16A] text-[#191A17] hover:bg-[#b5935b] transition-all shadow-md cursor-pointer font-medium"
          >
            {initialData ? 'Update Goal' : 'Create Goal'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
