import React from 'react';
import { motion } from 'motion/react';
import { Activity } from 'lucide-react';

export const PulseGauge = ({ score = 78, status = 'Stable', detail = 'Your finances are on track' }) => {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s) => {
    if (s >= 80) return '#69745B'; // olive
    if (s >= 65) return '#C4A16A'; // gold
    return '#C9704C'; // terracotta
  };

  const ringColor = getColor(score);

  return (
    <div className="p-6 rounded-2xl bg-[#20221D] border border-[#2D2F2A] shadow-lg shadow-black/20 flex flex-col items-center justify-between text-center relative overflow-hidden h-full">
      <div className="w-full flex items-center justify-between mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#F1E8D7]/60">
          Financial Pulse
        </span>
        <Activity className="w-4 h-4 text-[#C4A16A]" />
      </div>

      <div className="relative my-3 flex items-center justify-center">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
          {/* Track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            stroke="#2D2F2A"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress ring */}
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            stroke={ringColor}
            strokeWidth="8"
            strokeLinecap="round"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold tracking-tight text-[#F1E8D7]">
            {score}
            <span className="text-xs text-[#F1E8D7]/50 font-normal">/100</span>
          </span>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-[#C4A16A]">
            {status}
          </span>
        </div>
      </div>

      <p className="text-xs text-[#F1E8D7]/60 leading-tight">
        {detail}
      </p>
    </div>
  );
};
