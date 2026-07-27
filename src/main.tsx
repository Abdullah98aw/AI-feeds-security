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
import { RouteErrorElement } from './components/RouteErrorElement';
import './styles.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RouteErrorElement />,
    children: [
      { index: true, element: <Dashboard />, errorElement: <RouteErrorElement /> },
      { path: 'investigation/:alertId', element: <Investigation />, errorElement: <RouteErrorElement /> },
      { path: 'accounts/:accountId?', element: <AccountIntelligence />, errorElement: <RouteErrorElement /> },
      { path: 'alerts', element: <AlertManagement />, errorElement: <RouteErrorElement /> },
      { path: 'vulnerabilities', element: <VulnerabilityIntelligence />, errorElement: <RouteErrorElement /> },
      { path: 'dark-web', element: <DarkWebIntelligence />, errorElement: <RouteErrorElement /> },
      { path: 'social-osint', element: <SocialOsint />, errorElement: <RouteErrorElement /> },
      { path: 'cases', element: <Cases />, errorElement: <RouteErrorElement /> },
      { path: 'cases/:caseId', element: <CaseDetail />, errorElement: <RouteErrorElement /> },
      { path: 'unassigned', element: <UnassignedFindings />, errorElement: <RouteErrorElement /> },
      { path: 'sources', element: <ThreatSources />, errorElement: <RouteErrorElement /> },
      { path: 'notifications', element: <NotificationCenter />, errorElement: <RouteErrorElement /> },
      { path: 'audit', element: <AuditLog />, errorElement: <RouteErrorElement /> },
      { path: 'analytics', element: <Analytics />, errorElement: <RouteErrorElement /> },
      { path: 'settings', element: <Settings />, errorElement: <RouteErrorElement /> },
      { path: '*', element: <NotFound />, errorElement: <RouteErrorElement /> }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
