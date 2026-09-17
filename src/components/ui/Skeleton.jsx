import React from 'react';
import { motion } from 'motion/react';
import { Layers } from 'lucide-react';

export const Skeleton = ({ className = '', rounded = 'rounded-lg' }) => {
  return (
    <div
      className={`animate-pulse bg-[#252822] ${rounded} ${className}`}
    />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="p-5 rounded-2xl bg-[#20221D] border border-[#2D2F2A] flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <Skeleton className="w-24 h-4" />
        <Skeleton className="w-8 h-8 rounded-full" />
      </div>
      <Skeleton className="w-36 h-8 mt-1" />
      <Skeleton className="w-28 h-3.5" />
    </div>
  );
};

export const ChartSkeleton = ({ height = 'h-64', label = 'Loading Financial Telemetry...' }) => {
  return (
    <div className={`w-full ${height} rounded-2xl bg-[#20221D] border border-[#2D2F2A] p-6 flex flex-col justify-between relative overflow-hidden`}>
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="w-32 h-5" />
        <div className="flex gap-2">
          <Skeleton className="w-16 h-7 rounded-full" />
          <Skeleton className="w-16 h-7 rounded-full" />
        </div>
      </div>
      <div className="flex-1 flex items-end justify-between gap-3 pt-6 pb-2">
        {[45, 65, 30, 80, 55, 70, 90, 40].map((val, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
            <motion.div
              initial={{ height: '20%' }}
              animate={{ height: [`${val * 0.4}%`, `${val}%`, `${val * 0.8}%`] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut', delay: idx * 0.1 }}
              className="w-full max-w-[32px] bg-[#2D2F2A] rounded-t-md"
            />
            <Skeleton className="w-6 h-3" />
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[#20221D] via-transparent to-transparent pointer-events-none flex items-center justify-center">
        <span className="text-xs text-[#F1E8D7]/40 tracking-wider uppercase font-medium bg-[#191A17]/80 px-3 py-1.5 rounded-full border border-[#2D2F2A]">
          {label}
        </span>
      </div>
    </div>
  );
};

export const AnalyzingScenarioSkeleton = ({ scenarioName = 'Laptop Purchase' }) => {
  return (
    <div className="p-6 rounded-2xl bg-[#20221D] border border-[#75677D]/40 shadow-xl text-[#F1E8D7] relative overflow-hidden">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl bg-[#75677D]/20 text-[#75677D]">
          <Layers className="w-5 h-5 animate-spin" />
        </div>
        <div>
          <h4 className="font-serif text-lg text-[#F1E8D7]">Analyzing Scenario: {scenarioName}</h4>
          <p className="text-xs text-[#F1E8D7]/60">Calculating multi-month downstream cash impact & goal delays</p>
        </div>
      </div>

      <div className="w-full bg-[#191A17] h-2 rounded-full overflow-hidden my-4 border border-[#2D2F2A]">
        <motion.div
          className="bg-gradient-to-r from-[#75677D] via-[#C9704C] to-[#C4A16A] h-full"
          initial={{ width: '0%' }}
          animate={{ width: ['10%', '65%', '100%'] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        />
      </div>

      <div className="grid grid-cols-3 gap-3 mt-4 text-center">
        <div className="p-2.5 rounded-lg bg-[#191A17]/50 border border-[#2D2F2A]/60">
          <p className="text-[10px] text-[#F1E8D7]/50 uppercase tracking-wider">Cushion Impact</p>
          <Skeleton className="w-16 h-4 mx-auto mt-1" />
        </div>
        <div className="p-2.5 rounded-lg bg-[#191A17]/50 border border-[#2D2F2A]/60">
          <p className="text-[10px] text-[#F1E8D7]/50 uppercase tracking-wider">Goal Delay</p>
          <Skeleton className="w-16 h-4 mx-auto mt-1" />
        </div>
        <div className="p-2.5 rounded-lg bg-[#191A17]/50 border border-[#2D2F2A]/60">
          <p className="text-[10px] text-[#F1E8D7]/50 uppercase tracking-wider">Risk Level</p>
          <Skeleton className="w-16 h-4 mx-auto mt-1" />
        </div>
      </div>
    </div>
  );
};
