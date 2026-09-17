import React, { useState } from 'react';
import {
  Calendar,
  Gift,
  Shield,
  Laptop,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useForecast } from '../context/FinanceContext.jsx';
import { formatCurrency } from '../utils/calculations.js';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';

export const ForecastPage = () => {
  const { user } = useAuth();
  const [range, setRange] = useState(6);
  const { forecastData } = useForecast(range);

  const getEventIcon = (icon) => {
    switch (icon) {
      case 'gift':
        return <Gift className="w-4 h-4 text-[#C4A16A]" />;
      case 'shield':
        return <Shield className="w-4 h-4 text-[#75677D]" />;
      case 'laptop':
        return <Laptop className="w-4 h-4 text-[#C9704C]" />;
      default:
        return <TrendingUp className="w-4 h-4 text-[#69745B]" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#2D2F2A]">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#F1E8D7] tracking-tight">
            Financial Forecast & Timeline
          </h2>
          <p className="text-xs text-[#F1E8D7]/60 mt-1">
            See how your finances evolve over time with scheduled cash flow markers
          </p>
        </div>

        {/* Range Selector: 6M / 12M / 24M */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-[#20221D] border border-[#2D2F2A] self-start sm:self-auto">
          {[6, 12, 24].map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setRange(m)}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                range === m
                  ? 'bg-[#191A17] text-[#C4A16A] shadow-sm border border-[#2D2F2A]'
                  : 'text-[#F1E8D7]/60 hover:text-[#F1E8D7]'
              }`}
            >
              {m}M Horizon
            </button>
          ))}
        </div>
      </div>

      {/* Financial Weather Strip - Signature Feature (Page 9) */}
      <div className="p-6 rounded-2xl bg-[#20221D] border border-[#2D2F2A] shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-serif text-base text-[#F1E8D7]">
              Financial Weather Strip
            </h3>
            <p className="text-xs text-[#F1E8D7]/50">
              Monthly cash flow climate (Green = Stable Cushion, Yellow = Moderate, Red = High Pressure)
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 text-[#69745B]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#69745B]" />
              Stable
            </span>
            <span className="flex items-center gap-1.5 text-[#C4A16A]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C4A16A]" />
              Tight
            </span>
            <span className="flex items-center gap-1.5 text-[#C9704C]">
              <span className="w-2.5 h-2.5 rounded-full bg-[#C9704C]" />
              Pressure
            </span>
          </div>
        </div>

        {/* Weather Strip Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {forecastData.slice(0, 6).map((item) => {
            const isGreen = item.weather === 'green';
            const isYellow = item.weather === 'yellow';

            return (
              <div
                key={item.id}
                className={`p-3.5 rounded-xl border transition-all ${
                  isGreen
                    ? 'bg-[#69745B]/10 border-[#69745B]/30'
                    : isYellow
                    ? 'bg-[#C4A16A]/10 border-[#C4A16A]/30'
                    : 'bg-[#C9704C]/10 border-[#C9704C]/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-mono text-xs font-bold text-[#F1E8D7]">
                    {item.monthKey}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isGreen ? 'bg-[#69745B]' : isYellow ? 'bg-[#C4A16A]' : 'bg-[#C9704C]'
                    }`}
                  />
                </div>
                <div className="text-xs font-bold text-[#F1E8D7]">
                  {formatCurrency(item.available, user?.currency)}
                </div>
                <p className="text-[10px] text-[#F1E8D7]/60 mt-1 leading-tight line-clamp-2">
                  {item.weatherReason}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Projection Chart & Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cash Flow Timeline Chart (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#20221D] border border-[#2D2F2A] shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-serif text-lg text-[#F1E8D7]">
                Projected Cash Flow vs Pressure
              </h3>
              <p className="text-xs text-[#F1E8D7]/50">Forward looking monthly trajectories</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-[#69745B]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#69745B]" />
                Inflow
              </span>
              <span className="flex items-center gap-1.5 text-[#C9704C]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C9704C]" />
                Outflow
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={forecastData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
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

        {/* Upcoming Event Markers (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-[#20221D] border border-[#2D2F2A] shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="font-serif text-lg text-[#F1E8D7] mb-1">Upcoming Events</h3>
            <p className="text-xs text-[#F1E8D7]/50 mb-4">Milestones & seasonal outlays</p>

            <div className="space-y-3">
              {forecastData
                .filter((f) => f.marker)
                .map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-[#191A17] border border-[#2D2F2A] flex items-start gap-3"
                  >
                    <div className="p-2 rounded-lg bg-[#20221D] border border-[#2D2F2A] shrink-0 mt-0.5">
                      {getEventIcon(item.marker.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-xs font-semibold text-[#F1E8D7] truncate">
                          {item.marker.title}
                        </h4>
                        <span className={`text-xs font-mono font-bold ${item.marker.type === 'income' ? 'text-[#69745B]' : 'text-[#C9704C]'}`}>
                          {item.marker.type === 'income' ? '+' : '-'}{formatCurrency(item.marker.amount, user?.currency)}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#F1E8D7]/50 mt-0.5 block">
                        {item.monthKey}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-[#2D2F2A] text-xs text-[#F1E8D7]/50">
            Simulated markers account for bonuses, insurance, and equipment upgrades.
          </div>
        </div>
      </div>

      {/* Monthly Breakdown Table (Page 16 Reference) */}
      <div className="rounded-2xl bg-[#20221D] border border-[#2D2F2A] shadow-xl overflow-hidden">
        <div className="p-5 border-b border-[#2D2F2A]">
          <h3 className="font-serif text-lg text-[#F1E8D7]">Monthly Breakdown</h3>
          <p className="text-xs text-[#F1E8D7]/50">Timeline metrics across your forecast horizon</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#2D2F2A] bg-[#191A17]/60 text-[#F1E8D7]/60 uppercase tracking-wider font-semibold">
                <th className="py-3.5 px-4">Month</th>
                <th className="py-3.5 px-4 text-right">Income</th>
                <th className="py-3.5 px-4 text-right">Expenses</th>
                <th className="py-3.5 px-4 text-right">Net Cushion</th>
                <th className="py-3.5 px-4 text-right">Liquid Savings</th>
                <th className="py-3.5 px-4 text-right">Risk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2D2F2A]/60">
              {forecastData.map((row) => (
                <tr key={row.id} className="hover:bg-[#262923] transition-colors">
                  <td className="py-3 px-4 font-mono font-semibold text-[#F1E8D7]">
                    {row.monthKey}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-[#69745B]">
                    {formatCurrency(row.income, user?.currency)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-[#F1E8D7]">
                    {formatCurrency(row.expenses, user?.currency)}
                  </td>
                  <td className={`py-3 px-4 text-right font-mono font-bold ${row.available >= 0 ? 'text-[#C4A16A]' : 'text-[#C9704C]'}`}>
                    {formatCurrency(row.available, user?.currency)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-[#F1E8D7]/75">
                    {formatCurrency(row.cumulativeSavings, user?.currency)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        row.risk === 'High'
                          ? 'bg-[#C9704C]/20 text-[#C9704C]'
                          : row.risk === 'Medium'
                          ? 'bg-[#C4A16A]/20 text-[#C4A16A]'
                          : 'bg-[#69745B]/20 text-[#69745B]'
                      }`}
                    >
                      {row.risk}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
