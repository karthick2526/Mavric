import React, { useState } from 'react';
import {
  Plus,
  ArrowRight,
  Target,
  Layers,
  TrendingUp,
  ReceiptText,
  Calculator,
  HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useFinance } from '../context/FinanceContext.jsx';
import { MetricCard } from '../components/cards/MetricCard.jsx';
import { PulseGauge } from '../components/cards/PulseGauge.jsx';
import { formatCurrency } from '../utils/calculations.js';
import { TransactionModal } from '../components/modals/TransactionModal.jsx';
import { GoalModal } from '../components/modals/GoalModal.jsx';
import { ScenarioModal } from '../components/modals/ScenarioModal.jsx';
import { AffordModal } from '../components/modals/AffordModal.jsx';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

export const DashboardPage = ({ onNavigate }) => {
  const { user } = useAuth();
  const {
    finance,
    overviewMetrics,
    pulseScore,
    addTransaction,
    addGoal,
    addScenario
  } = useFinance();

  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState(false);
  const [isAffordModalOpen, setIsAffordModalOpen] = useState(false);

  // Cash flow chart data calibrated to PDF reference (Apr - Sep)
  const cashFlowData = [
    { month: 'Apr', income: 42000, expenses: 28000 },
    { month: 'May', income: 45000, expenses: 30500 },
    { month: 'Jun', income: 44000, expenses: 29000 },
    { month: 'Jul', income: 47000, expenses: 33000 },
    { month: 'Aug', income: 46000, expenses: 30000 },
    { month: 'Sep', income: overviewMetrics.monthlyIncome, expenses: overviewMetrics.monthlyExpenses }
  ];

  const recentTransactions = (finance?.transactions || []).slice(0, 5);
  const activeGoals = (finance?.goals || []).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Top Greeting & Pulse Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#2D2F2A]">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#F1E8D7] tracking-tight">
            Good morning, {user?.name || 'Karthick'}
          </h2>
          <p className="text-xs sm:text-sm text-[#F1E8D7]/65 mt-1">
            {pulseScore.statusDetail}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAffordModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#20221D] border border-[#2D2F2A] hover:border-[#C4A16A] text-xs font-semibold text-[#C4A16A] flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Can I Afford This?</span>
          </button>
          <button
            type="button"
            onClick={() => setIsTxModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#C9704C] hover:bg-[#b05f3d] text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-[#C9704C]/25 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* 3 Core Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <MetricCard
          title="Monthly Income"
          amount={formatCurrency(overviewMetrics.monthlyIncome, user?.currency)}
          change="+12%"
          isPositive={true}
          subtitle="Primary compensation and recurring inflows"
          variant="olive"
        />
        <MetricCard
          title="Living Expenses"
          amount={formatCurrency(overviewMetrics.monthlyExpenses, user?.currency)}
          change="-8%"
          isPositive={true}
          subtitle="Essential housing, bills, and lifestyle outflow"
          variant="terracotta"
        />
        <MetricCard
          title="Available Cushion"
          amount={formatCurrency(overviewMetrics.availableCushion, user?.currency)}
          change="+15%"
          isPositive={true}
          subtitle="Unallocated buffer before goal allocations"
          variant="gold"
        />
      </div>

      {/* Middle Row: Cash Flow Chart + Financial Pulse + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cash Flow Bar Chart (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-2xl bg-[#20221D] border border-[#2D2F2A] shadow-lg shadow-black/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-lg text-[#F1E8D7]">Cash Flow History</h3>
              <p className="text-xs text-[#F1E8D7]/50">Comparing monthly inflow vs expense load</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-[#69745B]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#69745B]" />
                Income
              </span>
              <span className="flex items-center gap-1.5 text-[#C9704C]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C9704C]" />
                Expenses
              </span>
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cashFlowData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <XAxis dataKey="month" stroke="#F1E8D7" opacity={0.4} tick={{ fontSize: 11 }} />
                <YAxis stroke="#F1E8D7" opacity={0.4} tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#191A17', borderColor: '#2D2F2A', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val) => formatCurrency(val, user?.currency)}
                />
                <Bar dataKey="income" fill="#69745B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="#C9704C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Financial Pulse Gauge (3 cols) */}
        <div className="lg:col-span-3">
          <PulseGauge
            score={pulseScore.score}
            status={pulseScore.status}
            detail={pulseScore.statusDetail}
          />
        </div>

        {/* Quick Actions (3 cols) */}
        <div className="lg:col-span-3 p-6 rounded-2xl bg-[#20221D] border border-[#2D2F2A] shadow-lg shadow-black/20 flex flex-col justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F1E8D7]/60 block mb-4">
              Quick Actions
            </span>
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => setIsTxModalOpen(true)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#191A17] hover:bg-[#282B24] border border-[#2D2F2A] text-xs font-medium text-[#F1E8D7] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <ReceiptText className="w-4 h-4 text-[#69745B]" />
                  <span>Add Transaction</span>
                </div>
                <Plus className="w-3.5 h-3.5 text-[#F1E8D7]/40" />
              </button>

              <button
                type="button"
                onClick={() => setIsGoalModalOpen(true)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#191A17] hover:bg-[#282B24] border border-[#2D2F2A] text-xs font-medium text-[#F1E8D7] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Target className="w-4 h-4 text-[#C4A16A]" />
                  <span>Create Goal</span>
                </div>
                <Plus className="w-3.5 h-3.5 text-[#F1E8D7]/40" />
              </button>

              <button
                type="button"
                onClick={() => setIsScenarioModalOpen(true)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#191A17] hover:bg-[#282B24] border border-[#2D2F2A] text-xs font-medium text-[#F1E8D7] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-[#75677D]" />
                  <span>New Scenario</span>
                </div>
                <Plus className="w-3.5 h-3.5 text-[#F1E8D7]/40" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('forecast')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-[#191A17] hover:bg-[#282B24] border border-[#2D2F2A] text-xs font-medium text-[#F1E8D7] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 text-[#C9704C]" />
                  <span>View Forecast</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-[#F1E8D7]/40" />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#2D2F2A] text-[11px] text-[#F1E8D7]/50 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-[#C4A16A]" />
            <span>Need impact simulation? Visit Scenario Lab.</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Goals Summary + Recent Transactions + Editorial Quote */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Goals Summary (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#20221D] border border-[#2D2F2A] shadow-lg shadow-black/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-lg text-[#F1E8D7]">Active Goals</h3>
              <p className="text-xs text-[#F1E8D7]/50">Target progression towards milestone cushion</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('goals')}
              className="text-xs text-[#C4A16A] hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {activeGoals.map((goal) => {
              const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
              return (
                <div key={goal.id} className="p-3.5 rounded-xl bg-[#191A17] border border-[#2D2F2A]">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-semibold text-[#F1E8D7]">{goal.title}</span>
                    <span className="text-xs font-bold text-[#C4A16A]">{pct}%</span>
                  </div>
                  <div className="w-full bg-[#20221D] h-2 rounded-full overflow-hidden mb-2 border border-[#2D2F2A]">
                    <div
                      className="bg-gradient-to-r from-[#C4A16A] to-[#69745B] h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-[#F1E8D7]/55">
                    <span>{formatCurrency(goal.currentAmount, user?.currency)} saved</span>
                    <span>Target: {formatCurrency(goal.targetAmount, user?.currency)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#20221D] border border-[#2D2F2A] shadow-lg shadow-black/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-lg text-[#F1E8D7]">Recent Ledger</h3>
              <p className="text-xs text-[#F1E8D7]/50">Latest financial activities</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('transactions')}
              className="text-xs text-[#C4A16A] hover:underline flex items-center gap-1 cursor-pointer font-medium"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-[#2D2F2A]/60">
            {recentTransactions.map((tx) => (
              <div key={tx.id} className="py-2.5 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-[#F1E8D7]">{tx.description}</h4>
                  <span className="text-[10px] text-[#F1E8D7]/40 block">{tx.category} • {tx.date}</span>
                </div>
                <span
                  className={`text-xs font-bold ${
                    tx.type === 'income' ? 'text-[#69745B]' : 'text-[#F1E8D7]'
                  }`}
                >
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount, user?.currency)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Cinematic Editorial Quote Card (3 cols) - Page 14 reference */}
        <div className="lg:col-span-3 p-6 rounded-2xl bg-gradient-to-b from-[#20221D] via-[#1E211A] to-[#141512] border border-[#2D2F2A] shadow-lg shadow-black/20 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#C4A16A] block mb-2">
              Daily North Star
            </span>
            <p className="font-serif italic text-xl text-[#F1E8D7] leading-snug">
              "Small steps today. Big freedom tomorrow."
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-[#2D2F2A]/80 relative z-10">
            <p className="text-xs text-[#F1E8D7]/60 leading-relaxed">
              Every scenario modeled prevents real-world regret. Review your forecast before major commitments.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('scenarios')}
              className="mt-3 text-xs font-semibold text-[#C4A16A] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Open Scenario Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        onSave={addTransaction}
      />
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSave={addGoal}
      />
      <ScenarioModal
        isOpen={isScenarioModalOpen}
        onClose={() => setIsScenarioModalOpen(false)}
        onSave={addScenario}
      />
      <AffordModal
        isOpen={isAffordModalOpen}
        onClose={() => setIsAffordModalOpen(false)}
      />
    </div>
  );
};
