import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import Dashboard from './pages/Dashboard';
import Investigation from './pages/Investigation';
import AccountIntelligence from './pages/AccountIntelligence';
import AlertManagement from './pages/AlertManagement';
import Analytics from './pages/Analytics';
import VulnerabilityIntelligence from './pages/VulnerabilityIntelligence';
import DarkWebIntelligence from './pages/DarkWebIntelligence';
import SocialOsint from './pages/SocialOsint';
import Cases from './pages/Cases';
import CaseDetail from './pages/CaseDetail';
import AuditLog from './pages/AuditLog';
import NotificationCenter from './pages/NotificationCenter';
import ThreatSources from './pages/ThreatSources';
import UnassignedFindings from './pages/UnassignedFindings';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import './styles.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'investigation/:alertId', element: <Investigation /> },
      { path: 'accounts/:accountId?', element: <AccountIntelligence /> },
      { path: 'alerts', element: <AlertManagement /> },
      { path: 'vulnerabilities', element: <VulnerabilityIntelligence /> },
      { path: 'dark-web', element: <DarkWebIntelligence /> },
      { path: 'social-osint', element: <SocialOsint /> },
      { path: 'cases', element: <Cases /> },
      { path: 'cases/:caseId', element: <CaseDetail /> },
      { path: 'unassigned', element: <UnassignedFindings /> },
      { path: 'sources', element: <ThreatSources /> },
      { path: 'notifications', element: <NotificationCenter /> },
      { path: 'audit', element: <AuditLog /> },
      { path: 'analytics', element: <Analytics /> },
      { path: 'settings', element: <Settings /> },
      { path: '*', element: <NotFound /> }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
