import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Plus,
  Target,
  Calendar,
  AlertTriangle,
  Edit2,
  Trash2,
  Award,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useGoals, useFinance } from '../context/FinanceContext.jsx';
import { formatCurrency } from '../utils/calculations.js';
import { GoalModal } from '../components/modals/GoalModal.jsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';

export const GoalsPage = () => {
  const { user } = useAuth();
  const { overviewMetrics } = useFinance();
  const {
    goals,
    totalGoalContribution,
    isGoalCollision,
    addGoal,
    updateGoal,
    deleteGoal,
    updateGoalAllocation
  } = useGoals();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [celebratingGoalId, setCelebratingGoalId] = useState(null);

  const colors = ['#C4A16A', '#69745B', '#75677D', '#C9704C', '#8A9A86'];

  const pieData = goals.map((g, idx) => ({
    name: g.title,
    value: g.allocationPercent || Math.round(100 / (goals.length || 1)),
    color: colors[idx % colors.length]
  }));

  const handleQuickContribute = (goal) => {
    const increment = Math.round(goal.monthlyContribution || 1000);
    const updatedAmount = Math.min(goal.targetAmount, goal.currentAmount + increment);
    updateGoal({ ...goal, currentAmount: updatedAmount });
    setCelebratingGoalId(goal.id);
    setTimeout(() => setCelebratingGoalId(null), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#2D2F2A]">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#F1E8D7] tracking-tight">
            Financial Goals & Milestone Landscape
          </h2>
          <p className="text-xs text-[#F1E8D7]/60 mt-1">
            Turn your aspirations into mathematically achievable timelines
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingGoal(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-[#C4A16A] hover:bg-[#b5935b] text-[#191A17] text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-[#C4A16A]/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Goal</span>
        </button>
      </div>

      {/* Goal Collision Alert Banner (Signature Feature) */}
      {isGoalCollision ? (
        <div className="p-4 rounded-2xl bg-[#C9704C]/15 border border-[#C9704C]/40 text-xs flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#C9704C] shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-[#F1E8D7]">Goal Collision Warning</h4>
            <p className="text-[#F1E8D7]/80 mt-0.5 leading-relaxed">
              Your active goals require <span className="font-bold text-[#C9704C]">{formatCurrency(totalGoalContribution, user?.currency)}/month</span>, which exceeds your available monthly cushion (<span className="font-bold text-[#F1E8D7]">{formatCurrency(overviewMetrics.availableCushion, user?.currency)}</span>). Use the Priority Simulator below to rebalance allocations.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-2xl bg-[#69745B]/15 border border-[#69745B]/30 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#69745B] shrink-0" />
            <span className="text-[#F1E8D7]/80">
              Total monthly commitments of <span className="font-bold text-[#69745B]">{formatCurrency(totalGoalContribution, user?.currency)}</span> are safely covered by your <span className="font-bold text-[#F1E8D7]">{formatCurrency(overviewMetrics.availableCushion, user?.currency)}</span> cushion.
            </span>
          </div>
          <span className="text-[11px] font-semibold text-[#69745B] uppercase tracking-wider hidden md:block">
            Fully Funded
          </span>
        </div>
      )}

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {goals.map((goal, idx) => {
          const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const isCelebrating = celebratingGoalId === goal.id;

          return (
            <div
              key={goal.id}
              className="p-6 rounded-2xl bg-[#20221D] border border-[#2D2F2A] hover:border-[#C4A16A]/40 transition-all flex flex-col justify-between relative overflow-hidden shadow-lg group"
            >
              {isCelebrating && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-[#C4A16A]/20 backdrop-blur-xs flex items-center justify-center z-20"
                >
                  <div className="p-4 rounded-xl bg-[#191A17] border border-[#C4A16A] text-center">
                    <Sparkles className="w-6 h-6 text-[#C4A16A] mx-auto animate-bounce" />
                    <span className="text-xs font-bold text-[#F1E8D7] block mt-1">Contribution Recorded!</span>
                  </div>
                </motion.div>
              )}

              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#191A17] border border-[#2D2F2A] text-[#C4A16A]">
                    {goal.category || 'Savings'}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingGoal(goal);
                        setIsModalOpen(true);
                      }}
                      className="p-1 rounded text-[#F1E8D7]/40 hover:text-[#F1E8D7] transition-colors"
                      title="Edit Goal"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingId(goal.id)}
                      className="p-1 rounded text-[#F1E8D7]/40 hover:text-[#C9704C] transition-colors"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-serif text-xl text-[#F1E8D7] font-medium">{goal.title}</h3>

                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-[#F1E8D7]">
                    {formatCurrency(goal.currentAmount, user?.currency)}
                  </span>
                  <span className="text-xs text-[#F1E8D7]/50">
                    / {formatCurrency(goal.targetAmount, user?.currency)}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-[#191A17] h-2.5 rounded-full overflow-hidden my-3 border border-[#2D2F2A]">
                  <motion.div
                    className="bg-gradient-to-r from-[#C4A16A] to-[#69745B] h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>

                <div className="flex justify-between text-xs text-[#F1E8D7]/60">
                  <span>{percent}% Completed</span>
                  <span className="text-[#C4A16A] font-medium">{formatCurrency(goal.monthlyContribution, user?.currency)}/mo</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#2D2F2A] space-y-3">
                <div className="flex items-center justify-between text-xs text-[#F1E8D7]/50">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#C4A16A]" />
                    <span>Target Date:</span>
                  </div>
                  <span className="font-mono font-medium text-[#F1E8D7]/80">{goal.targetDate}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleQuickContribute(goal)}
                  className="w-full py-2 px-3 rounded-xl bg-[#191A17] hover:bg-[#282B24] border border-[#2D2F2A] hover:border-[#C4A16A] text-xs font-semibold text-[#F1E8D7] transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C4A16A]" />
                  <span>Quick Contribute (+{formatCurrency(goal.monthlyContribution || 1000, user?.currency)})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Goal Priority Simulator & Allocation Ring - Reference Page 15 */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#20221D] border border-[#2D2F2A] shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#2D2F2A]">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#F1E8D7]">
              Goal Priority Simulator
            </h3>
            <p className="text-xs text-[#F1E8D7]/60 mt-1">
              Adjust monthly contribution weights to dynamically balance milestone target dates
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-right">
            <span className="text-[10px] text-[#F1E8D7]/50 uppercase tracking-wider block">Total Monthly Allocation</span>
            <span className="font-serif text-xl font-bold text-[#C4A16A]">
              {formatCurrency(totalGoalContribution, user?.currency)}/month
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Allocation Sliders (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            {goals.map((goal, idx) => {
              const currentPercent = goal.allocationPercent || Math.round(100 / goals.length);
              return (
                <div key={goal.id} className="p-4 rounded-xl bg-[#191A17] border border-[#2D2F2A]">
                  <div className="flex justify-between items-center text-xs mb-2">
                    <span className="font-semibold text-[#F1E8D7] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }} />
                      {goal.title}
                    </span>
                    <span className="font-mono font-bold text-[#C4A16A]">{currentPercent}%</span>
                  </div>

                  <input
                    type="range"
                    min="5"
                    max="80"
                    step="5"
                    value={currentPercent}
                    onChange={(e) => updateGoalAllocation(goal.id, Number(e.target.value))}
                    className="w-full accent-[#C4A16A] cursor-pointer"
                  />

                  <div className="flex justify-between text-[10px] text-[#F1E8D7]/40 mt-1">
                    <span>Priority {idx + 1}</span>
                    <span>Approx. {formatCurrency(Math.round((overviewMetrics.availableCushion * currentPercent) / 100), user?.currency)}/mo</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Allocation Donut Visual Ring (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-4">
            <div className="h-56 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="#191A17" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#191A17', borderColor: '#2D2F2A', borderRadius: '12px', fontSize: '12px' }}
                    formatter={(val) => `${val}%`}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-[#F1E8D7]/50 uppercase tracking-widest font-semibold">Priority</span>
                <span className="font-serif text-lg font-bold text-[#F1E8D7]">Distribution</span>
              </div>
            </div>

            <p className="text-xs text-[#F1E8D7]/60 text-center max-w-xs mt-2">
              Weighted distribution prioritizes emergency runway before discretionary aspirations.
            </p>
          </div>
        </div>
      </div>

      {/* Goal Modal (Add / Edit) */}
      <GoalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingGoal(null);
        }}
        onSave={(data) => {
          if (editingGoal) {
            updateGoal(data);
          } else {
            addGoal(data);
          }
        }}
        initialData={editingGoal}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={() => {
          if (deletingId) {
            deleteGoal(deletingId);
            setDeletingId(null);
          }
        }}
        title="Delete Milestone Goal"
        message="Are you sure you want to remove this financial goal? Accumulated savings progress will remain in your general liquid balance."
        confirmText="Remove Goal"
        danger={true}
      />
    </div>
  );
};
