import React, { useState } from 'react';
import {
  History,
  Plus,
  RotateCcw,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useFinance } from '../context/FinanceContext.jsx';
import { formatCurrency } from '../utils/calculations.js';
import { Modal } from '../components/ui/Modal.jsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.jsx';

export const SnapshotsPage = () => {
  const { user } = useAuth();
  const {
    finance,
    overviewMetrics,
    pulseScore,
    saveSnapshot,
    restoreSnapshot,
    deleteSnapshot
  } = useFinance();

  const snapshots = finance?.snapshots || [];

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [snapshotName, setSnapshotName] = useState('');
  const [snapshotNotes, setSnapshotNotes] = useState('');
  const [snapshotToRestore, setSnapshotToRestore] = useState(null);
  const [snapshotToDelete, setSnapshotToDelete] = useState(null);

  const handleCreate = (e) => {
    e.preventDefault();
    saveSnapshot(
      snapshotName || `Snapshot ${new Date().toLocaleDateString()}`,
      snapshotNotes
    );
    setIsCreateOpen(false);
    setSnapshotName('');
    setSnapshotNotes('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#2D2F2A]">
        <div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#F1E8D7] tracking-tight">
            Financial Snapshots & Time Machine
          </h2>
          <p className="text-xs text-[#F1E8D7]/60 mt-1">
            Capture exact historical checkpoints of your ledger, metrics, and goals
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#69745B] hover:bg-[#58624c] text-white text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-lg shadow-[#69745B]/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Save Current State</span>
        </button>
      </div>

      {/* Snapshot List Grid */}
      <div className="space-y-4">
        {snapshots.length === 0 ? (
          <div className="p-12 rounded-3xl bg-[#20221D] border border-[#2D2F2A] text-center text-[#F1E8D7]/50">
            No snapshots recorded yet. Capture your first state checkpoint above.
          </div>
        ) : (
          snapshots.map((snap) => (
            <div
              key={snap.id}
              className="p-6 rounded-2xl bg-[#20221D] border border-[#2D2F2A] hover:border-[#C4A16A]/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-[#C4A16A] shrink-0">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg text-[#F1E8D7] font-semibold">{snap.name}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#191A17] text-[#F1E8D7]/60 font-mono">
                      {snap.date}
                    </span>
                  </div>
                  {snap.notes && (
                    <p className="text-xs text-[#F1E8D7]/60 mt-1">{snap.notes}</p>
                  )}

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs font-mono">
                    <span className="text-[#69745B]">
                      Income: {formatCurrency(snap.overview?.monthlyIncome || 0, user?.currency)}
                    </span>
                    <span className="text-[#C9704C]">
                      Expenses: {formatCurrency(snap.overview?.monthlyExpenses || 0, user?.currency)}
                    </span>
                    <span className="text-[#C4A16A] font-bold">
                      Cushion: {formatCurrency(snap.overview?.availableCushion || 0, user?.currency)}
                    </span>
                    <span className="text-[#F1E8D7]/60">
                      Pulse: {snap.overview?.pulseScore || 78}/100
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-auto">
                <button
                  type="button"
                  onClick={() => setSnapshotToRestore(snap)}
                  className="px-4 py-2 rounded-xl bg-[#191A17] hover:bg-[#282B24] border border-[#2D2F2A] hover:border-[#C4A16A] text-xs font-semibold text-[#F1E8D7] flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#C4A16A]" />
                  <span>Restore Checkpoint</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSnapshotToDelete(snap)}
                  className="p-2 rounded-xl bg-[#191A17] hover:bg-[#C9704C]/20 border border-[#2D2F2A] text-[#F1E8D7]/40 hover:text-[#C9704C] transition-colors cursor-pointer"
                  title="Delete snapshot"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Save Snapshot Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Capture Financial Snapshot"
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#F1E8D7]/75 mb-1.5">
              Snapshot Name / Title
            </label>
            <input
              type="text"
              required
              value={snapshotName}
              onChange={(e) => setSnapshotName(e.target.value)}
              placeholder="e.g., Q3 Baseline Before Car Loan"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-xs text-[#F1E8D7] focus:outline-none focus:border-[#C4A16A]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#F1E8D7]/75 mb-1.5">
              Checkpoint Notes & Context
            </label>
            <textarea
              rows={3}
              value={snapshotNotes}
              onChange={(e) => setSnapshotNotes(e.target.value)}
              placeholder="Why are you taking this snapshot? What assumptions are in place?"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-xs text-[#F1E8D7] focus:outline-none focus:border-[#C4A16A]"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-[#191A17] border border-[#2D2F2A] text-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#C4A16A] block">Current metrics to lock:</span>
            <div className="flex justify-between text-[#F1E8D7]/70 font-mono">
              <span>Income: {formatCurrency(overviewMetrics.monthlyIncome, user?.currency)}</span>
              <span>Expenses: {formatCurrency(overviewMetrics.monthlyExpenses, user?.currency)}</span>
              <span>Cushion: {formatCurrency(overviewMetrics.availableCushion, user?.currency)}</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#2D2F2A]">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-4 py-2 rounded-xl text-xs text-[#F1E8D7]/60 hover:text-[#F1E8D7]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#69745B] hover:bg-[#58624c] text-white text-xs font-semibold"
            >
              Save Snapshot
            </button>
          </div>
        </form>
      </Modal>

      {/* Restore Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!snapshotToRestore}
        onClose={() => setSnapshotToRestore(null)}
        onConfirm={() => {
          if (snapshotToRestore) {
            restoreSnapshot(snapshotToRestore);
            setSnapshotToRestore(null);
          }
        }}
        title="Restore Financial Snapshot"
        message={`Are you sure you want to restore "${snapshotToRestore?.name}"? This will overwrite your current ledger transactions and goals with the state recorded on ${snapshotToRestore?.date}.`}
        confirmText="Restore State"
        danger={true}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!snapshotToDelete}
        onClose={() => setSnapshotToDelete(null)}
        onConfirm={() => {
          if (snapshotToDelete) {
            deleteSnapshot(snapshotToDelete.id);
            setSnapshotToDelete(null);
          }
        }}
        title="Delete Snapshot"
        message={`Are you sure you want to permanently delete checkpoint "${snapshotToDelete?.name}"?`}
        confirmText="Delete"
        danger={true}
      />
    </div>
  );
};
