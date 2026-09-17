import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const MetricCard = ({
  title,
  amount,
  change,
  isPositive = true,
  subtitle,
  icon: Icon,
  variant = 'default'
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'terracotta':
        return 'border-[#C9704C]/30 bg-gradient-to-br from-[#20221D] to-[#261E1A]';
      case 'olive':
        return 'border-[#69745B]/30 bg-gradient-to-br from-[#20221D] to-[#1E231C]';
      case 'gold':
        return 'border-[#C4A16A]/30 bg-gradient-to-br from-[#20221D] to-[#26231A]';
      case 'plum':
        return 'border-[#75677D]/30 bg-gradient-to-br from-[#20221D] to-[#241F26]';
      default:
        return 'border-[#2D2F2A] bg-[#20221D]';
    }
  };

  return (
    <div
      className={`p-6 rounded-2xl border ${getVariantStyles()} text-[#F1E8D7] shadow-lg shadow-black/20 hover:border-[#F1E8D7]/20 transition-all duration-300 relative overflow-hidden group`}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#F1E8D7]/60">
          {title}
        </span>
        {Icon && (
          <div className="p-2 rounded-xl bg-[#191A17]/60 border border-[#2D2F2A] text-[#F1E8D7]/80 group-hover:text-[#F1E8D7] transition-colors">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-3">
        <span className="text-3xl font-bold tracking-tight text-[#F1E8D7]">
          {amount}
        </span>
        {change && (
          <span
            className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
              isPositive
                ? 'text-[#69745B] bg-[#69745B]/15 border border-[#69745B]/30'
                : 'text-[#C9704C] bg-[#C9704C]/15 border border-[#C9704C]/30'
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-3 h-3 mr-0.5 inline" />
            ) : (
              <ArrowDownRight className="w-3 h-3 mr-0.5 inline" />
            )}
            {change}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-[#F1E8D7]/60 mt-2 font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
};
