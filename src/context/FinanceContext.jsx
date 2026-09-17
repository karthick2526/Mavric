import React, { createContext, useContext, useReducer, useEffect, useMemo, useCallback } from 'react';
import { financeApi } from '../services/api.js';
import { INITIAL_FINANCE } from '../services/mockData.js';
import { useToast } from './ToastContext.jsx';
import {
  calculateOverviewMetrics,
  calculatePulseScore,
  simulateScenario,
  generateForecastData
} from '../utils/calculations.js';

const FinanceContext = createContext(null);

const FINANCE_ACTIONS = {
  SET_DATA: 'SET_DATA',
  SET_LOADING: 'SET_LOADING',
  SET_SYNCING: 'SET_SYNCING',
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  UPDATE_TRANSACTION: 'UPDATE_TRANSACTION',
  DELETE_TRANSACTION: 'DELETE_TRANSACTION',
  ADD_GOAL: 'ADD_GOAL',
  UPDATE_GOAL: 'UPDATE_GOAL',
  DELETE_GOAL: 'DELETE_GOAL',
  UPDATE_GOAL_ALLOCATION: 'UPDATE_GOAL_ALLOCATION',
  TOGGLE_SUBSCRIPTION: 'TOGGLE_SUBSCRIPTION',
  ADD_SCENARIO: 'ADD_SCENARIO',
  DELETE_SCENARIO: 'DELETE_SCENARIO',
  SET_ACTIVE_SCENARIO: 'SET_ACTIVE_SCENARIO',
  APPLY_SCENARIO: 'APPLY_SCENARIO',
  CREATE_SNAPSHOT: 'CREATE_SNAPSHOT',
  DELETE_SNAPSHOT: 'DELETE_SNAPSHOT',
  MARK_NOTIFICATION_READ: 'MARK_NOTIFICATION_READ',
  MARK_ALL_NOTIFICATIONS_READ: 'MARK_ALL_NOTIFICATIONS_READ',
  UPDATE_INCOME: 'UPDATE_INCOME',
  RESET_SEED: 'RESET_SEED'
};

function financeReducer(state, action) {
  switch (action.type) {
    case FINANCE_ACTIONS.SET_DATA:
      return { ...state, finance: action.payload, loading: false };

    case FINANCE_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case FINANCE_ACTIONS.SET_SYNCING:
      return { ...state, isSyncing: action.payload };

    case FINANCE_ACTIONS.UPDATE_INCOME: {
      const updated = {
        ...state.finance,
        monthlyIncome: action.payload
      };
      return { ...state, finance: updated };
    }

    case FINANCE_ACTIONS.ADD_TRANSACTION: {
      const newTransactions = [action.payload, ...state.finance.transactions];
      return {
        ...state,
        finance: { ...state.finance, transactions: newTransactions }
      };
    }

    case FINANCE_ACTIONS.UPDATE_TRANSACTION: {
      const newTransactions = state.finance.transactions.map((t) =>
        t.id === action.payload.id ? { ...t, ...action.payload } : t
      );
      return {
        ...state,
        finance: { ...state.finance, transactions: newTransactions }
      };
    }

    case FINANCE_ACTIONS.DELETE_TRANSACTION: {
      const newTransactions = state.finance.transactions.filter((t) => t.id !== action.payload);
      return {
        ...state,
        finance: { ...state.finance, transactions: newTransactions }
      };
    }

    case FINANCE_ACTIONS.ADD_GOAL: {
      const newGoals = [...state.finance.goals, action.payload];
      return {
        ...state,
        finance: { ...state.finance, goals: newGoals }
      };
    }

    case FINANCE_ACTIONS.UPDATE_GOAL: {
      const newGoals = state.finance.goals.map((g) =>
        g.id === action.payload.id ? { ...g, ...action.payload } : g
      );
      return {
        ...state,
        finance: { ...state.finance, goals: newGoals }
      };
    }

    case FINANCE_ACTIONS.DELETE_GOAL: {
      const newGoals = state.finance.goals.filter((g) => g.id !== action.payload);
      return {
        ...state,
        finance: { ...state.finance, goals: newGoals }
      };
    }

    case FINANCE_ACTIONS.UPDATE_GOAL_ALLOCATION: {
      const { goalId, percent } = action.payload;
      const newGoals = state.finance.goals.map((g) =>
        g.id === goalId ? { ...g, allocationPercent: percent } : g
      );
      return {
        ...state,
        finance: { ...state.finance, goals: newGoals }
      };
    }

    case FINANCE_ACTIONS.TOGGLE_SUBSCRIPTION: {
      const newSubscriptions = state.finance.recurringExpenses.map((r) =>
        r.id === action.payload ? { ...r, active: !r.active } : r
      );
      return {
        ...state,
        finance: { ...state.finance, recurringExpenses: newSubscriptions }
      };
    }

    case FINANCE_ACTIONS.ADD_SCENARIO: {
      const newScenarios = [action.payload, ...state.finance.scenarios];
      return {
        ...state,
        finance: { ...state.finance, scenarios: newScenarios },
        activeScenario: action.payload
      };
    }

    case FINANCE_ACTIONS.DELETE_SCENARIO: {
      const newScenarios = state.finance.scenarios.filter((s) => s.id !== action.payload);
      const activeScenario = state.activeScenario?.id === action.payload ? null : state.activeScenario;
      return {
        ...state,
        finance: { ...state.finance, scenarios: newScenarios },
        activeScenario
      };
    }

    case FINANCE_ACTIONS.SET_ACTIVE_SCENARIO:
      return { ...state, activeScenario: action.payload };

    case FINANCE_ACTIONS.APPLY_SCENARIO: {
      const scenario = action.payload;
      // Mutates monthly income / recurring based on scenario permanently
      const updatedIncome = state.finance.monthlyIncome + (Number(scenario.salaryChange) || 0);
      let newTransactions = [...state.finance.transactions];
      if (scenario.oneTimeExpense > 0) {
        newTransactions.unshift({
          id: `t-scen-${Date.now()}`,
          date: new Date().toISOString().split('T')[0],
          description: `${scenario.name} (Applied Scenario)`,
          category: 'Lifestyle',
          type: 'expense',
          amount: Number(scenario.oneTimeExpense),
          notes: `Applied from Scenario Lab: ${scenario.description || ''}`
        });
      }
      return {
        ...state,
        finance: {
          ...state.finance,
          monthlyIncome: updatedIncome,
          transactions: newTransactions
        },
        activeScenario: null
      };
    }

    case FINANCE_ACTIONS.CREATE_SNAPSHOT: {
      const newSnapshots = [action.payload, ...state.finance.snapshots];
      return {
        ...state,
        finance: { ...state.finance, snapshots: newSnapshots }
      };
    }

    case FINANCE_ACTIONS.DELETE_SNAPSHOT: {
      const newSnapshots = state.finance.snapshots.filter((s) => s.id !== action.payload);
      return {
        ...state,
        finance: { ...state.finance, snapshots: newSnapshots }
      };
    }

    case FINANCE_ACTIONS.MARK_NOTIFICATION_READ: {
      const newNotifications = state.finance.notifications.map((n) =>
        n.id === action.payload ? { ...n, read: true } : n
      );
      return {
        ...state,
        finance: { ...state.finance, notifications: newNotifications }
      };
    }

    case FINANCE_ACTIONS.MARK_ALL_NOTIFICATIONS_READ: {
      const newNotifications = state.finance.notifications.map((n) => ({ ...n, read: true }));
      return {
        ...state,
        finance: { ...state.finance, notifications: newNotifications }
      };
    }

    case FINANCE_ACTIONS.RESET_SEED:
      return {
        ...state,
        finance: INITIAL_FINANCE,
        activeScenario: null
      };

    default:
      return state;
  }
}

export const FinanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(financeReducer, {
    finance: INITIAL_FINANCE,
    loading: true,
    isSyncing: false,
    activeScenario: INITIAL_FINANCE.scenarios[0] || null
  });

  const { showToast } = useToast();

  // Load finance record from MockAPI on mount
  useEffect(() => {
    let isMounted = true;
    const fetchFinance = async () => {
      dispatch({ type: FINANCE_ACTIONS.SET_LOADING, payload: true });
      try {
        const res = await financeApi.getFinance('1');
        if (isMounted && res?.data) {
          dispatch({ type: FINANCE_ACTIONS.SET_DATA, payload: res.data });
        }
      } catch (err) {
        console.warn('Finance fetch fallback:', err);
      } finally {
        if (isMounted) {
          dispatch({ type: FINANCE_ACTIONS.SET_LOADING, payload: false });
        }
      }
    };
    fetchFinance();
    return () => { isMounted = false; };
  }, []);

  // Helper to persist finance data to MockAPI
  const syncToApi = useCallback(async (updatedFinance) => {
    dispatch({ type: FINANCE_ACTIONS.SET_SYNCING, payload: true });
    try {
      await financeApi.updateFinance('1', updatedFinance);
    } catch (err) {
      console.warn('API sync warning:', err);
      showToast({
        title: 'API Sync Warning',
        message: 'Could not sync latest change to remote MockAPI. Local copy preserved.',
        type: 'warning',
        action: { label: 'Retry', onClick: () => syncToApi(updatedFinance) }
      });
    } finally {
      dispatch({ type: FINANCE_ACTIONS.SET_SYNCING, payload: false });
    }
  }, [showToast]);

  // Derived metrics via useMemo
  const overviewMetrics = useMemo(() => {
    return calculateOverviewMetrics(state.finance);
  }, [state.finance]);

  const pulseScore = useMemo(() => {
    return calculatePulseScore(state.finance);
  }, [state.finance]);

  // Live Scenario Simulation
  const liveScenarioSimulation = useMemo(() => {
    if (!state.activeScenario) return null;
    return simulateScenario(overviewMetrics, state.activeScenario);
  }, [overviewMetrics, state.activeScenario]);

  // Actions
  const addTransaction = useCallback((transactionData) => {
    const newTx = {
      id: `t-${Date.now()}`,
      date: transactionData.date || new Date().toISOString().split('T')[0],
      description: transactionData.description,
      category: transactionData.category || 'Lifestyle',
      type: transactionData.type || 'expense',
      amount: Number(transactionData.amount) || 0,
      notes: transactionData.notes || ''
    };
    dispatch({ type: FINANCE_ACTIONS.ADD_TRANSACTION, payload: newTx });
    const updated = {
      ...state.finance,
      transactions: [newTx, ...state.finance.transactions]
    };
    syncToApi(updated);
    showToast({
      title: 'Transaction Saved',
      message: `${newTx.description} (${newTx.type === 'income' ? '+' : '-'}₹${newTx.amount}) recorded in ledger.`,
      type: 'success'
    });
  }, [state.finance, syncToApi, showToast]);

  const updateTransaction = useCallback((updatedTx) => {
    dispatch({ type: FINANCE_ACTIONS.UPDATE_TRANSACTION, payload: updatedTx });
    const updatedList = state.finance.transactions.map((t) =>
      t.id === updatedTx.id ? { ...t, ...updatedTx } : t
    );
    const updated = { ...state.finance, transactions: updatedList };
    syncToApi(updated);
    showToast({
      title: 'Transaction Updated',
      message: `${updatedTx.description} changes saved.`,
      type: 'success'
    });
  }, [state.finance, syncToApi, showToast]);

  const deleteTransaction = useCallback((id) => {
    const target = state.finance.transactions.find((t) => t.id === id);
    dispatch({ type: FINANCE_ACTIONS.DELETE_TRANSACTION, payload: id });
    const updatedList = state.finance.transactions.filter((t) => t.id !== id);
    const updated = { ...state.finance, transactions: updatedList };
    syncToApi(updated);
    showToast({
      title: 'Transaction Deleted',
      message: `${target?.description || 'Transaction'} removed from ledger.`,
      type: 'info'
    });
  }, [state.finance, syncToApi, showToast]);

  const addGoal = useCallback((goalData) => {
    const newGoal = {
      id: `g-${Date.now()}`,
      title: goalData.title,
      currentAmount: Number(goalData.currentAmount) || 0,
      targetAmount: Number(goalData.targetAmount) || 10000,
      monthlyContribution: Number(goalData.monthlyContribution) || 1000,
      targetDate: goalData.targetDate || '2027-12-31',
      priority: (state.finance.goals.length + 1),
      allocationPercent: goalData.allocationPercent || 20,
      category: goalData.category || 'Savings'
    };
    dispatch({ type: FINANCE_ACTIONS.ADD_GOAL, payload: newGoal });
    const updated = { ...state.finance, goals: [...state.finance.goals, newGoal] };
    syncToApi(updated);
    showToast({
      title: 'Goal Created',
      message: `Target for ${newGoal.title} added to your financial plan.`,
      type: 'success'
    });
  }, [state.finance, syncToApi, showToast]);

  const updateGoal = useCallback((updatedGoal) => {
    dispatch({ type: FINANCE_ACTIONS.UPDATE_GOAL, payload: updatedGoal });
    const updatedGoals = state.finance.goals.map((g) =>
      g.id === updatedGoal.id ? { ...g, ...updatedGoal } : g
    );
    const updated = { ...state.finance, goals: updatedGoals };
    syncToApi(updated);
    showToast({
      title: 'Goal Updated',
      message: `${updatedGoal.title} progress updated.`,
      type: 'success'
    });
  }, [state.finance, syncToApi, showToast]);

  const deleteGoal = useCallback((id) => {
    const target = state.finance.goals.find((g) => g.id === id);
    dispatch({ type: FINANCE_ACTIONS.DELETE_GOAL, payload: id });
    const updatedGoals = state.finance.goals.filter((g) => g.id !== id);
    const updated = { ...state.finance, goals: updatedGoals };
    syncToApi(updated);
    showToast({
      title: 'Goal Removed',
      message: `${target?.title || 'Goal'} has been deleted.`,
      type: 'info'
    });
  }, [state.finance, syncToApi, showToast]);

  const updateGoalAllocation = useCallback((goalId, percent) => {
    dispatch({ type: FINANCE_ACTIONS.UPDATE_GOAL_ALLOCATION, payload: { goalId, percent } });
  }, []);

  const toggleSubscription = useCallback((id) => {
    const target = state.finance.recurringExpenses.find((r) => r.id === id);
    dispatch({ type: FINANCE_ACTIONS.TOGGLE_SUBSCRIPTION, payload: id });
    const updatedList = state.finance.recurringExpenses.map((r) =>
      r.id === id ? { ...r, active: !r.active } : r
    );
    const updated = { ...state.finance, recurringExpenses: updatedList };
    syncToApi(updated);
    showToast({
      title: target?.active ? 'Subscription Paused' : 'Subscription Restored',
      message: `${target?.name} ${target?.active ? 'paused' : 'reactivated'} in stream.`,
      type: 'info'
    });
  }, [state.finance, syncToApi, showToast]);

  const addScenario = useCallback((scenarioData) => {
    const newScenario = {
      id: `s-${Date.now()}`,
      name: scenarioData.name || 'New Scenario',
      description: scenarioData.description || '',
      salaryChange: Number(scenarioData.salaryChange) || 0,
      rentChange: Number(scenarioData.rentChange) || 0,
      oneTimeExpense: Number(scenarioData.oneTimeExpense) || 0,
      monthlyExpenseChange: Number(scenarioData.monthlyExpenseChange) || 0,
      durationMonths: Number(scenarioData.durationMonths) || 6,
      status: 'simulated',
      createdAt: new Date().toISOString().split('T')[0]
    };
    dispatch({ type: FINANCE_ACTIONS.ADD_SCENARIO, payload: newScenario });
    const updated = { ...state.finance, scenarios: [newScenario, ...state.finance.scenarios] };
    syncToApi(updated);
    showToast({
      title: 'Scenario Saved',
      message: `${newScenario.name} added to Scenario Lab.`,
      type: 'success'
    });
  }, [state.finance, syncToApi, showToast]);

  const deleteScenario = useCallback((id) => {
    const target = state.finance.scenarios.find((s) => s.id === id);
    dispatch({ type: FINANCE_ACTIONS.DELETE_SCENARIO, payload: id });
    const updated = {
      ...state.finance,
      scenarios: state.finance.scenarios.filter((s) => s.id !== id)
    };
    syncToApi(updated);
    showToast({
      title: 'Scenario Discarded',
      message: `${target?.name || 'Scenario'} removed from lab.`,
      type: 'info'
    });
  }, [state.finance, syncToApi, showToast]);

  const setActiveScenario = useCallback((scenario) => {
    dispatch({ type: FINANCE_ACTIONS.SET_ACTIVE_SCENARIO, payload: scenario });
  }, []);

  const applyScenario = useCallback((scenario) => {
    dispatch({ type: FINANCE_ACTIONS.APPLY_SCENARIO, payload: scenario });
    const updatedIncome = state.finance.monthlyIncome + (Number(scenario.salaryChange) || 0);
    let updatedTx = [...state.finance.transactions];
    if (scenario.oneTimeExpense > 0) {
      updatedTx.unshift({
        id: `t-scen-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        description: `${scenario.name} (Applied Scenario)`,
        category: 'Lifestyle',
        type: 'expense',
        amount: Number(scenario.oneTimeExpense),
        notes: `Applied from Scenario Lab: ${scenario.description || ''}`
      });
    }
    const updated = {
      ...state.finance,
      monthlyIncome: updatedIncome,
      transactions: updatedTx
    };
    syncToApi(updated);
    showToast({
      title: 'Scenario Applied',
      message: `${scenario.name} has been merged into your active financial ledger!`,
      type: 'success'
    });
  }, [state.finance, syncToApi, showToast]);

  const saveSnapshot = useCallback((name, notes = '') => {
    const metrics = calculateOverviewMetrics(state.finance);
    const newSnapshot = {
      id: `snap-${Date.now()}`,
      name: name || `Snapshot ${new Date().toLocaleDateString()}`,
      date: new Date().toISOString().split('T')[0],
      income: metrics.monthlyIncome,
      expenses: metrics.monthlyExpenses,
      savings: metrics.availableCushion,
      notes: notes || 'Manual time capsule snapshot of current plan.'
    };
    dispatch({ type: FINANCE_ACTIONS.CREATE_SNAPSHOT, payload: newSnapshot });
    const updated = { ...state.finance, snapshots: [newSnapshot, ...state.finance.snapshots] };
    syncToApi(updated);
    showToast({
      title: 'Snapshot Created',
      message: `"${newSnapshot.name}" captured in Financial Time Capsule.`,
      type: 'success'
    });
  }, [state.finance, syncToApi, showToast]);

  const deleteSnapshot = useCallback((id) => {
    dispatch({ type: FINANCE_ACTIONS.DELETE_SNAPSHOT, payload: id });
    const updated = {
      ...state.finance,
      snapshots: state.finance.snapshots.filter((s) => s.id !== id)
    };
    syncToApi(updated);
    showToast({
      title: 'Snapshot Deleted',
      message: 'Historical capsule removed.',
      type: 'info'
    });
  }, [state.finance, syncToApi, showToast]);

  const markNotificationRead = useCallback((id) => {
    dispatch({ type: FINANCE_ACTIONS.MARK_NOTIFICATION_READ, payload: id });
    const updated = {
      ...state.finance,
      notifications: state.finance.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    };
    syncToApi(updated);
  }, [state.finance, syncToApi]);

  const markAllNotificationsRead = useCallback(() => {
    dispatch({ type: FINANCE_ACTIONS.MARK_ALL_NOTIFICATIONS_READ });
    const updated = {
      ...state.finance,
      notifications: state.finance.notifications.map((n) => ({ ...n, read: true }))
    };
    syncToApi(updated);
    showToast({
      title: 'Notifications Cleared',
      message: 'All notifications marked as read.',
      type: 'info'
    });
  }, [state.finance, syncToApi, showToast]);

  const resetSeedData = useCallback(async () => {
    await financeApi.resetSeedData();
    dispatch({ type: FINANCE_ACTIONS.RESET_SEED });
    showToast({
      title: 'Reset to Seed Data',
      message: 'Initial Karthick portfolio profile and finance records restored.',
      type: 'success'
    });
  }, [showToast]);

  return (
    <FinanceContext.Provider
      value={{
        finance: state.finance,
        loading: state.loading,
        isSyncing: state.isSyncing,
        activeScenario: state.activeScenario,
        overviewMetrics,
        pulseScore,
        liveScenarioSimulation,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addGoal,
        updateGoal,
        deleteGoal,
        updateGoalAllocation,
        toggleSubscription,
        addScenario,
        deleteScenario,
        setActiveScenario,
        applyScenario,
        saveSnapshot,
        deleteSnapshot,
        markNotificationRead,
        markAllNotificationsRead,
        resetSeedData
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

// Custom hooks specified in Page 10 & 11:
// useFinance, useScenario, useForecast, useGoals, useInsights

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within FinanceProvider');
  return context;
};

export const useScenario = () => {
  const {
    finance,
    activeScenario,
    overviewMetrics,
    liveScenarioSimulation,
    addScenario,
    deleteScenario,
    setActiveScenario,
    applyScenario
  } = useFinance();

  return {
    scenarios: finance?.scenarios || [],
    activeScenario,
    overviewMetrics,
    simulation: liveScenarioSimulation,
    addScenario,
    deleteScenario,
    setActiveScenario,
    applyScenario
  };
};

export const useForecast = (range = 6) => {
  const { finance } = useFinance();
  const forecastData = useMemo(() => {
    return generateForecastData(finance, range);
  }, [finance, range]);

  return {
    forecastData
  };
};

export const useGoals = () => {
  const { finance, overviewMetrics, addGoal, updateGoal, deleteGoal, updateGoalAllocation } = useFinance();
  return {
    goals: finance?.goals || [],
    totalGoalContribution: overviewMetrics.totalGoalContribution,
    isGoalCollision: overviewMetrics.totalGoalContribution > overviewMetrics.availableCushion,
    addGoal,
    updateGoal,
    deleteGoal,
    updateGoalAllocation
  };
};

export const useInsights = () => {
  const { finance, overviewMetrics, pulseScore } = useFinance();

  const insightsList = useMemo(() => {
    const list = [];
    const fixedRatio = Math.round((overviewMetrics.monthlyExpenses / (overviewMetrics.monthlyIncome || 1)) * 100);

    // 1. Fixed Cost Pressure
    list.push({
      id: 'ins-fixed',
      title: 'Fixed Cost Pressure',
      badge: fixedRatio > 65 ? 'High' : 'Optimal',
      badgeType: fixedRatio > 65 ? 'warning' : 'success',
      summary: `${fixedRatio}% of your monthly income goes toward fixed expenses and living costs.`,
      why: 'Rent (₹12,000) and essential utilities consume the primary portion of monthly cash inflow. Maintaining non-discretionary costs below 60% provides headroom for unexpected volatility.',
      recommendation: fixedRatio > 60
        ? 'Target reducing flexible lifestyle spending by 10% to build a wider cushion.'
        : 'Your fixed cost baseline is resilient.'
    });

    // 2. Goal Pressure & Collision
    const isGoalCollision = overviewMetrics.totalGoalContribution > overviewMetrics.availableCushion;
    list.push({
      id: 'ins-goals',
      title: 'Goal Pressure & Allocation',
      badge: isGoalCollision ? 'Collision Alert' : 'Funded',
      badgeType: isGoalCollision ? 'danger' : 'success',
      summary: isGoalCollision
        ? `Your active goals require ₹${overviewMetrics.totalGoalContribution.toLocaleString()}/month while monthly cushion is ₹${overviewMetrics.availableCushion.toLocaleString()}.`
        : `Monthly goal commitments (₹${overviewMetrics.totalGoalContribution.toLocaleString()}) are fully supported by your available cushion (₹${overviewMetrics.availableCushion.toLocaleString()}).`,
      why: 'When monthly targets exceed available cash cushion, either goals will fall behind schedule or liquid reserves will decrease.',
      recommendation: isGoalCollision
        ? 'Extend target dates on secondary goals or adjust monthly allocations in the Goal Priority Simulator.'
        : 'Consider accelerating Emergency Fund target by allocating surplus cushion.'
    });

    // 3. Subscription Leakage
    const cancelable = overviewMetrics.cancelableSavingsMonthly;
    list.push({
      id: 'ins-subs',
      title: 'Subscription Leakage',
      badge: cancelable > 1500 ? 'Review' : 'Lean',
      badgeType: cancelable > 1500 ? 'warning' : 'info',
      summary: `You spend ₹${overviewMetrics.activeRecurringMonthly.toLocaleString()}/month on recurring services (₹${overviewMetrics.activeRecurringAnnual.toLocaleString()}/yr).`,
      why: 'Entertainment and non-essential apps represent persistent passive drag on savings velocity if left unreviewed.',
      recommendation: `Cancelling non-essential media subscriptions could save ₹${cancelable.toLocaleString()}/month (₹${(cancelable * 12).toLocaleString()}/year) instantly.`
    });

    // 4. Financial Weather & Pulse
    list.push({
      id: 'ins-pulse',
      title: 'Financial Pulse Diagnostics',
      badge: `${pulseScore.score}/100`,
      badgeType: pulseScore.badgeColor === 'emerald' ? 'success' : 'warning',
      summary: pulseScore.statusDetail,
      why: 'The Mavric Pulse score dynamically weights cushion ratio, emergency runway, goal collision risk, and recurring cost ratios.',
      recommendation: 'Keep cushion ratio above 25% of gross monthly income to maintain resilient buffer status.'
    });

    return list;
  }, [overviewMetrics, pulseScore]);

  return {
    insights: insightsList,
    pulseScore,
    overviewMetrics
  };
};
