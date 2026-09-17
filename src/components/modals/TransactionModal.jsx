import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal.jsx';
import { MAVRIC_CATEGORIES } from '../../services/mockData.js';

export const TransactionModal = ({ isOpen, onClose, onSave, initialData = null }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description || '');
      setAmount(initialData.amount ? String(initialData.amount) : '');
      setType(initialData.type || 'expense');
      setCategory(initialData.category || 'Food');
      setDate(initialData.date || new Date().toISOString().split('T')[0]);
      setNotes(initialData.notes || '');
    } else {
      setDescription('');
      setAmount('');
      setType('expense');
      setCategory('Food');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim() || !amount) return;

    onSave({
      ...(initialData ? { id: initialData.id } : {}),
      description: description.trim(),
      amount: Math.abs(parseFloat(amount)),
      type,
      category,
      date,
      notes: notes.trim()
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Transaction' : 'Record Transaction'}
      subtitle="Track your income and living expenses with precision"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#191A17] rounded-xl border border-[#2D2F2A]">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              type === 'expense'
                ? 'bg-[#C9704C] text-white shadow-md'
                : 'text-[#F1E8D7]/60 hover:text-[#F1E8D7]'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              type === 'income'
                ? 'bg-[#69745B] text-white shadow-md'
                : 'text-[#F1E8D7]/60 hover:text-[#F1E8D7]'
            }`}
          >
            Income
          </button>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-[#F1E8D7]/75 mb-1.5">
            Description
          </label>
          <input
            type="text"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Grocery replenishment, Salary bonus"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-[#F1E8D7] placeholder-[#F1E8D7]/30 text-sm focus:outline-none focus:border-[#C4A16A] transition-colors"
          />
        </div>

        {/* Amount & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#F1E8D7]/75 mb-1.5">
              Amount (₹)
            </label>
            <input
              type="number"
              step="any"
              min="0"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-[#F1E8D7] placeholder-[#F1E8D7]/30 text-sm focus:outline-none focus:border-[#C4A16A] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#F1E8D7]/75 mb-1.5">
              Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-[#F1E8D7] text-sm focus:outline-none focus:border-[#C4A16A] transition-colors"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-medium text-[#F1E8D7]/75 mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-[#F1E8D7] text-sm focus:outline-none focus:border-[#C4A16A] transition-colors cursor-pointer"
          >
            {MAVRIC_CATEGORIES.map((cat) => (
              <option key={cat} value={cat} className="bg-[#20221D] text-[#F1E8D7]">
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-medium text-[#F1E8D7]/75 mb-1.5">
            Notes / Details (Optional)
          </label>
          <textarea
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Additional context or invoice memo..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-[#F1E8D7] placeholder-[#F1E8D7]/30 text-sm focus:outline-none focus:border-[#C4A16A] transition-colors resize-none"
          />
        </div>

        {/* Action Buttons */}
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
            {initialData ? 'Update Transaction' : 'Save Transaction'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
