import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  Edit2,
  Trash2,
  Filter,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useFinance } from '../context/FinanceContext.jsx';
import { formatCurrency } from '../utils/calculations.js';
import { TransactionModal } from '../components/modals/TransactionModal.jsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import { MAVRIC_CATEGORIES } from '../services/mockData.js';

export const TransactionsPage = () => {
  const { user } = useAuth();
  const { finance, addTransaction, updateTransaction, deleteTransaction } = useFinance();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [expandedId, setExpandedId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const transactions = finance?.transactions || [];

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        const matchesSearch =
          t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.notes?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === 'all' || t.type === selectedType;
        const matchesCat = selectedCategory === 'all' || t.category === selectedCategory;
        return matchesSearch && matchesType && matchesCat;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
        if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
        if (sortBy === 'amount-desc') return b.amount - a.amount;
        if (sortBy === 'amount-asc') return a.amount - b.amount;
        return 0;
      });
  }, [transactions, searchQuery, selectedType, selectedCategory, sortBy]);

  const handleEdit = (tx, e) => {
    e.stopPropagation();
    setEditingTransaction(tx);
    setIsModalOpen(true);
  };

  const handleDeletePrompt = (id, e) => {
    e.stopPropagation();
    setDeletingId(id);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#2D2F2A]">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#F1E8D7] tracking-tight">
            Financial Transactions
          </h2>
          <p className="text-xs text-[#F1E8D7]/60 mt-1">
            Track and manage your primary ledger with line-item clarity
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingTransaction(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-[#C9704C] hover:bg-[#b05f3d] text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-[#C9704C]/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Transaction</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#20221D] border border-[#2D2F2A] shadow-md flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#F1E8D7]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search descriptions, memos..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-xs text-[#F1E8D7] placeholder-[#F1E8D7]/30 focus:outline-none focus:border-[#C4A16A]"
          />
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#191A17] border border-[#2D2F2A]">
          {['all', 'income', 'expense'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                selectedType === t
                  ? 'bg-[#20221D] text-[#C4A16A] shadow-sm'
                  : 'text-[#F1E8D7]/60 hover:text-[#F1E8D7]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-xs text-[#F1E8D7] focus:outline-none focus:border-[#C4A16A] cursor-pointer"
        >
          <option value="all">All Categories</option>
          {MAVRIC_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Sort Select */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-xs text-[#F1E8D7] focus:outline-none focus:border-[#C4A16A] cursor-pointer"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Amount: High to Low</option>
          <option value="amount-asc">Amount: Low to High</option>
        </select>
      </div>

      {/* Ledger Table Container */}
      <div className="rounded-2xl bg-[#20221D] border border-[#2D2F2A] shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#2D2F2A] bg-[#191A17]/60 text-[#F1E8D7]/60 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4 w-10"></th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4 text-right">Amount</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D2F2A]/60">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-[#F1E8D7]/40">
                    No transactions match your search filters.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => {
                  const isExpanded = expandedId === tx.id;
                  return (
                    <React.Fragment key={tx.id}>
                      <tr
                        onClick={() => setExpandedId(isExpanded ? null : tx.id)}
                        className="hover:bg-[#262923] transition-colors cursor-pointer group"
                      >
                        <td className="py-3 px-4 text-[#F1E8D7]/40">
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-[#C4A16A]" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-[#F1E8D7]/40 group-hover:text-[#F1E8D7]" />
                          )}
                        </td>
                        <td className="py-3 px-4 font-mono text-[#F1E8D7]/70 whitespace-nowrap">
                          {tx.date}
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#F1E8D7]">
                          {tx.description}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded-full bg-[#191A17] border border-[#2D2F2A] text-[11px] text-[#F1E8D7]/80">
                            {tx.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                              tx.type === 'income'
                                ? 'bg-[#69745B]/20 text-[#69745B]'
                                : 'bg-[#C9704C]/20 text-[#C9704C]'
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-bold font-mono">
                          <span className={tx.type === 'income' ? 'text-[#69745B]' : 'text-[#F1E8D7]'}>
                            {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, user?.currency)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={(e) => handleEdit(tx, e)}
                              className="p-1.5 rounded-lg text-[#F1E8D7]/50 hover:text-[#C4A16A] hover:bg-[#191A17] transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDeletePrompt(tx.id, e)}
                              className="p-1.5 rounded-lg text-[#F1E8D7]/50 hover:text-[#C9704C] hover:bg-[#191A17] transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Details Row */}
                      {isExpanded && (
                        <tr className="bg-[#191A17]/80">
                          <td colSpan="7" className="py-3 px-8 text-xs text-[#F1E8D7]/75">
                            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#20221D] border border-[#2D2F2A]">
                              <FileText className="w-4 h-4 text-[#C4A16A] mt-0.5 shrink-0" />
                              <div className="space-y-1">
                                <span className="font-semibold text-[#F1E8D7] block">
                                  Transaction Memo & Notes
                                </span>
                                <p className="text-[#F1E8D7]/70 leading-relaxed font-sans">
                                  {tx.notes || 'No detailed memo provided for this entry.'}
                                </p>
                                <span className="text-[10px] text-[#F1E8D7]/40 font-mono block pt-1">
                                  UUID: {tx.id} • Verified in ledger
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Modal (Add / Edit) */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        onSave={(data) => {
          if (editingTransaction) {
            updateTransaction(data);
          } else {
            addTransaction(data);
          }
        }}
        initialData={editingTransaction}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) {
            deleteTransaction(deletingId);
            setDeletingId(null);
          }
        }}
        title="Delete Transaction"
        message="Are you sure you want to remove this line item from your ledger? This action cannot be undone."
        confirmText="Delete Item"
        danger={true}
      />
    </div>
  );
};
