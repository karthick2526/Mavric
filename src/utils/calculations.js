/**
 * Financial Calculation Engine for Mavric
 * Powers derived metrics, Financial Pulse score, Scenario Lab,
 * Goal Collision Detection, Ripple Analysis, Forecast, and Weather strip.
 */

export const formatCurrency = (amount, currency = 'INR') => {
  const num = Number(amount) || 0;
  const isNegative = num < 0;
  const abs = Math.abs(num);

  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0
  }).format(abs);

  const symbol = currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';
  return `${isNegative ? '-' : ''}${symbol}${formatted}`;
};

/**
 * Calculates current month core metrics
 */
export const calculateOverviewMetrics = (finance) => {
  const monthlyIncome = Number(finance?.monthlyIncome) || 48500;

  // Total current expenses: sum of expenses from transactions in current month or fallback
  const expenseTransactions = (finance?.transactions || []).filter(t => t.type === 'expense');
  const totalExpenseTransactions = expenseTransactions.reduce((acc, t) => acc + (Number(t.amount) || 0), 0);

  // If transactions exist, use them; if only basic list, default to calibrated ₹31,800
  const monthlyExpenses = totalExpenseTransactions > 0 ? totalExpenseTransactions : 31800;
  const availableCushion = monthlyIncome - monthlyExpenses;
  const cushionPercent = monthlyIncome > 0 ? Math.round((availableCushion / monthlyIncome) * 100) : 0;

  // Active goals monthly contribution sum
  const activeGoals = finance?.goals || [];
  const totalGoalContribution = activeGoals.reduce((acc, g) => acc + (Number(g.monthlyContribution) || 0), 0);

  // Fixed recurring expenses sum
  const recurring = finance?.recurringExpenses || [];
  const activeRecurringMonthly = recurring.filter(r => r.active).reduce((acc, r) => acc + (Number(r.monthlyCost) || 0), 0);
  const activeRecurringAnnual = recurring.filter(r => r.active).reduce((acc, r) => acc + (Number(r.annualCost) || 0), 0);

  // Non-essential subscriptions that can be cancelled
  const cancelableSavingsMonthly = recurring
    .filter(r => r.active && !r.essential)
    .reduce((acc, r) => acc + (Number(r.monthlyCost) || 0), 0);

  return {
    monthlyIncome,
    monthlyExpenses,
    availableCushion,
    cushionPercent,
    totalGoalContribution,
    activeRecurringMonthly,
    activeRecurringAnnual,
    cancelableSavingsMonthly
  };
};

/**
 * Calculate Financial Pulse Score (0-100)
 */
export const calculatePulseScore = (finance) => {
  const { monthlyIncome, monthlyExpenses, availableCushion, totalGoalContribution } = calculateOverviewMetrics(finance);

  let score = 50;

  // Cushion factor (up to +25)
  const cushionRatio = availableCushion / (monthlyIncome || 1);
  if (cushionRatio >= 0.3) score += 25;
  else if (cushionRatio >= 0.15) score += 15;
  else if (cushionRatio > 0) score += 5;
  else score -= 20;

  // Goal Collision check (+15 or -15)
  const isGoalCollision = totalGoalContribution > availableCushion;
  if (!isGoalCollision && totalGoalContribution > 0) {
    score += 15;
  } else if (isGoalCollision) {
    score -= 15;
  }

  // Emergency Fund progress check (+10)
  const emergencyGoal = (finance?.goals || []).find(g => g.title.toLowerCase().includes('emergency'));
  if (emergencyGoal) {
    const efProgress = (emergencyGoal.currentAmount / emergencyGoal.targetAmount);
    if (efProgress >= 0.5) score += 10;
    else if (efProgress >= 0.25) score += 5;
  } else {
    score += 5;
  }

  // Fixed expense ratio check (+10 if fixed <= 50%)
  const fixedRatio = monthlyExpenses / (monthlyIncome || 1);
  if (fixedRatio <= 0.65) score += 10;
  else if (fixedRatio > 0.85) score -= 10;

  const finalScore = Math.min(100, Math.max(10, Math.round(score)));

  let status = 'Stable';
  let statusDetail = 'Your finances are on track';
  let badgeColor = 'emerald';

  if (finalScore >= 80) {
    status = 'Resilient';
    statusDetail = 'High monthly cushion and strong goal coverage';
    badgeColor = 'emerald';
  } else if (finalScore >= 65) {
    status = 'Stable';
    statusDetail = 'Your financial plan is stable this month';
    badgeColor = 'emerald';
  } else if (finalScore >= 50) {
    status = 'Moderate';
    statusDetail = 'Fair cash flow, monitor upcoming discretionary spend';
    badgeColor = 'amber';
  } else {
    status = 'Pressure';
    statusDetail = 'Tight cushion detected; review subscriptions and goals';
    badgeColor = 'rose';
  }

  return {
    score: finalScore,
    status,
    statusDetail,
    badgeColor,
    isGoalCollision
  };
};

/**
 * Simulate Scenario Impact
 */
export const simulateScenario = (baseMetrics, scenarioChanges) => {
  const {
    salaryChange = 0,
    rentChange = 0,
    oneTimeExpense = 0,
    monthlyExpenseChange = 0,
    durationMonths = 6
  } = scenarioChanges;

  const currentIncome = baseMetrics.monthlyIncome;
  const currentExpenses = baseMetrics.monthlyExpenses;
  const currentAvailable = baseMetrics.availableCushion;

  // New monthly values during the active duration
  const scenarioIncome = currentIncome + Number(salaryChange);
  const scenarioExpenses = currentExpenses + Number(rentChange) + Number(monthlyExpenseChange) + Math.round(Number(oneTimeExpense) / (Number(durationMonths) || 1));
  const scenarioAvailable = scenarioIncome - scenarioExpenses;

  const cushionDelta = scenarioAvailable - currentAvailable;
  const cushionDeltaPercent = currentAvailable !== 0 ? Math.round((cushionDelta / Math.abs(currentAvailable)) * 100) : 0;

  // Goal delay estimate based on reduction in cushion
  let goalDelayMonths = 0;
  if (cushionDelta < 0) {
    const deficitMonthly = Math.abs(cushionDelta);
    goalDelayMonths = Math.min(12, Math.max(1, Math.round((Number(oneTimeExpense) + (deficitMonthly * durationMonths)) / (baseMetrics.totalGoalContribution || 5000))));
  }

  // Risk calculation
  let riskLevel = 'Low';
  let riskColor = 'emerald';
  if (scenarioAvailable < 0) {
    riskLevel = 'High (Deficit)';
    riskColor = 'rose';
  } else if (scenarioAvailable < baseMetrics.totalGoalContribution) {
    riskLevel = 'Medium - High';
    riskColor = 'amber';
  } else if (cushionDeltaPercent < -25) {
    riskLevel = 'Medium';
    riskColor = 'amber';
  }

  return {
    currentPlan: {
      income: currentIncome,
      expenses: currentExpenses,
      available: currentAvailable
    },
    scenarioPlan: {
      income: scenarioIncome,
      expenses: scenarioExpenses,
      available: scenarioAvailable
    },
    cushionDelta,
    cushionDeltaPercent,
    goalDelayMonths,
    riskLevel,
    riskColor
  };
};

/**
 * Generate 6M, 12M, or 24M Forecast timeline data
 */
export const generateForecastData = (finance, monthsCount = 6) => {
  const { monthlyIncome, monthlyExpenses } = calculateOverviewMetrics(finance);
  const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  const years = ['2026', '2026', '2026', '2026', '2027', '2027', '2027', '2027', '2027', '2027', '2027', '2027'];

  // Upcoming scheduled markers
  const eventMarkers = {
    'Nov 2026': { title: 'Festival Bonus', amount: 15000, type: 'income', icon: 'gift' },
    'Dec 2026': { title: 'Insurance Premium', amount: 8500, type: 'expense', icon: 'shield' },
    'Jan 2027': { title: 'Laptop Purchase', amount: 50100, type: 'expense', icon: 'laptop' },
    'Apr 2027': { title: 'Annual Appraisal Hike', amount: 7500, type: 'income', icon: 'trending-up' }
  };

  const timeline = [];
  let cumulativeSavings = 32000; // emergency fund initial

  for (let i = 0; i < monthsCount; i++) {
    const monthName = months[i % months.length];
    const year = i < 4 ? '2026' : '2027';
    const monthKey = `${monthName} ${year}`;
    const marker = eventMarkers[monthKey];

    let income = monthlyIncome;
    let expenses = monthlyExpenses;

    if (marker) {
      if (marker.type === 'income') income += marker.amount;
      if (marker.type === 'expense') expenses += marker.amount;
    }

    const available = income - expenses;
    cumulativeSavings += available;

    // Financial Weather calculation
    let weather = 'green';
    let weatherReason = 'Healthy cash cushion > 30% of income.';
    if (available < 0) {
      weather = 'red';
      weatherReason = `Deficit of ${formatCurrency(Math.abs(available))} due to ${marker ? marker.title : 'high expenses'}.`;
    } else if (available < monthlyIncome * 0.15) {
      weather = 'yellow';
      weatherReason = `Cushion reduced to ${formatCurrency(available)} due to ${marker ? marker.title : 'seasonal costs'}.`;
    }

    timeline.push({
      id: `f-${i}`,
      month: monthName,
      year,
      monthKey,
      income,
      expenses,
      available,
      cumulativeSavings,
      weather,
      weatherReason,
      marker: marker || null,
      risk: available < 0 ? 'High' : available < 5000 ? 'Medium' : 'Low'
    });
  }

  return timeline;
};

/**
 * Can I Afford This? (Cash vs EMI / Installment scenario comparator)
 */
export const calculateAffordability = (itemPrice, finance, emiMonths = 6, emiInterestRate = 0.12) => {
  const { availableCushion, totalGoalContribution } = calculateOverviewMetrics(finance);
  const price = Number(itemPrice) || 0;

  // Cash scenario
  const cashRemainingCushion = availableCushion - price;
  const cashAffordable = price <= (finance?.goals?.[0]?.currentAmount || 32000) + availableCushion;

  // Installment (EMI) scenario: P * r * (1+r)^n / ((1+r)^n - 1)
  const monthlyRate = emiInterestRate / 12;
  const emiMonthly = monthlyRate > 0
    ? Math.round((price * monthlyRate * Math.pow(1 + monthlyRate, emiMonths)) / (Math.pow(1 + monthlyRate, emiMonths) - 1))
    : Math.round(price / emiMonths);

  const emiRemainingCushion = availableCushion - emiMonthly;
  const emiCollidesWithGoals = emiMonthly > (availableCushion - totalGoalContribution);
  const emiAffordable = emiRemainingCushion >= 0;

  return {
    price,
    cash: {
      immediateCost: price,
      affordable: cashAffordable,
      impactNote: cashRemainingCushion < 0 ? 'Requires dipping into liquid emergency savings.' : 'Can be covered cleanly within existing cash cushion.'
    },
    emi: {
      months: emiMonths,
      monthlyCost: emiMonthly,
      totalPaid: emiMonthly * emiMonths,
      interestCost: (emiMonthly * emiMonths) - price,
      affordable: emiAffordable,
      collidesWithGoals: emiCollidesWithGoals,
      impactNote: emiCollidesWithGoals
        ? `Consumes ${formatCurrency(emiMonthly)}/month, reducing monthly goal contributions by ~${Math.round((emiMonthly / (totalGoalContribution || 1)) * 100)}%.`
        : `Comfortably fits within remaining monthly cushion of ${formatCurrency(emiRemainingCushion)}.`
    }
  };
};
