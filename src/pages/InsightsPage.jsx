import React from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Shield,
  Activity,
  ArrowRight,
  PieChart as PieIcon,
  RefreshCw,
  Wallet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useFinance } from '../context/FinanceContext.jsx';
import { formatCurrency } from '../utils/calculations.js';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';

export const InsightsPage = ({ onNavigate }) => {
  const { user } = useAuth();
  const { overviewMetrics, pulseScore, finance } = useFinance();

  const categoryBreakdown = [
    { name: 'Housing & Utilities', value: 16200, color: '#C9704C' },
    { name: 'Food & Groceries', value: 6500, color: '#C4A16A' },
    { name: 'Subscriptions', value: overviewMetrics.totalSubscriptionsMonthly, color: '#75677D' },
    { name: 'Lifestyle & Wellness', value: 3800, color: '#69745B' },
    { name: 'Transport & Fuel', value: 2200, color: '#8A9A86' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#2D2F2A]">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#F1E8D7] tracking-tight">
            Financial Insights & Diagnostics
          </h2>
          <p className="text-xs text-[#F1E8D7]/60 mt-1">
            Actionable intelligence to refine cash flow, cut leakage, and strengthen runway
          </p>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-[#20221D] border border-[#2D2F2A] text-xs">
          <Activity className="w-4 h-4 text-[#C4A16A]" />
          <span className="text-[#F1E8D7]/70">Diagnostic Health:</span>
          <span className="font-bold text-[#69745B]">{pulseScore.score}/100</span>
        </div>
      </div>

      {/* 4 Diagnostic Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Pillar 1: Savings Rate */}
        <div className="p-5 rounded-2xl bg-[#20221D] border border-[#2D2F2A] shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#69745B]">
              Savings Rate
            </span>
            <span className="text-xs font-bold text-[#69745B] bg-[#69745B]/15 px-2 py-0.5 rounded-full">
              Strong
            </span>
          </div>
          <div className="font-serif text-3xl font-bold text-[#F1E8D7]">
            {overviewMetrics.savingsRate}%
          </div>
          <p className="text-xs text-[#F1E8D7]/60 mt-2 leading-relaxed">
            You are retaining {overviewMetrics.savingsRate}% of gross income, exceeding the standard 20% benchmark.
          </p>
        </div>

        {/* Pillar 2: Emergency Runway */}
        <div className="p-5 rounded-2xl bg-[#20221D] border border-[#2D2F2A] shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#C4A16A]">
              Emergency Runway
            </span>
            <span className="text-xs font-bold text-[#C4A16A] bg-[#C4A16A]/15 px-2 py-0.5 rounded-full">
              {overviewMetrics.emergencyRunwayMonths} Mo
            </span>
          </div>
          <div className="font-serif text-3xl font-bold text-[#F1E8D7]">
            {overviewMetrics.emergencyRunwayMonths} Months
          </div>
          <p className="text-xs text-[#F1E8D7]/60 mt-2 leading-relaxed">
            Liquid reserves cover {overviewMetrics.emergencyRunwayMonths} months of living expenses. Recommended target is 6 months.
          </p>
        </div>

        {/* Pillar 3: Fixed Cost Ratio */}
        <div className="p-5 rounded-2xl bg-[#20221D] border border-[#2D2F2A] shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#75677D]">
              Fixed Outflows
            </span>
            <span className="text-xs font-bold text-[#75677D] bg-[#75677D]/15 px-2 py-0.5 rounded-full">
              {overviewMetrics.fixedCostRatio}%
            </span>
          </div>
          <div className="font-serif text-3xl font-bold text-[#F1E8D7]">
            {overviewMetrics.fixedCostRatio}%
          </div>
          <p className="text-xs text-[#F1E8D7]/60 mt-2 leading-relaxed">
            Rent, utilities, and recurring bills consume {overviewMetrics.fixedCostRatio}% of total monthly income.
          </p>
        </div>

        {/* Pillar 4: Subscriptions Burden */}
        <div className="p-5 rounded-2xl bg-[#20221D] border border-[#2D2F2A] shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#C9704C]">
              Subscription Drain
            </span>
            <span className="text-xs font-bold text-[#C9704C] bg-[#C9704C]/15 px-2 py-0.5 rounded-full">
              {formatCurrency(overviewMetrics.totalSubscriptionsMonthly, user?.currency)}/mo
            </span>
          </div>
          <div className="font-serif text-3xl font-bold text-[#F1E8D7]">
            {formatCurrency(overviewMetrics.totalSubscriptionsMonthly, user?.currency)}
          </div>
          <p className="text-xs text-[#F1E8D7]/60 mt-2 leading-relaxed">
            9.7% of total monthly expenses is committed to recurring subscriptions and memberships.
          </p>
        </div>
      </div>

      {/* Category Expense Breakdown & Diagnostic Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Donut Chart (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#20221D] border border-[#2D2F2A] shadow-xl flex flex-col items-center">
          <h3 className="font-serif text-lg text-[#F1E8D7] mb-2 self-start">
            Outflow Breakdown
          </h3>
          <p className="text-xs text-[#F1E8D7]/50 mb-4 self-start">
            Where monthly expenses are allocated
          </p>

          <div className="h-60 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#191A17" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#191A17', borderColor: '#2D2F2A', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val) => formatCurrency(val, user?.currency)}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] text-[#F1E8D7]/50 uppercase tracking-wider font-semibold">Total</span>
              <span className="font-serif text-lg font-bold text-[#F1E8D7]">
                {formatCurrency(overviewMetrics.monthlyExpenses, user?.currency)}
              </span>
            </div>
          </div>

          <div className="w-full mt-4 space-y-2">
            {categoryBreakdown.map((c, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-[#F1E8D7]/80">{c.name}</span>
                </div>
                <span className="font-mono font-bold text-[#F1E8D7]">
                  {formatCurrency(c.value, user?.currency)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable Recommendations (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-3xl bg-[#20221D] border border-[#2D2F2A] shadow-xl">
            <div className="flex items-center gap-2 mb-4 text-[#C4A16A]">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-serif text-xl text-[#F1E8D7]">
                Actionable Recommendations
              </h3>
            </div>

            <div className="space-y-3.5">
              <div className="p-4 rounded-xl bg-[#191A17] border border-[#2D2F2A] flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#69745B]/15 text-[#69745B] shrink-0 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-[#F1E8D7]">
                    Reinforce Emergency Runway by 1.8 Months
                  </h4>
                  <p className="text-xs text-[#F1E8D7]/60 mt-1 leading-relaxed">
                    Increasing your Emergency Fund by ₹18,000 will reach the recommended 6-month safety threshold, protecting against unforeseen layoffs or medical emergencies.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate('goals')}
                    className="mt-2 text-xs font-semibold text-[#C4A16A] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Inspect Emergency Goal</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#191A17] border border-[#2D2F2A] flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#C9704C]/15 text-[#C9704C] shrink-0 mt-0.5">
                  <RefreshCw className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-[#F1E8D7]">
                    Cancelable Subscriptions Audit
                  </h4>
                  <p className="text-xs text-[#F1E8D7]/60 mt-1 leading-relaxed">
                    You have ₹1,698/month in low-priority subscriptions (e.g. streaming, cloud storage). Cutting them adds {formatCurrency(1698 * 12, user?.currency)} annually to your liquid wealth.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate('subscriptions')}
                    className="mt-2 text-xs font-semibold text-[#C4A16A] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Review Subscriptions</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#191A17] border border-[#2D2F2A] flex items-start gap-3">
                <div className="p-2 rounded-lg bg-[#75677D]/15 text-[#75677D] shrink-0 mt-0.5">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-[#F1E8D7]">
                    Simulate Upcoming Tech Purchase in Scenario Lab
                  </h4>
                  <p className="text-xs text-[#F1E8D7]/60 mt-1 leading-relaxed">
                    Before purchasing high-ticket electronics, simulate cash drain vs installment plans to avoid dipping into milestone reserves.
                  </p>
                  <button
                    type="button"
                    onClick={() => onNavigate('scenarios')}
                    className="mt-2 text-xs font-semibold text-[#C4A16A] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Launch Scenario Simulation</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
