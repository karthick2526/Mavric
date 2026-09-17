import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { FinanceProvider } from './context/FinanceContext.jsx';
import { AppShell } from './components/layout/AppShell.jsx';
import { LandingPage } from './pages/LandingPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { TransactionsPage } from './pages/TransactionsPage.jsx';
import { GoalsPage } from './pages/GoalsPage.jsx';
import { ScenariosPage } from './pages/ScenariosPage.jsx';
import { ForecastPage } from './pages/ForecastPage.jsx';
import { InsightsPage } from './pages/InsightsPage.jsx';
import { SubscriptionsPage } from './pages/SubscriptionsPage.jsx';
import { SnapshotsPage } from './pages/SnapshotsPage.jsx';
import { SettingsPage } from './pages/SettingsPage.jsx';

function MainNavigator() {
  const { user, isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('landing');

  // If user is already authenticated and visits, they can go to dashboard
  useEffect(() => {
    // If authenticated and on landing or login, route to dashboard
    if (isAuthenticated && (currentPage === 'landing' || currentPage === 'login')) {
      // Keep on current page if intentionally viewing landing, but default to dashboard if they sign in
    }
  }, [isAuthenticated, currentPage]);

  const handleNavigate = (pageId) => {
    setCurrentPage(pageId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If user requests landing page
  if (currentPage === 'landing') {
    return (
      <LandingPage
        onNavigateLogin={() => setCurrentPage('login')}
        onEnterApp={() => setCurrentPage(isAuthenticated ? 'dashboard' : 'login')}
      />
    );
  }

  // If user requests login
  if (currentPage === 'login') {
    return (
      <LoginPage
        onNavigateLanding={() => setCurrentPage('landing')}
        onLoginSuccess={() => setCurrentPage('dashboard')}
      />
    );
  }

  // App Workspace Views (Dashboard, Transactions, Goals, Scenarios, Forecast, Insights, Subscriptions, Snapshots, Settings)
  return (
    <AppShell activePage={currentPage} onSelectPage={handleNavigate}>
      {currentPage === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}
      {currentPage === 'transactions' && <TransactionsPage />}
      {currentPage === 'goals' && <GoalsPage />}
      {currentPage === 'scenarios' && <ScenariosPage />}
      {currentPage === 'forecast' && <ForecastPage />}
      {currentPage === 'insights' && <InsightsPage onNavigate={handleNavigate} />}
      {currentPage === 'subscriptions' && <SubscriptionsPage />}
      {currentPage === 'snapshots' && <SnapshotsPage />}
      {currentPage === 'settings' && <SettingsPage />}
    </AppShell>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <FinanceProvider>
          <MainNavigator />
        </FinanceProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
