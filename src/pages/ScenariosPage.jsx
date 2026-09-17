import React, { useState } from 'react';
import {
  Plus,
  Layers,
  Sparkles,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Check,
  RotateCcw,
  FileCheck2,
  Trash2,
  GitBranch,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useScenario, useFinance } from '../context/FinanceContext.jsx';
import { formatCurrency, simulateScenario } from '../utils/calculations.js';
import { ScenarioModal } from '../components/modals/ScenarioModal.jsx';
import { DecisionReceiptModal } from '../components/modals/DecisionReceiptModal.jsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';
import { AnalyzingScenarioSkeleton } from '../components/ui/Skeleton.jsx';

export const ScenariosPage = () => {
  const { user } = useAuth();
  const {
    scenarios,
    activeScenario,
    overviewMetrics,
    simulation,
    addScenario,
    deleteScenario,
    setActiveScenario,
    applyScenario
  } = useScenario();

  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [scenarioToApply, setScenarioToApply] = useState(null);
  const [scenarioToDelete, setScenarioToDelete] = useState(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Recovery Mode simulation state
  const [isRecoveryActive, setIsRecoveryActive] = useState(false);
  const [recoveryCutSubscriptions, setRecoveryCutSubscriptions] = useState(true);
  const [recoveryTrimLifestyle, setRecoveryTrimLifestyle] = useState(true);

  // Switch active scenario with brief simulation feedback
  const handleSelectScenario = (scen) => {
    setIsAnalyzing(true);
    setActiveScenario(scen);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 400);
  };

  // Pre-packaged Stress Test triggers
  const handleTriggerStressTest = (type) => {
    let shockData = {};
    if (type === 'salary_drop') {
      shockData = {
        name: 'Salary Drop (-25%)',
        description: 'Temporary compensation cut during market downturn',
        salaryChange: -Math.round(overviewMetrics.monthlyIncome * 0.25),
        rentChange: 0,
        oneTimeExpense: 0,
        monthlyExpenseChange: 0,
        durationMonths: 6
      };
    } else if (type === 'medical_shock') {
      shockData = {
        name: 'Emergency Medical Expense',
        description: 'Unplanned medical treatment requiring immediate payment',
        salaryChange: 0,
        rentChange: 0,
        oneTimeExpense: 60000,
        monthlyExpenseChange: 0,
        durationMonths: 6
      };
    } else if (type === 'rent_hike') {
      shockData = {
        name: 'Rent Hike (+25%)',
        description: 'Landlord lease renewal increase',
        salaryChange: 0,
        rentChange: 3000,
        oneTimeExpense: 0,
        monthlyExpenseChange: 0,
        durationMonths: 12
      };
    }
    addScenario(shockData);
  };

  // Calculate Recovery impact
  const recoverySavings =
    (recoveryCutSubscriptions ? overviewMetrics.cancelableSavingsMonthly : 0) +
    (recoveryTrimLifestyle ? 3500 : 0);

  const activeSimulation = simulation;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#2D2F2A]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-[#75677D]/20 text-[#75677D] border border-[#75677D]/30">
              Split-Reality Simulator
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#F1E8D7] tracking-tight">
            Scenario Lab & Impact Analysis
          </h2>
          <p className="text-xs text-[#F1E8D7]/60 mt-1">
            Model financial forks, simulate shocks, and audit downstream ripples without touching real records
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-[#75677D] hover:bg-[#63566a] text-[#F1E8D7] text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-[#75677D]/20 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Scenario</span>
          </button>
        </div>
      </div>

      {/* Signature Loop Pill Indicator */}
      <div className="p-3 rounded-xl bg-[#20221D] border border-[#2D2F2A] flex items-center justify-between overflow-x-auto text-xs text-[#F1E8D7]/60 whitespace-nowrap">
        <span className="text-[11px] font-bold text-[#C4A16A] uppercase tracking-wider mr-2">
          Product Loop:
        </span>
        <div className="flex items-center gap-2 font-mono text-[11px]">
          <span className="text-[#F1E8D7]">Plan</span> →
          <span className="text-[#75677D]">Simulate</span> →
          <span className="text-[#C9704C]">Stress Test</span> →
          <span className="text-[#69745B]">Recover</span> →
          <span className="text-[#C4A16A]">Decide</span> →
          <span className="text-[#F1E8D7]">Save Snapshot</span>
        </div>
      </div>

      {/* Main Split-Reality Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Scenario Selector & Parameters (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="p-5 rounded-2xl bg-[#20221D] border border-[#2D2F2A] shadow-md">
            <h3 className="font-serif text-base text-[#F1E8D7] mb-3 flex items-center justify-between">
              <span>Saved Scenarios</span>
              <span className="text-xs text-[#F1E8D7]/40 font-sans">{scenarios.length} available</span>
            </h3>

            <div className="space-y-2.5">
              {scenarios.map((scen) => {
                const isSelected = activeScenario?.id === scen.id;
                return (
                  <div
                    key={scen.id}
                    onClick={() => handleSelectScenario(scen)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#191A17] border-[#75677D] shadow-md shadow-[#75677D]/10'
                        : 'bg-[#20221D] border-[#2D2F2A] hover:bg-[#252822]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <GitBranch className={`w-3.5 h-3.5 ${isSelected ? 'text-[#75677D]' : 'text-[#F1E8D7]/40'}`} />
                          <h4 className="text-xs font-semibold text-[#F1E8D7]">{scen.name}</h4>
                        </div>
                        {scen.description && (
                          <p className="text-[11px] text-[#F1E8D7]/50 mt-1 line-clamp-1">{scen.description}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setScenarioToDelete(scen);
                        }}
                        className="p-1 text-[#F1E8D7]/30 hover:text-[#C9704C] transition-colors"
                        title="Delete Scenario"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[10px] text-[#F1E8D7]/60 font-mono border-t border-[#2D2F2A]/60 pt-2">
                      <span>One-time: {formatCurrency(scen.oneTimeExpense, user?.currency)}</span>
                      <span>{scen.durationMonths} Months</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stress Test Shocks Palette */}
          <div className="p-5 rounded-2xl bg-[#20221D] border border-[#2D2F2A]">
            <div className="flex items-center gap-2 mb-3 text-[#C9704C]">
              <ShieldAlert className="w-4 h-4" />
              <h3 className="font-serif text-sm text-[#F1E8D7]">Instant Stress Tests</h3>
            </div>
            <p className="text-[11px] text-[#F1E8D7]/60 mb-3 leading-relaxed">
              Inject external economic shocks into the model to test resilience:
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleTriggerStressTest('salary_drop')}
                className="w-full text-left p-2.5 rounded-lg bg-[#191A17] hover:bg-[#251E1E] border border-[#2D2F2A] hover:border-[#C9704C]/40 text-xs text-[#F1E8D7] transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>📉 Salary Drop (-25%)</span>
                <span className="text-[10px] text-[#C9704C] font-mono">Simulate</span>
              </button>
              <button
                type="button"
                onClick={() => handleTriggerStressTest('medical_shock')}
                className="w-full text-left p-2.5 rounded-lg bg-[#191A17] hover:bg-[#251E1E] border border-[#2D2F2A] hover:border-[#C9704C]/40 text-xs text-[#F1E8D7] transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>🏥 Medical Emergency (₹60k)</span>
                <span className="text-[10px] text-[#C9704C] font-mono">Simulate</span>
              </button>
              <button
                type="button"
                onClick={() => handleTriggerStressTest('rent_hike')}
                className="w-full text-left p-2.5 rounded-lg bg-[#191A17] hover:bg-[#251E1E] border border-[#2D2F2A] hover:border-[#C9704C]/40 text-xs text-[#F1E8D7] transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>🏢 Rent Hike (+25%)</span>
                <span className="text-[10px] text-[#C9704C] font-mono">Simulate</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live Simulation Impact & Comparison (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {isAnalyzing ? (
            <AnalyzingScenarioSkeleton scenarioName={activeScenario?.name} />
          ) : activeSimulation && activeScenario ? (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#20221D] border border-[#75677D]/30 shadow-2xl space-y-6">
              {/* Header with Title & Action Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2D2F2A]">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-2xl text-[#F1E8D7]">
                      Impact Analysis: {activeScenario.name}
                    </h3>
                  </div>
                  <p className="text-xs text-[#F1E8D7]/60 mt-1">
                    {activeScenario.description || 'Simulated reality compared against current monthly baseline'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsReceiptOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-[#191A17] border border-[#2D2F2A] hover:border-[#C4A16A] text-xs font-semibold text-[#C4A16A] flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <FileCheck2 className="w-3.5 h-3.5" />
                    <span>Decision Receipt</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setScenarioToApply(activeScenario)}
                    className="px-4 py-2 rounded-xl bg-[#69745B] hover:bg-[#58624c] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-md shadow-[#69745B]/20 transition-all"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply Scenario</span>
                  </button>
                </div>
              </div>

              {/* Side-by-Side Reality Comparison Matrix (Page 16 Reference) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Current Baseline Plan */}
                <div className="p-5 rounded-2xl bg-[#191A17] border border-[#2D2F2A]">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#2D2F2A]">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#F1E8D7]/50">
                      Current Active Plan
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#69745B]/20 text-[#69745B] font-semibold">
                      Baseline
                    </span>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#F1E8D7]/60">Monthly Income:</span>
                      <span className="font-bold text-[#F1E8D7]">{formatCurrency(activeSimulation.currentPlan.income, user?.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#F1E8D7]/60">Monthly Expenses:</span>
                      <span className="font-bold text-[#F1E8D7]">{formatCurrency(activeSimulation.currentPlan.expenses, user?.currency)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#2D2F2A]">
                      <span className="text-[#F1E8D7]/80 font-medium">Available Cushion:</span>
                      <span className="font-bold text-[#69745B]">{formatCurrency(activeSimulation.currentPlan.available, user?.currency)}</span>
                    </div>
                  </div>
                </div>

                {/* Simulated Reality Plan */}
                <div className="p-5 rounded-2xl bg-[#191A17] border border-[#75677D]/40">
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#2D2F2A]">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#75677D]">
                      Simulated Future Reality
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#75677D]/20 text-[#75677D] font-semibold">
                      What-If Plan
                    </span>
                  </div>
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#F1E8D7]/60">Scenario Income:</span>
                      <span className="font-bold text-[#F1E8D7]">{formatCurrency(activeSimulation.scenarioPlan.income, user?.currency)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#F1E8D7]/60">Scenario Expenses:</span>
                      <span className="font-bold text-[#F1E8D7]">{formatCurrency(activeSimulation.scenarioPlan.expenses, user?.currency)}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-[#2D2F2A]">
                      <span className="text-[#F1E8D7]/80 font-medium">Scenario Cushion:</span>
                      <span className={`font-bold ${activeSimulation.scenarioPlan.available >= 0 ? 'text-[#C4A16A]' : 'text-[#C9704C]'}`}>
                        {formatCurrency(activeSimulation.scenarioPlan.available, user?.currency)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Ripple Impact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-center">
                  <span className="text-[10px] text-[#F1E8D7]/50 uppercase tracking-wider font-semibold block mb-1">
                    Cushion Delta
                  </span>
                  <span className={`text-xl font-bold font-mono ${activeSimulation.cushionDelta >= 0 ? 'text-[#69745B]' : 'text-[#C9704C]'}`}>
                    {activeSimulation.cushionDelta >= 0 ? '+' : ''}{formatCurrency(activeSimulation.cushionDelta, user?.currency)} ({activeSimulation.cushionDeltaPercent}%)
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-center">
                  <span className="text-[10px] text-[#F1E8D7]/50 uppercase tracking-wider font-semibold block mb-1">
                    Goal Completion Ripple
                  </span>
                  <span className="text-xl font-bold text-[#C4A16A]">
                    {activeSimulation.goalDelayMonths > 0 ? `+${activeSimulation.goalDelayMonths} months delay` : 'No delay'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-center">
                  <span className="text-[10px] text-[#F1E8D7]/50 uppercase tracking-wider font-semibold block mb-1">
                    Assessed Risk Level
                  </span>
                  <span className={`text-xl font-bold ${
                    activeSimulation.riskLevel.includes('High') ? 'text-[#C9704C]' : activeSimulation.riskLevel.includes('Medium') ? 'text-[#C4A16A]' : 'text-[#69745B]'
                  }`}>
                    {activeSimulation.riskLevel}
                  </span>
                </div>
              </div>

              {/* Financial Ripple Analysis Breakdown */}
              <div className="p-5 rounded-2xl bg-[#191A17] border border-[#2D2F2A]">
                <h4 className="text-xs font-semibold text-[#F1E8D7] uppercase tracking-wider mb-2">
                  Downstream Financial Ripple
                </h4>
                <p className="text-xs text-[#F1E8D7]/75 leading-relaxed">
                  {activeSimulation.cushionDelta < 0
                    ? `Committing to "${activeScenario.name}" reduces monthly discretionary cushion by ${formatCurrency(Math.abs(activeSimulation.cushionDelta), user?.currency)}. This shifts your Emergency Fund target completion forward and narrows buffer for surprise expenses.`
                    : `This scenario increases net monthly cash flow by ${formatCurrency(activeSimulation.cushionDelta, user?.currency)}, accelerating your goal achievements without pressure.`}
                </p>
              </div>

              {/* Recovery Mode (Signature Feature - Page 8 & 9) */}
              <div className="p-5 rounded-2xl bg-[#191A17] border border-[#69745B]/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#69745B]" />
                    <h4 className="text-xs font-bold text-[#F1E8D7] uppercase tracking-wider">
                      Recovery Strategy Simulator
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsRecoveryActive(!isRecoveryActive)}
                    className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold cursor-pointer transition-colors ${
                      isRecoveryActive
                        ? 'bg-[#69745B] text-white'
                        : 'bg-[#20221D] text-[#F1E8D7]/70 border border-[#2D2F2A]'
                    }`}
                  >
                    {isRecoveryActive ? 'Recovery Active' : 'Test Recovery Mode'}
                  </button>
                </div>

                {isRecoveryActive ? (
                  <div className="space-y-3 pt-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <label className="flex items-center gap-2 p-2.5 rounded-lg bg-[#20221D] border border-[#2D2F2A] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={recoveryCutSubscriptions}
                          onChange={(e) => setRecoveryCutSubscriptions(e.target.checked)}
                          className="accent-[#69745B]"
                        />
                        <span>Cut non-essential subscriptions (+{formatCurrency(overviewMetrics.cancelableSavingsMonthly, user?.currency)}/mo)</span>
                      </label>
                      <label className="flex items-center gap-2 p-2.5 rounded-lg bg-[#20221D] border border-[#2D2F2A] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={recoveryTrimLifestyle}
                          onChange={(e) => setRecoveryTrimLifestyle(e.target.checked)}
                          className="accent-[#69745B]"
                        />
                        <span>Trim lifestyle spend by 20% (+₹3,500/mo)</span>
                      </label>
                    </div>

                    <div className="p-3 rounded-lg bg-[#69745B]/15 border border-[#69745B]/30 text-xs text-[#F1E8D7] flex items-center justify-between">
                      <span>Simulated Cushion Recovery:</span>
                      <span className="font-bold text-[#69745B]">
                        +{formatCurrency(recoverySavings, user?.currency)}/month restored
                      </span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-[#F1E8D7]/60">
                    If this scenario tightens your budget, test hypothetical spending adjustments before making irreversible cuts.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-[#20221D] border border-[#2D2F2A] text-center text-[#F1E8D7]/50">
              Select or create a scenario to inspect its split-reality ripple.
            </div>
          )}
        </div>
      </div>

      {/* New Scenario Modal */}
      <ScenarioModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSave={addScenario}
      />

      {/* Decision Receipt Modal */}
      {activeScenario && activeSimulation && (
        <DecisionReceiptModal
          isOpen={isReceiptOpen}
          onClose={() => setIsReceiptOpen(false)}
          scenario={activeScenario}
          impact={activeSimulation}
        />
      )}

      {/* Apply Scenario Confirmation Dialog (Mutates Real Data) */}
      <ConfirmDialog
        isOpen={!!scenarioToApply}
        onClose={() => setScenarioToApply(null)}
        onConfirm={() => {
          if (scenarioToApply) {
            applyScenario(scenarioToApply);
            setScenarioToApply(null);
          }
        }}
        title="Apply Scenario to Live Ledger"
        message={`Applying "${scenarioToApply?.name}" will update your actual monthly income/expenses in the active ledger. Are you sure you want to commit this plan?`}
        confirmText="Commit & Apply"
        danger={false}
      />

      {/* Delete Scenario Confirmation */}
      <ConfirmDialog
        isOpen={!!scenarioToDelete}
        onClose={() => setScenarioToDelete(null)}
        onConfirm={() => {
          if (scenarioToDelete) {
            deleteScenario(scenarioToDelete.id);
            setScenarioToDelete(null);
          }
        }}
        title="Discard Scenario"
        message={`Are you sure you want to remove "${scenarioToDelete?.name}" from your Scenario Lab?`}
        confirmText="Discard Scenario"
        danger={true}
      />
    </div>
  );
};
