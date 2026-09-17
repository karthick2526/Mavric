/**
 * Default Seed Data for Mavric Personal Finance
 * Aligned with PDF Specification (Karthick / INR currency / MockAPI resources)
 */

export const INITIAL_USER = {
  id: '1',
  name: 'Karthick',
  email: 'karthick@mavric.demo',
  password: 'karthick123',
  role: 'Primary Planner',
  currency: 'INR',
  currencySymbol: '₹',
  phone: '+91 98765 43210',
  bio: 'A passionate learner and developer managing long-term wealth and scenario simulations.',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  createdAt: '2026-01-01T00:00:00.000Z'
};

export const INITIAL_FINANCE = {
  id: '1',
  userId: '1',
  monthlyIncome: 48500,
  transactions: [
    {
      id: 't-1',
      date: '2026-09-01',
      description: 'Salary',
      category: 'Salary',
      type: 'income',
      amount: 48500,
      notes: 'Monthly engineering compensation credited to primary bank account'
    },
    {
      id: 't-2',
      date: '2026-09-02',
      description: 'Rent',
      category: 'Housing',
      type: 'expense',
      amount: 12000,
      notes: 'Apartment monthly rent transfer to landlord'
    },
    {
      id: 't-3',
      date: '2026-09-05',
      description: 'Groceries',
      category: 'Food',
      type: 'expense',
      amount: 2450,
      notes: 'Whole Foods organic essentials and pantry staples'
    },
    {
      id: 't-4',
      date: '2026-09-07',
      description: 'Internet',
      category: 'Utilities',
      type: 'expense',
      amount: 999,
      notes: 'High-speed fiber optic connection'
    },
    {
      id: 't-5',
      date: '2026-09-10',
      description: 'Transport',
      category: 'Travel',
      type: 'expense',
      amount: 3200,
      notes: 'Metro passes and ride-share expenses'
    },
    {
      id: 't-6',
      date: '2026-09-12',
      description: 'Gym',
      category: 'Health',
      type: 'expense',
      amount: 1500,
      notes: 'Monthly fitness center membership'
    },
    {
      id: 't-7',
      date: '2026-09-15',
      description: 'Coffee & Snacks',
      category: 'Lifestyle',
      type: 'expense',
      amount: 580,
      notes: 'Specialty pour-overs and weekend artisan bakery'
    },
    {
      id: 't-8',
      date: '2026-09-18',
      description: 'Netflix & Spotify',
      category: 'Subscriptions',
      type: 'expense',
      amount: 768,
      notes: 'Premium streaming media bundle'
    }
  ],
  goals: [
    {
      id: 'g-1',
      title: 'Emergency Fund',
      currentAmount: 32000,
      targetAmount: 75000,
      monthlyContribution: 9500,
      targetDate: '2027-05-15',
      priority: 1,
      allocationPercent: 40,
      category: 'Security'
    },
    {
      id: 'g-2',
      title: 'New Laptop',
      currentAmount: 15000,
      targetAmount: 70000,
      monthlyContribution: 3000,
      targetDate: '2027-10-30',
      priority: 2,
      allocationPercent: 35,
      category: 'Work'
    },
    {
      id: 'g-3',
      title: 'Trip Fund',
      currentAmount: 22500,
      targetAmount: 50000,
      monthlyContribution: 2500,
      targetDate: '2027-06-20',
      priority: 3,
      allocationPercent: 25,
      category: 'Travel'
    }
  ],
  recurringExpenses: [
    {
      id: 'r-1',
      name: 'Netflix',
      category: 'Entertainment',
      monthlyCost: 649,
      annualCost: 7788,
      active: true,
      essential: false
    },
    {
      id: 'r-2',
      name: 'Spotify',
      category: 'Entertainment',
      monthlyCost: 119,
      annualCost: 1428,
      active: true,
      essential: false
    },
    {
      id: 'r-3',
      name: 'Cloud Storage',
      category: 'Utilities',
      monthlyCost: 130,
      annualCost: 1560,
      active: true,
      essential: true
    },
    {
      id: 'r-4',
      name: 'Gym',
      category: 'Health',
      monthlyCost: 1500,
      annualCost: 18000,
      active: true,
      essential: false
    },
    {
      id: 'r-5',
      name: 'Broadband',
      category: 'Utilities',
      monthlyCost: 999,
      annualCost: 11988,
      active: true,
      essential: true
    }
  ],
  scenarios: [
    {
      id: 's-1',
      name: 'Laptop Purchase',
      description: 'Buy a new laptop for work & personal use',
      salaryChange: 0,
      rentChange: 0,
      oneTimeExpense: 50100,
      monthlyExpenseChange: 0,
      durationMonths: 6,
      status: 'simulated',
      createdAt: '2026-09-10'
    },
    {
      id: 's-2',
      name: 'Salary Hike +15%',
      description: 'Annual appraisal promotion starting in Q4',
      salaryChange: 7275,
      rentChange: 0,
      oneTimeExpense: 0,
      monthlyExpenseChange: 1500,
      durationMonths: 12,
      status: 'simulated',
      createdAt: '2026-09-12'
    },
    {
      id: 's-3',
      name: 'Rent Hike Shock',
      description: 'Landlord increases flat rent by +20%',
      salaryChange: 0,
      rentChange: 2400,
      oneTimeExpense: 0,
      monthlyExpenseChange: 0,
      durationMonths: 12,
      status: 'stress_test',
      createdAt: '2026-09-14'
    }
  ],
  snapshots: [
    {
      id: 'snap-1',
      name: 'September 2026 Baseline',
      date: '2026-09-01',
      income: 48500,
      expenses: 31800,
      savings: 16700,
      notes: 'Initial monthly baseline financial position before hardware upgrades.'
    },
    {
      id: 'snap-2',
      name: 'October 2026 Growth',
      date: '2026-10-01',
      income: 52000,
      expenses: 34500,
      savings: 17500,
      notes: 'Side consulting client engagement begins.'
    },
    {
      id: 'snap-3',
      name: 'December 2026 Pressure',
      date: '2026-12-01',
      income: 45000,
      expenses: 41800,
      savings: 3200,
      notes: 'End-of-year holiday travel and celebrations.'
    }
  ],
  notifications: [
    {
      id: 'n-1',
      title: 'Goal Milestone Achieved',
      message: 'Emergency Fund crossed 40% of target (₹32,000)!',
      type: 'milestone',
      date: '2026-09-16',
      read: false
    },
    {
      id: 'n-2',
      title: 'Upcoming Bill Due',
      message: 'Broadband payment of ₹999 is scheduled in 3 days.',
      type: 'payment',
      date: '2026-09-15',
      read: false
    },
    {
      id: 'n-3',
      title: 'Scenario Impact Calculated',
      message: 'Laptop Purchase simulation ready to review in Scenario Lab.',
      type: 'scenario',
      date: '2026-09-14',
      read: true
    },
    {
      id: 'n-4',
      title: 'Financial Cushion Healthy',
      message: 'Current monthly cushion is ₹16,700 (+34% of income).',
      type: 'cushion',
      date: '2026-09-12',
      read: true
    }
  ]
};

export const MAVRIC_CATEGORIES = [
  'Salary',
  'Housing',
  'Food',
  'Utilities',
  'Travel',
  'Health',
  'Lifestyle',
  'Subscriptions',
  'Investment',
  'Other'
];

export const SEED_FINANCE_DATA = INITIAL_FINANCE;

